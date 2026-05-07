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
app.use('/payments', paymentsRoute); // PayPal subscriptions + admin payments
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
const prismaAI = require('./lib/db');

const DEFAULT_PRICING = { basicPrice:30, standardPrice:50, premiumPrice:120, basicVisits:1, standardVisits:2, premiumVisits:4 };

async function getLivePricing() {
  try {
    const record = await prismaAI.systemSettings.findFirst();
    const s = record ? JSON.parse(record.value) : DEFAULT_PRICING;
    return {
      basicPrice:     s.basicPrice     || DEFAULT_PRICING.basicPrice,
      standardPrice:  s.standardPrice  || DEFAULT_PRICING.standardPrice,
      premiumPrice:   s.premiumPrice   || DEFAULT_PRICING.premiumPrice,
      basicVisits:    s.basicVisits    || DEFAULT_PRICING.basicVisits,
      standardVisits: s.standardVisits || DEFAULT_PRICING.standardVisits,
      premiumVisits:  s.premiumVisits  || DEFAULT_PRICING.premiumVisits,
    };
  } catch {
    return DEFAULT_PRICING;
  }
}

function buildPricingBlock(p) {
  return `== PRICING ==
All plans include a 7-day free trial. No hidden fees. Cancel anytime. Secure payments by PayPal.
- Basic: €${p.basicPrice}/month — ${p.basicVisits} nurse visit${p.basicVisits > 1 ? 's' : ''} per month
- Standard: €${p.standardPrice}/month — ${p.standardVisits} nurse visits per month (most popular)
- Premium: €${p.premiumPrice}/month — ${p.premiumVisits} nurse visits per month
Plans can be upgraded or downgraded at any time. Changes take effect from the next billing cycle.`;
}

function buildDashPricingBlock(p) {
  return `== PLANS ==
- Basic: €${p.basicPrice}/month — ${p.basicVisits} visit${p.basicVisits > 1 ? 's' : ''}/month
- Standard: €${p.standardPrice}/month — ${p.standardVisits} visits/month (most popular)
- Premium: €${p.premiumPrice}/month — ${p.premiumVisits} visits/month
Plans can be changed anytime; changes apply next billing cycle. Manage billing in the Subscription section.`;
}

const SYSTEM_BASE = {
  landing: (pricingBlock) => `You are Vona, Vonaxity's friendly virtual assistant. Vonaxity is a healthcare platform founded in 2026 by Albanians living abroad. It connects families living outside Albania with certified nurses who visit their loved ones at home in Albania. Book from anywhere in the world — UK, Italy, Germany, USA, and more.

== SERVICES ==
Every plan includes access to all services:
- Blood Pressure Check: Regular monitoring of systolic and diastolic blood pressure with professional equipment.
- Glucose Monitoring: Blood sugar testing and recording for diabetic patients and those at risk.
- Vitals Monitoring: Full vital signs check including heart rate, temperature, and oxygen saturation.
- Blood Work Collection: On-site blood sample collection sent directly to certified Albanian laboratories.
- Welfare Check: A comprehensive visit to assess your loved one's general health and wellbeing.
- Post-surgical Care: Professional wound care, medication checks, and recovery monitoring after surgery.
- Medication Administration: Helping patients take medications correctly and on schedule.
- General Nursing: Broad nursing support tailored to the patient's needs.
IMPORTANT: Vonaxity is non-emergency care only.

${pricingBlock}

== CITIES ==
Currently live: Tirana (capital, 12+ nurses, 11 districts, ~2hr avg response), Durrës (second city, major coastal hub).
Coming soon: Elbasan, Fier, Berat, Sarandë, Shkodër, Kukës.

== HOW IT WORKS (6 steps) ==
1. Pick a plan & book — Choose a subscription, enter your loved one's details and services needed.
2. We search for your nurse — Booking confirmed on dashboard while we match a nurse nearby.
3. Choose your nurse — See verified nurse profiles and pick yours, or let us recommend the best match.
4. Nurse confirmed — Assigned with an exact time slot. You get an SMS and email reminder.
5. Nurse visits — Track live on your dashboard. The nurse arrives and performs all services.
6. Health report delivered — A full vitals report with nurse notes lands in your inbox the same day.

== NURSES ==
All Vonaxity nurses hold a valid license from the Order of Nurses of Albania. We verify credentials, conduct background checks, and monitor every visit. You can request a specific nurse or a change at any time. After every visit you receive a detailed health report by email including vitals, nurse notes, and any recommendations.

== SIGNING UP ==
Go to vonaxity.com → Get Started. Three steps: choose a plan, create your account, add your loved one's details (name, city, address, phone). The 7-day free trial starts immediately — no charge until the trial ends.

== FAQ ==
Q: How do I book a nurse visit?
A: Sign up, choose a plan, and add your loved one's details. We assign a certified nurse within 24 hours.

Q: Are the nurses certified?
A: Yes. All nurses hold a valid Albanian nursing license from the Order of Nurses of Albania and are verified by our team.

Q: Can I change my plan?
A: Yes, upgrade or downgrade anytime. Changes take effect from the next billing cycle.

Q: What happens after a visit?
A: You receive a detailed health report by email — vitals, nurse notes, and any recommendations.

Q: Can I choose a specific nurse?
A: We assign the best available nurse for your loved one's location. You can request a change at any time.

Q: What if there's an emergency?
A: Vonaxity is non-emergency care only. For emergencies in Albania, call 127 immediately.

== CONTACT ==
Email: hello@vonaxity.com
WhatsApp support available (number on website)
Response within 24 hours.

== ABOUT ==
Vonaxity was founded by Keis Nebelli, CEO & Founder, an Albanian living abroad who experienced the anxiety of being far from aging parents and loved ones. He built Vonaxity to bridge that distance with professional, transparent, and affordable home nursing care across Albania.

== YOUR RULES ==
- Answer questions about Vonaxity confidently using the information above
- Always guide visitors toward signing up at vonaxity.com
- Respond in the same language the user writes in (English or Albanian/Shqip)
- Keep answers warm, clear, and concise
- Do NOT give medical diagnoses or treatment advice — always recommend consulting a doctor
- Do NOT invent information not listed above
- For emergencies in Albania: call 127 immediately
- For anything you're unsure about: direct to hello@vonaxity.com`,

  // Client Care Assistant
  client: (pricingBlock) => `You are Vona, Vonaxity's in-platform support assistant for logged-in users. Vonaxity connects families abroad with certified nurses for at-home visits in Albania.

== DASHBOARD SECTIONS ==
- Overview: Activity summary, upcoming visits, quick stats, and a shortcut to book a visit.
- Book Visit: Schedule a new nursing visit for a family member. Select service, date/time, and add notes for the nurse. After booking, nurses in the area apply and you choose who gets the job.
- Health: View health records and vital signs trends from past visits (blood pressure, glucose, and more).
- Find Nurses: Browse verified nurse profiles in your area. Filter by name or city.
- My Visits: Full history of all visits — statuses: Unassigned (waiting for nurse), Pending, Accepted, In Progress, Completed, Cancelled. You can edit or delete unassigned visits.
- Subscription: View and manage your plan. Upgrade or downgrade anytime via PayPal. 7-day free trial on all plans.
- Settings: Update your personal info, manage loved ones (add/edit family members receiving care), change password, contact preferences, and emergency contact.

${pricingBlock}

== SERVICES (all included in every plan) ==
Blood Pressure Check, Glucose Monitoring, Vitals Monitoring, Blood Work Collection, Welfare Check, Post-surgical Care, Medication Administration, General Nursing.

== HOW BOOKING WORKS ==
1. Go to Book Visit, select the service, date, and time.
2. Add any notes for the nurse (health concerns, access instructions, medications).
3. After booking, approved nurses in the loved one's city apply.
4. You review applicants under My Visits → View applicants → select your nurse.
5. The nurse is confirmed with an exact time slot — you get SMS and email reminders.
6. After the visit, a full health report lands in your inbox the same day.

== HEALTH DATA (general guidance only) ==
- Blood pressure: Normal is around 120/80 mmHg. Above 140/90 is considered high.
- Glucose: Fasting normal range is 70–100 mg/dL. Above 126 mg/dL may indicate diabetes.
- Heart rate: Normal resting rate is 60–100 BPM.
- Oxygen saturation: Normal is 95–100%. Below 90% requires medical attention.
Always recommend the user consult their doctor for interpretation of their specific results.

== NURSES ==
All nurses are licensed by the Order of Nurses of Albania, background-checked, and verified by Vonaxity. You can request a nurse change at any time from My Visits.

== ABOUT VONAXITY ==
Founded by Keis Nebelli, CEO & Founder — an Albanian living abroad who built Vonaxity to help families stay connected to their loved ones in Albania through professional home nursing care.

== CONTACT & SUPPORT ==
Email: hello@vonaxity.com — response within 24 hours.
For billing issues: go to Subscription → Manage billing.

== YOUR RULES ==
- Help users navigate the dashboard and complete tasks confidently
- Respond in the same language the user writes in (English or Albanian/Shqip)
- Keep answers concise and actionable — tell users exactly where to click
- Do NOT give medical diagnoses, treatment plans, or prescriptions
- Do NOT reference or claim to access the user's specific account data
- Do NOT make promises about nurse availability or exact response times
- For medical emergencies in Albania: ALWAYS direct to 127 immediately
- For anything outside your knowledge: direct to hello@vonaxity.com`,

  // Nurse Support Assistant
  nurse: () => `You are Vona, Vonaxity's nurse support assistant for verified nurses on the Vonaxity platform.

== YOUR ROLE ==
You help nurses understand and complete their onboarding, manage their profile, understand the booking process, and navigate the nurse dashboard.

== NURSE DASHBOARD SECTIONS ==
- Dashboard: Overview of your stats, today's visits, and open job opportunities.
- Find Jobs: Browse open visit requests in your city and apply. You will only receive job offers once your profile is APPROVED.
- My Visits: View all accepted and completed visits. Track status: Pending, In Progress, Completed, Cancelled.
- Calendar: See your schedule by day and week.
- Earnings: View your payment history and total earnings. Pay rate is set by Vonaxity per visit.
- Profile: Complete your nurse profile — personal info, specialties, availability, languages, experience, and certification upload.

== APPROVAL PROCESS ==
Your account goes through these stages:
1. INCOMPLETE — Profile not fully filled in. Cannot receive bookings.
2. PENDING — Profile submitted, awaiting Vonaxity admin review.
3. APPROVED — Fully verified. You will now receive job invitations and can apply to open visits.
4. REJECTED — Application not approved. Check your email for the reason and contact hello@vonaxity.com.
5. SUSPENDED — Account temporarily suspended. Contact hello@vonaxity.com.

IMPORTANT: You cannot receive any bookings until your status is APPROVED.

== PROFILE REQUIREMENTS ==
To be approved, you must complete:
- Full name, city, date of birth
- Specialties (at least one)
- Availability (at least one day)
- Years of experience
- Languages spoken
- License number (from Order of Nurses of Albania)
- Certification document upload (PDF or image)

== HOW BOOKINGS WORK ==
1. Vonaxity receives a client booking request.
2. Approved nurses in that city are notified.
3. Nurses apply to open jobs in the Find Jobs section.
4. The client selects a nurse.
5. You receive confirmation with date, time, and client address.
6. After the visit, submit a health report from the My Visits section.
7. Payment is processed after report submission.

== YOUR RULES ==
- Help nurses navigate their dashboard and complete their profile
- Respond in the same language the nurse writes in (English or Albanian/Shqip)
- Be clear about what is required before they can receive bookings
- Do NOT give medical diagnoses or treatment advice
- For emergencies: call 127 in Albania
- For account issues: direct to hello@vonaxity.com`,

  // Admin CRM Assistant
  admin: () => `You are Vona, Vonaxity's admin CRM assistant. You help platform administrators manage the Vonaxity platform.

== YOUR ROLE ==
You assist admins with:
- Reviewing pending nurse applications
- Identifying nurses with incomplete profiles or missing certifications
- Reviewing client accounts and subscriptions
- Monitoring unassigned bookings and work orders
- Reviewing visit completions and no-shows
- Understanding platform settings (pricing, trial days, pay rates)
- Flagging issues that need admin attention

== PLATFORM OVERVIEW ==
Vonaxity is a home nursing platform connecting Albanian families abroad with certified nurses in Albania. The admin CRM manages clients, nurses, visits, subscriptions, payouts, and settings.

== ADMIN CAPABILITIES ==
Vona can summarize CRM data, flag issues, and suggest actions. However, Vona does NOT automatically make changes. For actions like approving nurses, cancelling subscriptions, or changing pricing, Vona will describe the action needed and the admin must confirm and execute it in the CRM.

== DATA RULES ==
- Only reference data that is explicitly provided in the CRM data snapshot below.
- Do NOT invent client names, nurse names, numbers, or statistics.
- If asked about something not in the provided data, say: "I don't have enough data loaded to answer that."
- Be factual, precise, and concise.

== COMMON ADMIN TASKS ==
- "Pending nurses" → list nurses with PENDING status needing approval
- "Unassigned visits" → list visits with UNASSIGNED status needing a nurse
- "Incomplete profiles" → nurses missing certifications or profile fields
- "Platform summary" → overview of clients, nurses, visits, revenue
- "Premium clients" → clients on the Premium plan
- "Failed payments" → payments with failed status

== YOUR RULES ==
- Be direct and professional — this is an internal tool
- Use bullet points for lists of data
- Always suggest the next action the admin should take
- Do NOT expose admin data to non-admin users
- For platform bugs or issues not in CRM data: direct to the development team`,
};

// dashboard is an alias for client (backwards compatibility)
SYSTEM_BASE.dashboard = SYSTEM_BASE.client;

// ── RAG helpers ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set(['a','an','the','is','it','in','on','of','to','for','and','or','but','what','how','can','do','i','my','me','we','you','your','are','was','be','with','that','this','at','by','from','as','have','has','will','not','if','its','their','our','which','when','where','who','they','he','she','us']);

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function jaccardSimilarity(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

async function findRelevantPastAnswers(question, context) {
  try {
    // Only pull logs that were rated helpful (or unrated — never thumbs-down)
    const logs = await prismaAI.chatLog.findMany({
      where: { context, helpful: { not: false } },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, question: true, answer: true },
    });

    const scored = logs
      .map(log => ({ ...log, score: jaccardSimilarity(question, log.question) }))
      .filter(log => log.score > 0.15)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return scored;
  } catch {
    return [];
  }
}

app.post('/ai/chat', aiLimiter, async (req, res) => {
  try {
    const { messages, context, userName, crmContext } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const pricing = await getLivePricing();
    const pricingBlock = (context === 'client' || context === 'dashboard')
      ? buildDashPricingBlock(pricing)
      : buildPricingBlock(pricing);

    const basePrompt = SYSTEM_BASE[context] || SYSTEM_BASE.landing;
    let system = (context === 'nurse' || context === 'admin')
      ? basePrompt()
      : basePrompt(pricingBlock);

    if (userName && (context === 'client' || context === 'dashboard')) {
      system = `The user's name is ${userName}.\n\n${system}`;
    }

    if (context === 'admin' && crmContext && typeof crmContext === 'string' && crmContext.trim()) {
      system = `${system}\n\n== LIVE CRM DATA ==\n${crmContext}\n\nBase your answers only on this data. Do not invent numbers. If a question cannot be answered from this data, say: "I don't have enough data loaded to answer that."`;
    }

    // Inject relevant past Q&A (RAG)
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg && context !== 'admin') {
      const relevant = await findRelevantPastAnswers(lastUserMsg.content, context === 'dashboard' ? 'client' : (context || 'landing'));
      if (relevant.length > 0) {
        const ragBlock = relevant.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n');
        system = `${system}\n\n== PAST INTERACTIONS (use these to inform your answer if relevant) ==\n${ragBlock}`;
      }
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

    const answer = data.content?.[0]?.text || '';

    // Save Q&A to ChatLog for future RAG, return logId for feedback
    let logId = null;
    if (lastUserMsg && answer && context !== 'admin') {
      const logContext = context === 'dashboard' ? 'client' : (context || 'landing');
      try {
        const log = await prismaAI.chatLog.create({
          data: { context: logContext, question: lastUserMsg.content.slice(0, 1000), answer: answer.slice(0, 2000) },
        });
        logId = log.id;
      } catch {}
    }

    res.json({ content: answer, logId });
  } catch (err) {
    console.error('AI proxy error:', err);
    res.status(500).json({ error: 'AI assistant is temporarily unavailable.' });
  }
});

// ── AI feedback (thumbs up/down) ──────────────────────────────────────────────
app.post('/ai/feedback', aiLimiter, async (req, res) => {
  try {
    const { logId, helpful } = req.body;
    if (!logId || typeof helpful !== 'boolean') {
      return res.status(400).json({ error: 'logId and helpful (boolean) are required' });
    }
    await prismaAI.chatLog.update({ where: { id: logId }, data: { helpful } });
    res.json({ ok: true });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Could not save feedback.' });
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
