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
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/:id — admin only
router.get('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        subscription: true,
        relatives: { include: { visits: { orderBy: { scheduledAt: 'desc' }, take: 10 } } },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /users/:id — admin edits client
router.put('/:id', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, phone, country, city, email } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(country !== undefined && { country }),
        ...(city !== undefined && { city }),
        ...(email !== undefined && { email }),
      },
      include: { subscription: true },
    });

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// PUT /users/:id/status — admin activate/deactivate/suspend
router.put('/:id/status', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELLED'];
    if (!allowed.includes(status)) return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// GET /users/:id/relatives
router.get('/:id/relatives', authMiddleware, async (req, res) => {
  if (req.user.userId !== req.params.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const relatives = await prisma.relative.findMany({ where: { clientId: req.params.id } });
    res.json({ relatives });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch relatives' });
  }
});

// POST /users/:id/relatives
router.post('/:id/relatives', authMiddleware, async (req, res) => {
  if (req.user.userId !== req.params.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }
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


    res.json({ success: true, sentTo: users.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// GET /notifications — fetch current user's notifications (newest first)
notificationsRouter.get('/', async (req, res) => {
  try {
    const token = req.cookies?.['vonaxity-token'] || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /notifications/read-all — mark all as read
notificationsRouter.patch('/read-all', async (req, res) => {
  try {
    const token = req.cookies?.['vonaxity-token'] || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await prisma.notification.updateMany({
      where: { userId: decoded.userId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

// PATCH /notifications/:id/read — mark one as read
notificationsRouter.patch('/:id/read', async (req, res) => {
  try {
    const token = req.cookies?.['vonaxity-token'] || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
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
    console.error('Settings fetch error (table may not exist):', err.message);
    res.json({ settings: DEFAULT_SETTINGS });
  }
});

settingsRouter.put('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const existing = await prismaSettings.systemSettings.findFirst();
    const current = existing ? JSON.parse(existing.value) : DEFAULT_SETTINGS;
    const updated = { ...current, ...req.body };
    if (existing) {
      await prismaSettings.systemSettings.update({ where: { id: existing.id }, data: { value: JSON.stringify(updated), updatedAt: new Date() } });
    } else {
      await prismaSettings.systemSettings.create({ data: { key: 'system', value: JSON.stringify(updated) } });
    }
    res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Settings save error:', err.message);
    res.status(500).json({ error: 'Failed to save settings. The settings table may not exist yet. Run: npx prisma db push' });
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

// GET /settings/public — pricing data for landing page (no auth required)
const publicSettingsRouter = require('express').Router();
const prismaPublic = require('../lib/db');
publicSettingsRouter.get('/', async (req, res) => {
  try {
    const record = await prismaPublic.systemSettings.findFirst();
    const settings = record ? JSON.parse(record.value) : DEFAULT_SETTINGS;
    res.json({ basicPrice: settings.basicPrice||30, standardPrice: settings.standardPrice||50, premiumPrice: settings.premiumPrice||120, basicVisits: settings.basicVisits||1, standardVisits: settings.standardVisits||2, premiumVisits: settings.premiumVisits||4 });
  } catch (err) {
    res.json({ basicPrice:30, standardPrice:50, premiumPrice:120, basicVisits:1, standardVisits:2, premiumVisits:4 });
  }
});
module.exports.publicSettingsRouter = publicSettingsRouter;

// POST /admin/cleanup-duplicates — one-time cleanup, admin only
const cleanupRouter = require('express').Router();
const prismaCleanup = require('../lib/db');
cleanupRouter.post('/', ...require('../middleware/auth').requireRole('ADMIN'), async (req, res) => {
  try {
    // Find all visits grouped by relativeId + serviceType + scheduledAt
    const visits = await prismaCleanup.visit.findMany({ orderBy: { createdAt: 'asc' } });
    const seen = new Map();
    const toDelete = [];
    visits.forEach(v => {
      const key = `${v.relativeId}|${v.serviceType}|${v.scheduledAt?.toISOString()}`;
      if (seen.has(key)) { toDelete.push(v.id); }
      else seen.set(key, v.id);
    });
    if (toDelete.length > 0) {
      await prismaCleanup.visit.deleteMany({ where: { id: { in: toDelete } } });
    }
    res.json({ success: true, deleted: toDelete.length, message: `Removed ${toDelete.length} duplicate visit${toDelete.length!==1?'s':''}` });
  } catch (err) {
    console.error('Cleanup error:', err);
    res.status(500).json({ error: err.message });
  }
});
module.exports.cleanupRouter = cleanupRouter;

// POST /contact — public contact form
const contactRouter = require('express').Router();
contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
    const { sendEmail } = require('../lib/email');
    await sendEmail({
      to: 'hello@vonaxity.com',
      subject: `Contact form: ${name}`,
      html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:18px;font-weight:700;margin-bottom:16px">New contact form submission</h2>
        <div style="background:#F8FAFC;border-radius:12px;padding:20px;border:1px solid #E2E8F0">
          <div style="margin-bottom:10px"><strong>Name:</strong> ${name}</div>
          <div style="margin-bottom:10px"><strong>Email:</strong> ${email}</div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #E2E8F0"><strong>Message:</strong><br/>${message.replace(/\n/g,'<br/>')}</div>
        </div>
        <p style="margin-top:16px;font-size:13px;color:#94A3B8">Reply directly to this email to respond to ${name}.</p>
      </div>`,
    });
    // Auto-reply to sender
    sendEmail({
      to: email,
      subject: 'We received your message — Vonaxity',
      html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Thanks for reaching out, ${name}!</h2>
        <p style="color:#475569;margin-bottom:24px">We received your message and will get back to you within 24 hours.</p>
        <p style="color:#94A3B8;font-size:12px">Vonaxity · Professional home nurse visits across Albania</p>
      </div>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
module.exports.contactRouter = contactRouter;

// ── TEST RESET ──────────────────────────────────────────────────────────────
// POST /admin/test-reset — admin only; resets all test accounts for clean testing
const testResetRouter = require('express').Router();
testResetRouter.post('/', ...requireRole('ADMIN'), async (req, res) => {
  const TEST_EMAILS = ['client@test.com', 'client2@test.com'];
  try {
    const users = await prisma.user.findMany({ where: { email: { in: TEST_EMAILS } } });
    const userIds = users.map(u => u.id);
    if (!userIds.length) return res.status(404).json({ error: 'No test accounts found' });

    // 1. Reset visitsUsed to 0 and ensure unlimited subscription
    await prisma.subscription.updateMany({
      where: { userId: { in: userIds } },
      data: { visitsUsed: 0, status: 'ACTIVE', visitsPerMonth: 999, currentPeriodEnd: new Date('2099-12-31') },
    });

    // 2. Delete all visits for their relatives
    const relatives = await prisma.relative.findMany({ where: { clientId: { in: userIds } } });
    const relativeIds = relatives.map(r => r.id);
    const deletedVisits = await prisma.visit.deleteMany({ where: { relativeId: { in: relativeIds } } });

    res.json({
      success: true,
      message: `Reset ${TEST_EMAILS.length} test accounts`,
      deletedVisits: deletedVisits.count,
      accounts: TEST_EMAILS,
    });
  } catch (err) {
    console.error('Test reset error:', err);
    res.status(500).json({ error: 'Failed to reset test accounts' });
  }
});
module.exports.testResetRouter = testResetRouter;
