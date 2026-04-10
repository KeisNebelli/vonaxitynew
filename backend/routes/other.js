const router = require('express').Router();
const prisma = require('../lib/db');
const { requireRole, authMiddleware } = require('../middleware/auth');

// ── USERS ─────────────────────────────────────────────────────────────────────

// GET /users — admin gets all clients (role=CLIENT only)
router.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      include: {
        subscription: true,
        relatives: {
          include: {
            visits: {
              select: { id:true, status:true, scheduledAt:true, serviceType:true },
              orderBy: { scheduledAt: 'desc' },
              take: 5,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Normalize for frontend
    const normalized = users.map(u => ({
      id: u.id,
      name: u.name || 'Unknown',
      email: u.email || '',
      phone: u.phone || '',
      country: u.country || '',
      status: u.status || 'ACTIVE',
      joinedAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
      subscription: u.subscription,
      plan: u.subscription?.plan || 'N/A',
      visitsUsed: u.subscription?.visitsUsed || 0,
      visitsTotal: u.subscription?.visitsPerMonth || 0,
      relatives: u.relatives || [],
    }));
    res.json({ users: normalized });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users', detail: err.message });
  }
});

// GET /users/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { subscription: true, relatives: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// GET /users/:id/relatives
router.get('/:id/relatives', authMiddleware, async (req, res) => {
  try {
    const relatives = await prisma.relative.findMany({ where: { clientId: req.params.id } });
    res.json({ relatives });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch relatives' });
  }
});

// POST /users/:id/relatives
router.post('/:id/relatives', authMiddleware, async (req, res) => {
  try {
    const { name, age, phone, city, address, relationship, healthNotes } = req.body;
    const relative = await prisma.relative.create({
      data: { clientId: req.params.id, name, age: age ? parseInt(age) : null, phone, city, address, relationship, healthNotes },
    });
    res.status(201).json({ success: true, relative });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create relative' });
  }
});

module.exports.usersRouter = router;

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
const paymentsRouter = require('express').Router();

paymentsRouter.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports.paymentsRouter = paymentsRouter;

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
const analyticsRouter = require('express').Router();

analyticsRouter.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const [totalUsers, totalNurses, totalVisits, completedVisits, payments, unassignedVisits] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.nurse.count(),
      prisma.visit.count(),
      prisma.visit.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.findMany({ where: { status: 'paid' } }),
      prisma.visit.count({ where: { status: 'UNASSIGNED' } }),
    ]);

    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
    const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });

    res.json({
      totalUsers,
      totalNurses,
      totalVisits,
      completedVisits,
      totalRevenue,
      activeSubscriptions,
      unassignedVisits,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports.analyticsRouter = analyticsRouter;

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
const notificationsRouter = require('express').Router();

notificationsRouter.post('/send', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { title, message, target } = req.body; // target: 'all' | 'nurses' | 'clients'

    let roleFilter;
    if (target === 'nurses') roleFilter = 'NURSE';
    else if (target === 'clients') roleFilter = 'CLIENT';

    const users = await prisma.user.findMany({
      where: roleFilter ? { role: roleFilter } : {},
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: users.map(u => ({ userId: u.id, type: 'announcement', title, message })),
    });

    console.log(`📢 Notification sent to ${users.length} users: ${title}`);
    res.json({ success: true, sentTo: users.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports.notificationsRouter = notificationsRouter;

// ── SETTINGS ──────────────────────────────────────────────────────────────────
const settingsRouter = require('express').Router();
const prismaSettings = require('../lib/db');

const DEFAULT_SETTINGS = {
  payPerVisit: 20,
  trialDays: 7,
  basicPrice: 30,
  standardPrice: 50,
  premiumPrice: 120,
  basicVisits: 1,
  standardVisits: 2,
  premiumVisits: 4,
};

settingsRouter.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const record = await prismaSettings.systemSettings.findFirst();
    const settings = record ? JSON.parse(record.value) : DEFAULT_SETTINGS;
    res.json({ settings });
  } catch (err) {
    res.json({ settings: DEFAULT_SETTINGS });
  }
});

settingsRouter.put('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const existing = await prismaSettings.systemSettings.findFirst();
    const current = existing ? JSON.parse(existing.value) : DEFAULT_SETTINGS;
    const updated = { ...current, ...req.body };
    if (existing) {
      await prismaSettings.systemSettings.update({ where: { id: existing.id }, data: { value: JSON.stringify(updated) } });
    } else {
      await prismaSettings.systemSettings.create({ data: { key: 'system', value: JSON.stringify(updated) } });
    }
    res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Settings save error:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

module.exports.settingsRouter = settingsRouter;

// ── PROFILE UPDATE (added for Phase 3 settings) ───────────────────────────────
const profileRouter = require('express').Router();
const bcryptProfile = require('bcryptjs');
const prismaProfile = require('../lib/db');
const { authMiddleware: authMw } = require('../middleware/auth');

// PUT /profile — update client profile
profileRouter.put('/', authMw, async (req, res) => {
  try {
    const { name, phone, country, city, emergencyContactName, emergencyContactPhone, preferredContact } = req.body;
    const updated = await prismaProfile.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(country !== undefined && { country }),
        ...(city !== undefined && { city }),
      },
      include: { subscription: true },
    });
    res.json({ success: true, user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, country: updated.country, city: updated.city, role: updated.role, status: updated.status, subscription: updated.subscription } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /profile/password — change password
profileRouter.put('/password', authMw, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const user = await prismaProfile.user.findUnique({ where: { id: req.user.userId } });
    const valid = await bcryptProfile.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const passwordHash = await bcryptProfile.hash(newPassword, 10);
    await prismaProfile.user.update({ where: { id: req.user.userId }, data: { passwordHash } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// PUT /profile/relative/:id — update relative info
profileRouter.put('/relative/:id', authMw, async (req, res) => {
  try {
    const { name, city, address, phone, age, healthNotes } = req.body;
    const relative = await prismaProfile.relative.update({
      where: { id: req.params.id, clientId: req.user.userId },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(age !== undefined && { age: age ? parseInt(age) : null }),
        ...(healthNotes !== undefined && { healthNotes }),
      },
    });
    res.json({ success: true, relative });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update relative' });
  }
});

module.exports.profileRouter = profileRouter;
