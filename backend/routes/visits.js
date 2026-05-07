/**
 * routes/visits.js — Visit (work order) lifecycle management
 *
 * Booking flow summary:
 *   1. CLIENT: POST /visits → creates visit with status UNASSIGNED + work order number
 *              → notifies approved nurses in the same city (in-app + email)
 *   2. NURSE:  POST /visits/:id/apply → nurse applies to the open visit
 *   3. CLIENT: GET /visits/:id/applicants → client sees list of nurses who applied
 *   4. CLIENT: POST /visits/:id/select/:nurseId → client picks a nurse → status: ACCEPTED
 *   5. NURSE:  PUT /visits/:id/status → nurse updates: ON_THE_WAY → ARRIVED → IN_PROGRESS
 *   6. NURSE:  POST /visits/:id/complete → nurse submits vitals + notes → status: COMPLETED
 *              → increments nurse.totalVisits + subscription.visitsUsed
 *              → sends health report email to client
 *   7. CLIENT: POST /visits/:id/review → client rates the nurse (1–5 stars)
 *              → recalculates nurse.rating average
 *
 * Visit status values (stored as strings):
 *   UNASSIGNED → PENDING → ACCEPTED → ON_THE_WAY → ARRIVED → IN_PROGRESS → COMPLETED
 *   (or) → CANCELLED | NO_SHOW at any point
 *
 * Rate limiting: 30 requests / 15 min per IP (applied in server.js on /visits prefix)
 */
const router = require('express').Router();
const prisma = require('../lib/db');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../lib/email');
const { createNotification } = require('../lib/notifications');

// ── Work order number generator ───────────────────────────────────────────────
async function generateWorkOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `VON-${year}-`;
  // Find the highest existing number for this year
  const last = await prisma.visit.findFirst({
    where: { workOrderNumber: { startsWith: prefix } },
    orderBy: { workOrderNumber: 'desc' },
  });
  let next = 1;
  if (last?.workOrderNumber) {
    const seq = parseInt(last.workOrderNumber.replace(prefix, ''), 10);
    if (!isNaN(seq)) next = seq + 1;
  }
  // Loop to guarantee uniqueness (handles race conditions)
  let candidate, exists;
  do {
    candidate = `${prefix}${String(next).padStart(5, '0')}`;
    exists = await prisma.visit.findUnique({ where: { workOrderNumber: candidate } });
    if (exists) next++;
  } while (exists);
  return candidate;
}

// GET /visits — role-based
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = req.user;
    let visits;
    if (role === 'ADMIN') {
      visits = await prisma.visit.findMany({
        include: { relative: { include: { client: true } }, nurse: { include: { user: true } } },
        orderBy: { scheduledAt: 'desc' },
      });
    } else if (role === 'NURSE') {
      const nurse = await prisma.nurse.findUnique({ where: { userId } });
      if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });
      visits = await prisma.visit.findMany({
        where: { nurseId: nurse.id },
        include: { relative: { include: { client: true } } },
        orderBy: { scheduledAt: 'desc' },
      });
    } else {
      const relatives = await prisma.relative.findMany({ where: { clientId: userId } });
      const relativeIds = relatives.map(r => r.id);
      visits = await prisma.visit.findMany({
        where: { relativeId: { in: relativeIds } },
        include: { nurse: { include: { user: true } }, relative: true, review: true },
        orderBy: { scheduledAt: 'desc' },
      });
    }
    const normalized = visits.map(v => ({ ...v, clientName: v.relative?.client?.name || v.relative?.name || 'Unknown', service: v.serviceType, nurseName: v.nurse?.user?.name || null, city: v.relative?.city || '' }));
    res.json({ visits: normalized });
  } catch (err) {
    console.error('Get visits error:', err);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// GET /visits/open — nurse browses open jobs
router.get('/open', ...requireRole('NURSE'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId } });
    if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });
    if (nurse.status !== 'APPROVED') return res.status(403).json({ error: 'Profile must be approved to browse jobs' });

    // Default to nurse's city, unless ?allCities=true is passed
    const filterByCity = req.query.allCities !== 'true' && nurse.city;
    const whereClause = {
      status: 'UNASSIGNED', nurseId: null,
      ...(filterByCity && { relative: { city: nurse.city } }),
    };

    const visits = await prisma.visit.findMany({
      where: whereClause,
      include: { relative: { include: { client: { select: { name: true, country: true } } } }, applications: { where: { nurseId: nurse.id } } },
      orderBy: { scheduledAt: 'asc' },
    });
    const normalized = visits.map(v => ({
      id: v.id, serviceType: v.serviceType, scheduledAt: v.scheduledAt,
      city: v.relative?.city || '', notes: v.notes || '', status: v.status,
      hasApplied: v.applications.length > 0, applicationStatus: v.applications[0]?.status || null,
      postedBy: v.relative?.client?.name || 'A client',
      clientCountry: v.relative?.client?.country || '',
      relativeName: v.relative?.name || '',
      relativeAge: v.relative?.age || null,
      relativeAddress: v.relative?.address || '',
      relativePhone: v.relative?.phone || '',
      createdAt: v.createdAt,
    }));
    res.json({ visits: normalized, nurseCity: nurse.city || null, filtered: !!filterByCity });
  } catch (err) {
    console.error('Get open visits error:', err);
    res.status(500).json({ error: 'Failed to fetch open jobs' });
  }
});

// POST /visits — client creates work order
router.post('/', ...requireRole('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    const { relativeId, serviceType, scheduledAt, notes } = req.body;
    if (!relativeId || !serviceType || !scheduledAt) return res.status(400).json({ error: 'relativeId, serviceType and scheduledAt are required' });
    if (req.user.role === 'CLIENT') {
      const relative = await prisma.relative.findUnique({ where: { id: relativeId } });
      if (!relative || relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Relative not found or not yours' });

      // Check subscription limits (visitsPerMonth >= 999 = unlimited test account)
      const subscription = await prisma.subscription.findUnique({ where: { userId: req.user.userId } });
      if (!subscription) return res.status(403).json({ error: 'No active subscription. Please choose a plan first.' });
      if (subscription.status === 'CANCELLED') return res.status(403).json({ error: 'Your subscription has been cancelled. Please reactivate to book visits.' });
      const isUnlimited = subscription.visitsPerMonth >= 999;
      if (!isUnlimited && subscription.visitsUsed >= subscription.visitsPerMonth) {
        return res.status(403).json({ error: `You have used all ${subscription.visitsPerMonth} visits for this month. Upgrade your plan for more visits.` });
      }
    }
    // Dedup guard — prevent double submissions within 10 seconds
    const recent = await prisma.visit.findFirst({
      where: {
        relativeId,
        serviceType,
        scheduledAt: new Date(scheduledAt),
        createdAt: { gte: new Date(Date.now() - 10000) },
      },
    });
    if (recent) return res.status(409).json({ error: 'This visit was already booked. Please refresh your dashboard.' });

    const workOrderNumber = await generateWorkOrderNumber();
    const visit = await prisma.visit.create({
      data: { relativeId, serviceType, scheduledAt: new Date(scheduledAt), notes, status: 'UNASSIGNED', workOrderNumber },
      include: { relative: true },
    });

    // After visit is created — notify approved nurses in city
    const city = visit.relative?.city;
    if (city) {
      const nursesInCity = await prisma.nurse.findMany({
        where: { status: 'APPROVED', city },
        select: { userId: true },
      });
      for (const n of nursesInCity) {
        await createNotification({
          userId: n.userId,
          type: 'NEW_JOB',
          title: 'New job available',
          message: `A new ${visit.serviceType} visit is available in ${city}.`,
          relatedId: visit.id,
        });
      }
    }

    // Notify approved nurses in the same city
    try {
      const city = visit.relative?.city;
      if (city) {
        const nurses = await prisma.nurse.findMany({
          where: { status: 'APPROVED', city },
          include: { user: { select: { name: true, email: true } } },
        });
        for (const nurse of nurses) {
          if (nurse.user?.email) {
            const tmpl = emailTemplates.newJobPosted({ nurseName: nurse.user.name, serviceType, city, scheduledAt, visitId: visit.id });
            sendEmail({ to: nurse.user.email, ...tmpl });
          }
        }
      }

      // Send booking confirmation to client
      const clientUser = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { name: true, email: true } });
      if (clientUser?.email) {
        const tmpl = emailTemplates.bookingConfirmed({
          clientName: clientUser.name,
          serviceType,
          city: visit.relative?.city || '',
          scheduledAt,
          relativeName: visit.relative?.name || 'your loved one',
          workOrderNumber: visit.workOrderNumber,
        });
        sendEmail({ to: clientUser.email, ...tmpl });
      }
    } catch (emailErr) { console.error('Email notification error:', emailErr); }
    res.status(201).json({ success: true, visit });
  } catch (err) {
    console.error('Create visit error:', err);
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

// POST /visits/:id/apply — nurse applies to job
router.post('/:id/apply', ...requireRole('NURSE'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId }, include: { user: { select: { name: true, email: true } } } });
    if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });
    if (nurse.status !== 'APPROVED') return res.status(403).json({ error: 'Profile must be approved to apply' });
    const visit = await prisma.visit.findUnique({ where: { id: req.params.id }, include: { relative: { include: { client: { select: { name: true, email: true } } } } } });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    if (visit.status !== 'UNASSIGNED') return res.status(400).json({ error: 'This job is no longer open' });
    const existing = await prisma.visitApplication.findFirst({ where: { visitId: req.params.id, nurseId: nurse.id } });
    if (existing) return res.status(400).json({ error: 'You already applied to this job' });
    const application = await prisma.visitApplication.create({
      data: { visitId: req.params.id, nurseId: nurse.id, message: req.body.message || '', status: 'PENDING' },
    });

    // After application saved — notify client with nurse name + photo
    const visitForNotif = await prisma.visit.findUnique({
      where: { id: req.params.id },
      include: { relative: { include: { client: true } } },
    });
    if (visitForNotif) {
      await createNotification({
        userId: visitForNotif.relative.clientId,
        type: 'NURSE_APPLIED',
        title: `${nurse.user.name} applied for your visit`,
        message: `${nurse.user.name} applied for your ${visitForNotif.serviceType} visit in ${visitForNotif.relative?.city || ''}.`,
        relatedId: req.params.id,
        actorName: nurse.user.name,
        actorPhoto: nurse.profilePhotoUrl || null,
      });
    }

    // Notify client that a nurse applied
    try {
      const client = visit.relative?.client;
      if (client?.email) {
        const tmpl = emailTemplates.nurseApplied({ clientName: client.name, nurseName: nurse.user.name, nurseCity: nurse.city, serviceType: visit.serviceType, visitId: visit.id });
        sendEmail({ to: client.email, ...tmpl });
      }
    } catch (emailErr) { console.error('Email notification error:', emailErr); }
    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

// GET /visits/:id/applicants — client sees applicants
router.get('/:id/applicants', ...requireRole('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    if (req.user.role === 'CLIENT') {
      const visit = await prisma.visit.findUnique({ where: { id: req.params.id }, include: { relative: true } });
      if (!visit || !visit.relative || visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
    }
    const applications = await prisma.visitApplication.findMany({
      where: { visitId: req.params.id },
      include: { nurse: { include: { user: { select: { name: true, email: true, phone: true } } } } },
      orderBy: { createdAt: 'asc' },
    });
    const normalized = applications.map(a => ({
      id: a.id, status: a.status, message: a.message, createdAt: a.createdAt,
      nurse: { id: a.nurse.id, name: a.nurse.user?.name || 'Unknown', email: a.nurse.user?.email || '', phone: a.nurse.user?.phone || '', city: a.nurse.city, rating: a.nurse.rating, totalVisits: a.nurse.totalVisits, experience: a.nurse.experience, bio: a.nurse.bio, licenseNumber: a.nurse.licenseNumber, profilePhotoUrl: a.nurse.profilePhotoUrl },
    }));
    res.json({ applications: normalized });
  } catch (err) {
    console.error('Get applicants error:', err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// POST /visits/:id/select/:nurseId — client selects a nurse
router.post('/:id/select/:nurseId', ...requireRole('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    const { id: visitId, nurseId } = req.params;
    const visit = await prisma.visit.findUnique({ where: { id: visitId }, include: { relative: { include: { client: true } } } });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    if (req.user.role === 'CLIENT') {
      if (visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
      if (visit.status !== 'UNASSIGNED') return res.status(400).json({ error: 'Visit already assigned' });
    }
    const application = await prisma.visitApplication.findFirst({ where: { visitId, nurseId } });
    if (!application) return res.status(400).json({ error: 'This nurse did not apply to this visit' });
    const nurse = await prisma.nurse.findUnique({ where: { id: nurseId }, include: { user: { select: { name: true, email: true } } } });
    await prisma.visit.update({ where: { id: visitId }, data: { nurseId, status: 'PENDING' } });
    await prisma.visitApplication.update({ where: { id: application.id }, data: { status: 'ACCEPTED' } });
    await prisma.visitApplication.updateMany({ where: { visitId, id: { not: application.id } }, data: { status: 'REJECTED' } });

    // After nurse is selected — notify the nurse AND confirm to client
    const visitForNotif = await prisma.visit.findUnique({ where: { id: visitId }, include: { relative: true } });
    if (nurse && visitForNotif) {
      // Notify nurse
      await createNotification({
        userId: nurse.userId,
        type: 'JOB_ASSIGNED',
        title: 'Job assigned to you',
        message: `You have been assigned a ${visitForNotif.serviceType} visit in ${visitForNotif.relative.city}.`,
        relatedId: visitId,
      });
      // Confirm to client that nurse is booked
      await createNotification({
        userId: visitForNotif.relative.clientId,
        type: 'NURSE_ASSIGNED',
        title: `${nurse.user.name} confirmed for your visit`,
        message: `${nurse.user.name} has been assigned to your ${visitForNotif.serviceType} visit on ${new Date(visitForNotif.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}.`,
        relatedId: visitId,
        actorName: nurse.user.name,
        actorPhoto: nurse.profilePhotoUrl || null,
      });
    }

    // Notify nurse they were selected
    try {
      if (nurse?.user?.email) {
        const tmpl = emailTemplates.nurseSelected({ nurseName: nurse.user.name, clientName: visit.relative?.client?.name || 'A client', serviceType: visit.serviceType, city: visit.relative?.city || '', scheduledAt: visit.scheduledAt, relativeName: visit.relative?.name || 'Patient' });
        sendEmail({ to: nurse.user.email, ...tmpl });
      }
    } catch (emailErr) { console.error('Email notification error:', emailErr); }
    res.json({ success: true, visit });
  } catch (err) {
    console.error('Select nurse error:', err);
    res.status(500).json({ error: 'Failed to select nurse' });
  }
});


// PUT /visits/:id/client — client edits their own UNASSIGNED ticket
router.put('/:id/client', ...requireRole('CLIENT'), async (req, res) => {
  try {
    const { serviceType, scheduledAt, notes } = req.body;
    const visit = await prisma.visit.findUnique({
      where: { id: req.params.id },
      include: { relative: true },
    });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    if (!visit.relative || visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
    if (!['UNASSIGNED'].includes(visit.status)) return res.status(400).json({ error: 'Only unassigned visits can be edited. Contact support for changes to active visits.' });

    const updated = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        ...(serviceType && { serviceType }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(notes !== undefined && { notes }),
      },
      include: { relative: true, nurse: { include: { user: { select: { name: true } } } } },
    });

    // Notify assigned nurse if any
    const visitForNotif = await prisma.visit.findUnique({ where: { id: req.params.id }, include: { nurse: true } });
    if (visitForNotif?.nurse?.userId) {
      await createNotification({
        userId: visitForNotif.nurse.userId,
        type: 'JOB_UPDATED',
        title: 'Job updated',
        message: `A client has updated the details of your scheduled ${visitForNotif.serviceType} visit.`,
        relatedId: req.params.id,
      });
    }

    res.json({ success: true, visit: updated });
  } catch (err) {
    console.error('Edit visit error:', err);
    res.status(500).json({ error: 'Failed to update visit' });
  }
});

// DELETE /visits/:id — client deletes their own ticket
router.delete('/:id', ...requireRole('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    const visit = await prisma.visit.findUnique({
      where: { id: req.params.id },
      include: { relative: true },
    });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });

    // Authorization — only owner or admin
    if (req.user.role === 'CLIENT') {
      if (visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
      if (['COMPLETED'].includes(visit.status)) return res.status(400).json({ error: 'Completed visits cannot be deleted' });
      if (['PENDING', 'ACCEPTED'].includes(visit.status)) return res.status(400).json({ error: 'A nurse has already been assigned. Please contact support to cancel.' });
    }

    // Delete related records first to avoid FK constraint errors
    await prisma.visitApplication.deleteMany({ where: { visitId: req.params.id } });
    await prisma.notification.deleteMany({ where: { relatedId: req.params.id } });
    await prisma.visit.delete({ where: { id: req.params.id } });

    // Restore visit count — only if it was UNASSIGNED (not yet completed)
    // visitsUsed is only incremented on COMPLETE, so no need to decrement here
    // But if we want to track "booked" separately we would. For now: no decrement on delete.
    res.json({ success: true });
  } catch (err) {
    console.error('Delete visit error:', err);
    res.status(500).json({ error: 'Failed to delete visit' });
  }
});

// PUT /visits/:id — admin updates (assign nurse, change status)
router.put('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { nurseId, status, notes } = req.body;
    const allowed = ['UNASSIGNED','PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','NO_SHOW','CANCELLED'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }
    const visit = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        ...(nurseId !== undefined && { nurseId: nurseId || null }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(status === 'CANCELLED' && { completedAt: new Date() }),
      },
      include: { relative: { include: { client: true } }, nurse: { include: { user: true } } },
    });

    // Notify based on new status
    if (status === 'CANCELLED') {
      const clientId = visit.relative.clientId;
      const nurseUserId = visit.nurse?.userId;
      if (clientId) await createNotification({ userId: clientId, type: 'VISIT_CANCELLED', title: 'Visit cancelled', message: `Your ${visit.serviceType} visit has been cancelled.`, relatedId: req.params.id });
      if (nurseUserId) await createNotification({ userId: nurseUserId, type: 'VISIT_CANCELLED', title: 'Job cancelled', message: `A ${visit.serviceType} job you were assigned has been cancelled.`, relatedId: req.params.id });

      // Send cancellation emails
      const clientUser = visit.relative?.client;
      if (clientUser?.email) {
        sendEmail({ to: clientUser.email, ...emailTemplates.visitCancelled({ clientName: clientUser.name, serviceType: visit.serviceType, scheduledAt: visit.scheduledAt }) })
          .catch(e => console.error('Cancellation email (client) error:', e));
      }
      if (visit.nurse?.user?.email) {
        sendEmail({ to: visit.nurse.user.email, ...emailTemplates.visitCancelledNurse({ nurseName: visit.nurse.user.name, serviceType: visit.serviceType, scheduledAt: visit.scheduledAt }) })
          .catch(e => console.error('Cancellation email (nurse) error:', e));
      }
    }

    // visit updated
    res.json({ success: true, visit });
  } catch (err) {
    console.error('Admin update visit error:', err);
    res.status(500).json({ error: 'Failed to update visit' });
  }
});

// PUT /visits/:id/status — nurse updates visit status (ON_THE_WAY, ARRIVED, IN_PROGRESS)
router.put('/:id/status', ...requireRole('NURSE'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'ACCEPTED', 'NO_SHOW'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId } });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
    // Verify this visit belongs to this nurse
    const visit = await prisma.visit.findFirst({ where: { id: req.params.id, nurseId: nurse.id } });
    if (!visit) return res.status(403).json({ error: 'Visit not found or not assigned to you' });
    const updated = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'IN_PROGRESS' ? { startedAt: new Date() } : {}),
        ...(status === 'NO_SHOW' ? { completedAt: new Date() } : {}),
      },
    });

    // Notify based on new status
    const visitForNotif = await prisma.visit.findUnique({
      where: { id: req.params.id },
      include: { relative: true, nurse: { include: { user: true } } }
    });
    if (visitForNotif) {
      const clientId = visitForNotif.relative.clientId;
      const nurseUserId = visitForNotif.nurse?.userId;
      if (status === 'ON_THE_WAY' && clientId) {
        await createNotification({ userId: clientId, type: 'NURSE_ON_WAY', title: 'Nurse on the way', message: `Your nurse is on the way for your ${visitForNotif.serviceType} visit.`, relatedId: req.params.id });
      } else if (status === 'ARRIVED' && clientId) {
        await createNotification({ userId: clientId, type: 'NURSE_ARRIVED', title: 'Nurse has arrived', message: `Your nurse has arrived for your ${visitForNotif.serviceType} visit.`, relatedId: req.params.id });
      }
    }

    res.json({ success: true, visit: updated });
  } catch (err) {
    console.error('Nurse status update error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// POST /visits/:id/complete — nurse submits report
router.post('/:id/complete', ...requireRole('NURSE'), async (req, res) => {
  try {
    const { bp, hr, glucose, temperature, oxygenSat, nurseNotes } = req.body;
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId }, include: { user: { select: { name: true } } } });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
    let bpSystolic = null, bpDiastolic = null;
    if (bp && bp.includes('/')) { const p = bp.split('/'); bpSystolic = parseInt(p[0]); bpDiastolic = parseInt(p[1]); }
    const visit = await prisma.visit.update({
      where: { id: req.params.id, nurseId: nurse.id },
      data: { status: 'COMPLETED', completedAt: new Date(), bpSystolic, bpDiastolic, heartRate: hr ? parseInt(hr) : null, glucose: glucose ? parseFloat(glucose) : null, temperature: temperature ? parseFloat(temperature) : null, oxygenSat: oxygenSat ? parseFloat(oxygenSat) : null, nurseNotes: nurseNotes || null, reportSent: true },
      include: { relative: { include: { client: { select: { name: true, email: true } } } } },
    });
    await prisma.nurse.update({ where: { id: nurse.id }, data: { totalVisits: { increment: 1 }, totalEarnings: { increment: nurse.payRatePerVisit } } });
    const relative = await prisma.relative.findUnique({ where: { id: visit.relativeId } });
    if (relative?.clientId) {
      // Only increment for non-unlimited (test) accounts
      const sub = await prisma.subscription.findUnique({ where: { userId: relative.clientId } });
      if (sub && sub.visitsPerMonth < 999) {
        await prisma.subscription.updateMany({ where: { userId: relative.clientId }, data: { visitsUsed: { increment: 1 } } });
      }
    }

    // Notify client
    const visitForNotif = await prisma.visit.findUnique({ where: { id: req.params.id }, include: { relative: true } });
    if (visitForNotif) {
      await createNotification({
        userId: visitForNotif.relative.clientId,
        type: 'VISIT_COMPLETED',
        title: 'Visit completed',
        message: `Your ${visitForNotif.serviceType} visit has been completed successfully.`,
        relatedId: req.params.id,
      });
    }

    // Send health report to client
    try {
      const client = visit.relative?.client;
      if (client?.email) {
        const tmpl = emailTemplates.visitCompleted({ clientName: client.name, nurseName: nurse.user.name, relativeName: visit.relative?.name || 'your loved one', serviceType: visit.serviceType, scheduledAt: visit.scheduledAt, bp: bpSystolic ? `${bpSystolic}/${bpDiastolic}` : null, glucose, notes: nurseNotes });
        sendEmail({ to: client.email, ...tmpl });
      }
    } catch (emailErr) { console.error('Email notification error:', emailErr); }

    res.json({ success: true, visit });
  } catch (err) {
    console.error('Complete visit error:', err);
    res.status(500).json({ error: 'Failed to complete visit' });
  }
});

// GET /visits/vitals/:relativeId — health vitals history for a patient
router.get('/vitals/:relativeId', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { relativeId } = req.params;
    const relative = await prisma.relative.findUnique({ where: { id: relativeId }, select: { id:true, name:true, age:true, city:true, clientId:true } });
    if (!relative) return res.status(404).json({ error: 'Patient not found' });
    if (role === 'CLIENT' && relative.clientId !== userId) return res.status(403).json({ error: 'Access denied' });
    if (role === 'NURSE') {
      const nurse = await prisma.nurse.findUnique({ where: { userId } });
      if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
      const linked = await prisma.visit.findFirst({ where: { relativeId, nurseId: nurse.id } });
      if (!linked) return res.status(403).json({ error: 'Access denied' });
    }
    const visits = await prisma.visit.findMany({
      where: {
        relativeId,
        status: 'COMPLETED',
        OR: [{ bpSystolic: { not: null } }, { heartRate: { not: null } }, { glucose: { not: null } }, { oxygenSat: { not: null } }, { temperature: { not: null } }],
      },
      orderBy: { completedAt: 'asc' },
      select: {
        id: true, completedAt: true, scheduledAt: true, serviceType: true,
        bpSystolic: true, bpDiastolic: true, heartRate: true, glucose: true,
        temperature: true, oxygenSat: true, nurseNotes: true,
        nurse: { select: { user: { select: { name: true } } } },
      },
    });
    res.json({ vitals: visits, relative });
  } catch (err) {
    console.error('Vitals fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

module.exports = router;

// POST /visits/:id/review — client submits review after completed visit
router.post('/:id/review', ...requireRole('CLIENT'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    const visit = await prisma.visit.findUnique({
      where: { id: req.params.id },
      include: { relative: true },
    });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    if (visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
    if (visit.status !== 'COMPLETED') return res.status(400).json({ error: 'Can only review completed visits' });
    if (!visit.nurseId) return res.status(400).json({ error: 'No nurse assigned to this visit' });
    // Check if already reviewed
    const existing = await prisma.review.findUnique({ where: { visitId: req.params.id } });
    if (existing) return res.status(400).json({ error: 'You have already reviewed this visit' });
    const review = await prisma.review.create({
      data: { visitId: req.params.id, nurseId: visit.nurseId, rating: parseInt(rating), comment: comment || null },
    });
    // Update nurse average rating
    const allReviews = await prisma.review.findMany({ where: { nurseId: visit.nurseId } });
    const avg = allReviews.length ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;
    await prisma.nurse.update({ where: { id: visit.nurseId }, data: { rating: Math.round(avg * 10) / 10 } });
    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});
