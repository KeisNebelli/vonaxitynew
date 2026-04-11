const router = require('express').Router();
const prisma = require('../lib/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

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
        include: { nurse: { include: { user: true } }, relative: true },
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

    const visits = await prisma.visit.findMany({
      where: { status: 'UNASSIGNED', nurseId: null },
      include: {
        relative: { include: { client: { select: { name: true, country: true } } } },
        applications: { where: { nurseId: nurse.id } },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const normalized = visits.map(v => ({
      id: v.id,
      serviceType: v.serviceType,
      scheduledAt: v.scheduledAt,
      city: v.relative?.city || '',
      notes: v.notes || '',
      status: v.status,
      hasApplied: v.applications.length > 0,
      applicationStatus: v.applications[0]?.status || null,
      postedBy: v.relative?.client?.name || 'A client',
      clientCountry: v.relative?.client?.country || '',
      relativeName: v.relative?.name || '',
    }));

    res.json({ visits: normalized });
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
    }
    const visit = await prisma.visit.create({
      data: { relativeId, serviceType, scheduledAt: new Date(scheduledAt), notes, status: 'UNASSIGNED' },
      include: { relative: true },
    });
    console.log(`📋 New work order: ${visit.id} — ${serviceType}`);
    res.status(201).json({ success: true, visit });
  } catch (err) {
    console.error('Create visit error:', err);
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

// POST /visits/:id/apply — nurse applies to job
router.post('/:id/apply', ...requireRole('NURSE'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId } });
    if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });
    if (nurse.status !== 'APPROVED') return res.status(403).json({ error: 'Profile must be approved to apply' });
    const visit = await prisma.visit.findUnique({ where: { id: req.params.id } });
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    if (visit.status !== 'UNASSIGNED') return res.status(400).json({ error: 'This job is no longer open' });
    const existing = await prisma.visitApplication.findFirst({ where: { visitId: req.params.id, nurseId: nurse.id } });
    if (existing) return res.status(400).json({ error: 'You already applied to this job' });
    const application = await prisma.visitApplication.create({
      data: { visitId: req.params.id, nurseId: nurse.id, message: req.body.message || '', status: 'PENDING' },
    });
    console.log(`✅ Nurse ${nurse.id} applied to visit ${req.params.id}`);
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
      if (!visit || visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
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
    if (req.user.role === 'CLIENT') {
      const visit = await prisma.visit.findUnique({ where: { id: visitId }, include: { relative: true } });
      if (!visit || visit.relative.clientId !== req.user.userId) return res.status(403).json({ error: 'Not your visit' });
      if (visit.status !== 'UNASSIGNED') return res.status(400).json({ error: 'Visit already assigned' });
    }
    const application = await prisma.visitApplication.findFirst({ where: { visitId, nurseId } });
    if (!application) return res.status(400).json({ error: 'This nurse did not apply to this visit' });
    const visit = await prisma.visit.update({ where: { id: visitId }, data: { nurseId, status: 'PENDING' } });
    await prisma.visitApplication.update({ where: { id: application.id }, data: { status: 'ACCEPTED' } });
    await prisma.visitApplication.updateMany({ where: { visitId, id: { not: application.id } }, data: { status: 'REJECTED' } });
    console.log(`✅ Nurse ${nurseId} selected for visit ${visitId}`);
    res.json({ success: true, visit });
  } catch (err) {
    console.error('Select nurse error:', err);
    res.status(500).json({ error: 'Failed to select nurse' });
  }
});

// PUT /visits/:id — admin updates
router.put('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { nurseId, status } = req.body;
    const visit = await prisma.visit.update({ where: { id: req.params.id }, data: { ...(nurseId !== undefined && { nurseId }), ...(status && { status }) } });
    res.json({ success: true, visit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update visit' });
  }
});

// POST /visits/:id/complete — nurse submits report
router.post('/:id/complete', ...requireRole('NURSE'), async (req, res) => {
  try {
    const { bp, hr, glucose, temperature, oxygenSat, nurseNotes } = req.body;
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId } });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
    let bpSystolic = null, bpDiastolic = null;
    if (bp && bp.includes('/')) { const p = bp.split('/'); bpSystolic = parseInt(p[0]); bpDiastolic = parseInt(p[1]); }
    const visit = await prisma.visit.update({
      where: { id: req.params.id, nurseId: nurse.id },
      data: { status: 'COMPLETED', completedAt: new Date(), bpSystolic, bpDiastolic, heartRate: hr ? parseInt(hr) : null, glucose: glucose ? parseFloat(glucose) : null, temperature: temperature ? parseFloat(temperature) : null, oxygenSat: oxygenSat ? parseFloat(oxygenSat) : null, nurseNotes: nurseNotes || null, reportSent: false },
    });
    await prisma.nurse.update({ where: { id: nurse.id }, data: { totalVisits: { increment: 1 }, totalEarnings: { increment: nurse.payRatePerVisit } } });
    const relative = await prisma.relative.findUnique({ where: { id: visit.relativeId } });
    await prisma.subscription.updateMany({ where: { userId: relative.clientId }, data: { visitsUsed: { increment: 1 } } });
    res.json({ success: true, visit });
  } catch (err) {
    console.error('Complete visit error:', err);
    res.status(500).json({ error: 'Failed to complete visit' });
  }
});

module.exports = router;
