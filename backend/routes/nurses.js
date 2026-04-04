const router = require('express').Router();
const prisma = require('../lib/db');
const { requireRole } = require('../middleware/auth');

// GET /nurses
router.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const nurses = await prisma.nurse.findMany({
      include: { user: true, visits: { where: { status: 'COMPLETED' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ nurses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nurses' });
  }
});

// GET /nurses/me — nurse gets own profile
router.get('/me', ...requireRole('NURSE'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: true,
        visits: { include: { relative: true }, orderBy: { scheduledAt: 'desc' }, take: 10 },
        reviews: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!nurse) return res.status(404).json({ error: 'Nurse profile not found' });
    res.json({ nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nurse profile' });
  }
});

// PUT /nurses/:id/approve
router.put('/:id/approve', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve nurse' });
  }
});

// PUT /nurses/:id/suspend
router.put('/:id/suspend', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.update({
      where: { id: req.params.id },
      data: { status: 'SUSPENDED' },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to suspend nurse' });
  }
});

// PUT /nurses/:id/reject
router.put('/:id/reject', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { reason } = req.body;
    const nurse = await prisma.nurse.update({
      where: { id: req.params.id },
      data: { status: 'SUSPENDED', rejectionReason: reason || 'Application rejected by admin' },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject nurse' });
  }
});
router.put('/:id/availability', ...requireRole('NURSE', 'ADMIN'), async (req, res) => {
  try {
    const { availability } = req.body;
    const nurse = await prisma.nurse.update({
      where: { id: req.params.id },
      data: { availability },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

module.exports = router;
