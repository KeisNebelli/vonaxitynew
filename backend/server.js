require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const visitRoutes = require('./routes/visits');
const nurseRoutes = require('./routes/nurses');
const paymentsRoute = require('./routes/payments');
const uploadsRoute = require('./routes/uploads');
const { usersRouter, paymentsRouter, analyticsRouter, notificationsRouter, settingsRouter, profileRouter, publicSettingsRouter, cleanupRouter, contactRouter } = require('./routes/other');
const payoutsRouter = require('./routes/payouts');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://vonaxity.com',
  'https://www.vonaxity.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Raw body for Stripe webhooks — must be before express.json()
app.use('/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  req.rawBody = req.body;
  next();
});

app.use(express.json());
app.use(cookieParser());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Vonaxity API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/visits', visitRoutes);
app.use('/nurses', nurseRoutes);
app.use('/payments', paymentsRoute); // Stripe checkout + admin payments
app.use('/uploads', uploadsRoute);
app.use('/users', usersRouter);
app.use('/analytics', analyticsRouter);
app.use('/notifications', notificationsRouter);
app.use('/settings/public', publicSettingsRouter);
app.use('/settings', settingsRouter);
app.use('/admin/cleanup-duplicates', cleanupRouter);
app.use('/payouts', payoutsRouter);
app.use('/contact', contactRouter);
app.use('/profile', profileRouter);

// ── AI Assistant proxy ────────────────────────────────────────────────────────
app.post('/ai/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system,
        messages,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'AI error');
    res.json({ content: data.content?.[0]?.text || '' });
  } catch (err) {
    console.error('AI proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Trial expiry sweep ────────────────────────────────────────────────────────
const prismaExpiry = require('./lib/db');

async function expireTrials() {
  try {
    const now = new Date();
    const expired = await prismaExpiry.subscription.findMany({
      where: { status: 'TRIAL', trialEndsAt: { lt: now } },
      select: { userId: true },
    });
    if (expired.length === 0) return;
    const userIds = expired.map(s => s.userId);
    // Only expire the subscription — do NOT suspend the user account.
    // The dashboard will show a paywall when subscription.status === 'EXPIRED'.
    await prismaExpiry.subscription.updateMany({
      where: { userId: { in: userIds }, status: 'TRIAL' },
      data: { status: 'EXPIRED' },
    });
    console.log(`[Trial sweep] Marked ${userIds.length} trial subscription(s) as EXPIRED`);
  } catch (err) {
    console.error('[Trial sweep] Error:', err.message);
  }
}

// Run once on startup to catch any missed expirations, then every hour
expireTrials();
setInterval(expireTrials, 60 * 60 * 1000);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗   ██╗ ██████╗ ███╗   ██╗ █████╗ ██╗  ██╗██╗████████╗██╗   ██╗');
  console.log('  ██║   ██║██╔═══██╗████╗  ██║██╔══██╗╚██╗██╔╝██║╚══██╔══╝╚██╗ ██╔╝');
  console.log('  ██║   ██║██║   ██║██╔██╗ ██║███████║ ╚███╔╝ ██║   ██║    ╚████╔╝ ');
  console.log('  ╚██╗ ██╔╝██║   ██║██║╚██╗██║██╔══██║ ██╔██╗ ██║   ██║     ╚██╔╝  ');
  console.log('   ╚████╔╝ ╚██████╔╝██║ ╚████║██║  ██║██╔╝ ██╗██║   ██║      ██║   ');
  console.log('    ╚═══╝   ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝  ');
  console.log('');
  console.log(`  🚀 API running on http://localhost:${PORT}`);
  console.log(`  📋 Health check: http://localhost:${PORT}/health`);
  console.log(`  🌍 CORS allowed: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('');
});

module.exports = app;
