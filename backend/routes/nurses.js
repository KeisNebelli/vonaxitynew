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
      payRatePerVisit: n.payRatePerVisit ?? 20,
      paypalEmail: n.paypalEmail || '',
      profilePhotoUrl: n.profilePhotoUrl || null,
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

// GET /nurses/public — public listing of approved nurses (no auth required)
router.get('/public', async (req, res) => {
  try {
    const nurses = await prisma.nurse.findMany({
      where: { status: 'APPROVED' },
      include: {
        user: { select: { name: true } },
        reviews: { select: { rating: true }, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { totalVisits: 'desc' },
    });
    const normalized = nurses.map(n => ({
      id: n.id,
      name: n.user?.name || 'Unknown',
      city: n.city || '',
      rating: n.rating || 0,
      totalVisits: n.totalVisits || 0,
      reviewCount: n.reviews?.length || 0,
      bio: n.bio || '',
      specialties: (() => { try { return n.specialties ? JSON.parse(n.specialties) : []; } catch { return []; } })(),
      services: (() => { try { return n.services ? JSON.parse(n.services) : []; } catch { return []; } })(),
      languages: (() => { try { return n.languages ? JSON.parse(n.languages) : []; } catch { return []; } })(),
      availability: (() => { try { return n.availability ? JSON.parse(n.availability) : []; } catch { return []; } })(),
      experience: n.experience || '',
      profilePhotoUrl: n.profilePhotoUrl || null,
      approvedAt: n.approvedAt,
    }));
    res.json({ nurses: normalized });
  } catch (err) {
    console.error('Get public nurses error:', err);
    res.status(500).json({ error: 'Failed to fetch nurses' });
  }
});

// GET /nurses/public/:id — public single nurse profile (no auth required)
router.get('/public/:id', async (req, res) => {
  try {
    const nurse = await prisma.nurse.findFirst({
      where: { id: req.params.id, status: 'APPROVED' },
      include: {
        user: { select: { name: true, createdAt: true } },
        reviews: {
          include: { visit: { include: { relative: { include: { client: { select: { name: true, country: true } } } } } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found' });
    res.json({
      nurse: {
        id: nurse.id,
        name: nurse.user?.name || 'Unknown',
        city: nurse.city || '',
        rating: nurse.rating || 0,
        totalVisits: nurse.totalVisits || 0,
        bio: nurse.bio || '',
        specialties: nurse.specialties ? JSON.parse(nurse.specialties) : [],
        services: nurse.services ? JSON.parse(nurse.services) : [],
        languages: nurse.languages ? JSON.parse(nurse.languages) : [],
        availability: nurse.availability ? JSON.parse(nurse.availability) : [],
        experience: nurse.experience || '',
        licenseNumber: nurse.licenseNumber || '',
        profilePhotoUrl: nurse.profilePhotoUrl || null,
        approvedAt: nurse.approvedAt,
        joinedAt: nurse.user?.createdAt,
        reviews: nurse.reviews.map(r => ({
          rating: r.rating,
          comment: r.comment || '',
          clientName: r.visit?.relative?.client?.name || 'Client',
          clientCountry: r.visit?.relative?.client?.country || '',
          date: new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
        })),
      },
    });
  } catch (err) {
    console.error('Get public nurse error:', err);
    res.status(500).json({ error: 'Failed to fetch nurse' });
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

// PUT /nurses/:id — admin edits nurse info
router.put('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { city, bio, experience, licenseNumber, issuingAuthority, paypalEmail, payRatePerVisit, status } = req.body;
    const nurse = await prisma.nurse.findUnique({ where: { id: req.params.id } });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found' });

    const nurseUpdate = {
      ...(city !== undefined && { city }),
      ...(bio !== undefined && { bio }),
      ...(experience !== undefined && { experience }),
      ...(licenseNumber !== undefined && { licenseNumber }),
      ...(issuingAuthority !== undefined && { issuingAuthority }),
      ...(paypalEmail !== undefined && { paypalEmail }),
      ...(payRatePerVisit !== undefined && { payRatePerVisit: parseFloat(payRatePerVisit) }),
    };

    // Also update user name/phone if passed
    const { name, phone } = req.body;
    if (name || phone) {
      await prisma.user.update({
        where: { id: nurse.userId },
        data: { ...(name && { name }), ...(phone && { phone }) },
      });
    }

    const updated = await prisma.nurse.update({
      where: { id: req.params.id },
      data: nurseUpdate,
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });
    // nurse updated
    res.json({ success: true, nurse: updated });
  } catch (err) {
    console.error('Edit nurse error:', err);
    res.status(500).json({ error: 'Failed to update nurse' });
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
