const router = require('express').Router();
const prisma = require('../lib/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /visits — get visits based on role
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
      // CLIENT — get visits for their relatives
      const relatives = await prisma.relative.findMany({ where: { clientId: userId } });
      const relativeIds = relatives.map(r => r.id);
      visits = await prisma.visit.findMany({
        where: { relativeId: { in: relativeIds } },
        include: { nurse: { include: { user: true } }, relative: true },
        orderBy: { scheduledAt: 'desc' },
      });
    }

    res.json({ visits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// POST /visits — create visit (admin or client)
router.post('/', ...requireRole('CLIENT', 'ADMIN'), async (req, res) => {
  try {
    const { relativeId, serviceType, scheduledAt, notes } = req.body;
    if (!relativeId || !serviceType || !scheduledAt) {
      return res.status(400).json({ error: 'relativeId, serviceType and scheduledAt are required' });
    }

    const visit = await prisma.visit.create({
      data: { relativeId, serviceType, scheduledAt: new Date(scheduledAt), notes, status: 'UNASSIGNED' },
    });

    // Try auto-assign
    const relative = await prisma.relative.findUnique({ where: { id: relativeId } });
    const visitDay = new Date(scheduledAt).toLocaleDateString('en-US', { weekday: 'long' });
    const nurse = await prisma.nurse.findFirst({
      where: { status: 'APPROVED', city: relative.city, availability: { has: visitDay } },
      orderBy: { totalVisits: 'asc' },
    });

    if (nurse) {
      await prisma.visit.update({
        where: { id: visit.id },
        data: { nurseId: nurse.id, status: 'PENDING' },
      });
    }

    res.status(201).json({ success: true, visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

// PUT /visits/:id — update visit (assign nurse, change status)
router.put('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { nurseId, status } = req.body;
    const visit = await prisma.visit.update({
      where: { id: req.params.id },
      data: {
        ...(nurseId !== undefined && { nurseId }),
        ...(status && { status }),
      },
    });
    res.json({ success: true, visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update visit' });
  }
});

// POST /visits/:id/complete — nurse submits visit report
router.post('/:id/complete', ...requireRole('NURSE'), async (req, res) => {
  try {
    const { bp, hr, glucose, temperature, oxygenSat, nurseNotes } = req.body;
    const nurse = await prisma.nurse.findUnique({ where: { userId: req.user.userId } });
    if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });

    // Parse BP e.g. "128/82"
    let bpSystolic = null, bpDiastolic = null;
    if (bp && bp.includes('/')) {
      const parts = bp.split('/');
      bpSystolic = parseInt(parts[0]);
      bpDiastolic = parseInt(parts[1]);
    }

    const visit = await prisma.visit.update({
      where: { id: req.params.id, nurseId: nurse.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        bpSystolic, bpDiastolic,
        heartRate: hr ? parseInt(hr) : null,
        glucose: glucose ? parseFloat(glucose) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        oxygenSat: oxygenSat ? parseFloat(oxygenSat) : null,
        nurseNotes: nurseNotes || null,
        reportSent: false,
      },
    });

    // Update nurse stats
    await prisma.nurse.update({
      where: { id: nurse.id },
      data: { totalVisits: { increment: 1 }, totalEarnings: { increment: nurse.payRatePerVisit } },
    });

    // Update subscription visit count
    const relative = await prisma.relative.findUnique({ where: { id: visit.relativeId } });
    await prisma.subscription.updateMany({
      where: { userId: relative.clientId },
      data: { visitsUsed: { increment: 1 } },
    });

    console.log(`📋 Visit report submitted by nurse. Visit ID: ${visit.id}`);
    res.json({ success: true, visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete visit' });
  }
});

module.exports = router;
