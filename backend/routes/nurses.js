const router = require('express').Router();
const prisma = require('../lib/db');
const { requireRole } = require('../middleware/auth');

// GET /nurses — admin gets all nurses with full profile
router.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const nurses = await prisma.nurse.findMany({
      include: {
        user: { select: { id:true, name:true, email:true, phone:true, createdAt:true } },
        visits: { where: { status: 'COMPLETED' }, select: { id:true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Normalize for admin display
    const normalized = nurses.map(n => ({
      id: n.id,
      userId: n.userId,
      name: n.user?.name || 'Unknown',
      email: n.user?.email || '',
      phone: n.user?.phone || '',
      city: n.city || '',
      status: n.status || 'INCOMPLETE',
      rating: n.rating || 0,
      totalVisits: n.visits?.length || 0,
      totalEarnings: n.totalEarnings || 0,
      licenseNumber: n.licenseNumber || '',
      issuingAuthority: n.issuingAuthority || '',
      bio: n.bio || '',
      experience: n.experience || '',
      languages: n.languages || '[]',
      services: n.services || '[]',
      availability: n.availability || '[]',
      diplomaUrl: n.diplomaUrl || null,
      licenseUrl: n.licenseUrl || null,
      rejectionReason: n.rejectionReason || null,
      submittedAt: n.submittedAt || null,
      approvedAt: n.approvedAt || null,
      createdAt: n.createdAt,
    }));
    res.json({ nurses: normalized });
  } catch (err) {
    console.error('Get nurses error:', err);
    res.status(500).json({ error: 'Failed to fetch nurses' });
  }
});

// GET /nurses/me — nurse gets own profile (MUST be before /:id)
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

// PUT /nurses/me/onboarding — nurse submits completed profile for review (MUST be before /:id)
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
    console.error('Onboarding submit error:', err);
    res.status(500).json({ error: 'Failed to submit onboarding' });
  }
});

// PUT /nurses/me/profile — nurse saves profile progress (MUST be before /:id)
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

// GET /nurses/:id — admin gets single nurse with full details
router.get('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id:true, name:true, email:true, phone:true, createdAt:true } },
        visits: {
          include: { relative: true },
          orderBy: { scheduledAt: 'desc' },
          take: 20,
        },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
    res.json({ nurse });
  } catch (err) {
    console.error('Get nurse error:', err);
    res.status(500).json({ error: 'Failed to fetch nurse' });
  }
});

// PUT /nurses/:id/approve
router.put('/:id/approve', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const nurse = await prisma.nurse.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED', approvedAt: new Date() },
      include: { user: { select: { name: true, email: true } } },
    });
    // Email nurse
    try {
      if (nurse.user?.email) {
        const { sendEmail, emailTemplates } = require('../lib/email');
        const tmpl = emailTemplates.nurseApproved({ nurseName: nurse.user.name });
        sendEmail({ to: nurse.user.email, ...tmpl });
      }
    } catch (e) { console.error('Email error:', e); }
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
      data: { status: 'REJECTED', rejectionReason: reason || 'Application rejected by admin' },
      include: { user: { select: { name: true, email: true } } },
    });
    // Email nurse
    try {
      if (nurse.user?.email) {
        const { sendEmail, emailTemplates } = require('../lib/email');
        const tmpl = emailTemplates.nurseRejected({ nurseName: nurse.user.name, reason });
        sendEmail({ to: nurse.user.email, ...tmpl });
      }
    } catch (e) { console.error('Email error:', e); }
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject nurse' });
  }
});

// PUT /nurses/:id/availability
router.put('/:id/availability', ...requireRole('NURSE', 'ADMIN'), async (req, res) => {
  try {
    const { availability } = req.body;
    const nurse = await prisma.nurse.update({
      where: { id: req.params.id },
      data: { availability: JSON.stringify(availability) },
    });
    res.json({ success: true, nurse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

module.exports = router;
