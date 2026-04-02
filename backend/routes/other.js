const router = require('express').Router();
const prisma = require('../lib/db');
const { requireRole, authMiddleware } = require('../middleware/auth');

// ── USERS ─────────────────────────────────────────────────────────────────────

// GET /users
router.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      include: { subscription: true, relatives: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
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

// In-memory settings for test version (use DB in production)
let systemSettings = {
  payPerVisit: 20,
  trialDays: 7,
  basicPrice: 30,
  standardPrice: 50,
  premiumPrice: 120,
  basicVisits: 1,
  standardVisits: 2,
  premiumVisits: 4,
};

settingsRouter.get('/', ...requireRole('ADMIN'), (req, res) => {
  res.json({ settings: systemSettings });
});

settingsRouter.put('/', ...requireRole('ADMIN'), (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  res.json({ success: true, settings: systemSettings });
});

module.exports.settingsRouter = settingsRouter;
