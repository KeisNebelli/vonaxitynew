require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const visitRoutes = require('./routes/visits');
const nurseRoutes = require('./routes/nurses');
const paymentsRoute = require('./routes/payments');
const uploadsRoute = require('./routes/uploads');
const { usersRouter, paymentsRouter, analyticsRouter, notificationsRouter, settingsRouter, profileRouter, publicSettingsRouter, cleanupRouter, contactRouter, testResetRouter } = require('./routes/other');
const payoutsRouter = require('./routes/payouts');

const app = express();
const PORT = process.env.PORT || 4000;

// Trust Railway's proxy so rate-limit can read the real client IP
app.set('trust proxy', 1);

// ── Security headers (Helmet) ─────────────────────────────────────────────────
app.use(helmet({
  // Allow our own CDN fonts & inline styles in the frontend (served separately)
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// ── Global rate limit — 200 req / 15 min per IP across all routes ─────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
  skip: (req) => req.path === '/health', // don't limit health checks
});
app.use(globalLimiter);

// ── Upload rate limit — 20 uploads / 15 min per IP ───────────────────────────
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many upload attempts. Please try again later.' },
});

// ── Booking rate limit — 30 requests / 15 min per IP ─────────────────────────
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many booking requests. Please try again later.' },
});

// ── AI chat rate limit — 20 requests / 15 min per IP ─────────────────────────
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests. Please try again later.' },
});

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
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/visits', bookingLimiter, visitRoutes);
app.use('/nurses', nurseRoutes);
app.use('/payments', paymentsRoute); // Stripe checkout + admin payments
app.use('/uploads', uploadLimiter, uploadsRoute);
app.use('/users', usersRouter);
app.use('/analytics', analyticsRouter);
app.use('/notifications', notificationsRouter);
app.use('/settings/public', publicSettingsRouter);
app.use('/settings', settingsRouter);
app.use('/admin/cleanup-duplicates', cleanupRouter);
app.use('/admin/test-reset', testResetRouter);
app.use('/payouts', payoutsRouter);
app.use('/contact', contactRouter);
app.use('/profile', profileRouter);

// ── AI Assistant proxy ────────────────────────────────────────────────────────
const SYSTEM_PROMPTS = {
  landing: `You are Vona, Vonaxity's friendly virtual assistant on the landing page. Vonaxity is a healthcare platform in Albania that connects families living abroad with professional nurses who visit their loved ones at home.

Services offered: Blood Pressure Check, Glucose Monitoring, Vitals Check, Blood Work Collection, Welfare Check, Post-surgical Care, Medication Administration, General Nursing.

Plans: Basic (1 visit/month), Standard (2 visits/month), Premium (4 visits/month). All plans include a 7-day free trial. Cancel anytime.

Coverage: Currently launching in Tirana (12+ nurses, 11 districts, ~2hr avg response). Expanding soon to Durrës, Elbasan, Fier, Berat, Sarandë, Shkodër, and Kukës.

How it works: 1) Sign up and choose a plan. 2) Book a nurse visit for your relative. 3) A verified nurse visits and submits a health report. 4) Report is emailed to you within hours.

Rules:
- Answer questions about Vonaxity only — services, pricing, cities, how it works, signing up
- Guide visitors toward creating an account
- Respond in the same language the user writes in (English or Albanian/Shqip)
- Keep answers short, clear, and warm
- Do NOT give medical diagnoses or specific treatment advice — always recommend consulting a doctor for medical decisions
- Do NOT make up pricing, features, or availability not described above
- Do NOT discuss competitor services
- For medical emergencies in Albania, always direct to 112
- If you don't know something, say so honestly and suggest contacting support through the website`,

  dashboard: `You are Vona, Vonaxity's in-platform support assistant for logged-in users. Vonaxity connects families with certified nurses for at-home visits in Albania.

Dashboard sections:
- Overview: Activity summary, upcoming visits, quick booking shortcut
- Book Visit: Schedule a new nursing visit for a family member
- Health: View health records, vital signs trends, and history from completed visits
- Find Nurses: Browse available nurses in your area
- My Visits: Track all visits — upcoming, in progress, completed, cancelled
- Subscription: Manage your plan (Basic = 1 visit/month, Standard = 2/month, Premium = 4/month)
- Settings: Update account info, manage family members, change password, notification preferences

Services: Blood Pressure Check, Glucose Monitoring, Vitals Check, Blood Work Collection, Welfare Check, Post-surgical Care, Medication Administration, General Nursing.

Rules:
- Help users navigate the dashboard and use platform features
- Explain what health data means in general terms (e.g., normal blood pressure is typically around 120/80 mmHg)
- Respond in the same language the user writes in (English or Albanian/Shqip)
- Keep answers concise and actionable
- Do NOT give medical diagnoses, treatment plans, or prescriptions — always recommend a doctor for clinical decisions
- Do NOT reference specific account data — you don't have access to their records
- Do NOT make promises about nurse availability or response times
- For medical emergencies, ALWAYS direct to 112 (Albania's emergency number)
- For billing issues, direct the user to the Subscription section or the support contact on the website`,
};

app.post('/ai/chat', aiLimiter, async (req, res) => {
  try {
    const { messages, context, userName } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    let system = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.landing;
    if (userName && context === 'dashboard') {
      system = `The user's name is ${userName}.\n\n${system}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system,
        messages,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'AI error');
    res.json({ content: data.content?.[0]?.text || '' });
  } catch (err) {
    console.error('AI proxy error:', err);
    res.status(500).json({ error: 'AI assistant is temporarily unavailable.' });
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
