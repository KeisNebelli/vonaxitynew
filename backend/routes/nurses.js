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

// PUT /nurses/me/onboarding — nurse submits completed profile for review
router.put('/me/onboarding', ...requireRole('NURSE'), async (req, res) => {
  try {
    const { city, bio, experience, languages, services, licenseNumber, issuingAuthority, availability, diplomaUrl, licenseUrl } = req.body;

    if (!city || !bio || !licenseNumber || !issuingAuthority) {
      return res.status(400).json({ error: 'Please complete all required fields before submitting.' });
    }

    const nurse = await prisma.nurse.update({
      where: { userId: req.user.userId },
      data: {
        city, bio, experience: experience || '',
        languages: JSON.stringify(languages || []),
        services: JSON.stringify(services || []),
        licenseNumber, issuingAuthority,
        availability: JSON.stringify(availability || []),
        diplomaUrl: diplomaUrl || null,
        licenseUrl: licenseUrl || null,
        status: 'PENDING',
        submittedAt: new Date(),
      },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit onboarding' });
  }
});

// PUT /nurses/me/profile — nurse saves profile progress
router.put('/me/profile', ...requireRole('NURSE'), async (req, res) => {
  try {
    const { city, bio, experience, languages, services, licenseNumber, issuingAuthority, availability, diplomaUrl, licenseUrl } = req.body;
    const nurse = await prisma.nurse.update({
      where: { userId: req.user.userId },
      data: {
        ...(city !== undefined && { city }),
        ...(bio !== undefined && { bio }),
        ...(experience !== undefined && { experience }),
        ...(languages !== undefined && { languages: JSON.stringify(languages) }),
        ...(services !== undefined && { services: JSON.stringify(services) }),
        ...(licenseNumber !== undefined && { licenseNumber }),
        ...(issuingAuthority !== undefined && { issuingAuthority }),
        ...(availability !== undefined && { availability: JSON.stringify(availability) }),
        ...(diplomaUrl !== undefined && { diplomaUrl }),
        ...(licenseUrl !== undefined && { licenseUrl }),
      },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});
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
