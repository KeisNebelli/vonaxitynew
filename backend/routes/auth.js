const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/db');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const PLAN_VISITS = { basic: 1, standard: 2, premium: 4 };
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, country, plan, relativeName, relativeCity, relativeAddress, relativePhone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name, email, passwordHash, phone, country,
        role: 'CLIENT', status: 'TRIAL',
        subscription: {
          create: {
            plan: plan || 'standard',
            status: 'TRIAL',
            visitsPerMonth: PLAN_VISITS[plan] || 2,
            trialEndsAt,
          },
        },
        ...(relativeName && relativeCity && {
          relatives: {
            create: {
              name: relativeName,
              city: relativeCity,
              address: relativeAddress || '',
              phone: relativePhone || null,
            },
          },
        }),
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('vonaxity-token', token, COOKIE_OPTIONS);

    // Welcome email
    try {
      const { sendEmail, emailTemplates } = require('../lib/email');
      const tmpl = emailTemplates.welcomeClient({ name: user.name });
      sendEmail({ to: user.email, ...tmpl });
    } catch (e) { console.error('Welcome email error:', e); }

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/register-nurse
router.post('/register-nurse', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name, email, passwordHash, phone: phone || null,
        role: 'NURSE', status: 'ACTIVE',
        nurseProfile: {
          create: {
            city: '',
            status: 'INCOMPLETE',
          },
        },
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('vonaxity-token', token, COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Nurse register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({
      where: { email },
      include: { nurseProfile: true, subscription: true },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Expire subscription at login if trialEndsAt has passed — but still let them in.
    // The dashboard will show a paywall when subscription.status === 'EXPIRED'.
    if (
      user.subscription?.status === 'TRIAL' &&
      user.subscription?.trialEndsAt &&
      user.subscription.trialEndsAt < new Date()
    ) {
      await prisma.subscription.update({ where: { userId: user.id }, data: { status: 'EXPIRED' } });
    }

    // If suspended only because trial expired — let them in, dashboard shows paywall
    if (user.status === 'SUSPENDED' && user.subscription?.status === 'EXPIRED') {
      // allow login through — fall through to token generation
    } else if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account suspended. Contact support.' });
    }

    if (user.role === 'NURSE') {
      if (user.nurseProfile?.status === 'SUSPENDED') {
        return res.status(403).json({ error: 'Your nurse account has been suspended. Contact support.' });
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('vonaxity-token', token, COOKIE_OPTIONS);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('vonaxity-token');
  res.json({ success: true });
});

// GET /auth/me
router.get('/me', async (req, res) => {
  const token = req.cookies?.['vonaxity-token'] ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token || token === 'set') return res.status(401).json({ error: 'Not authenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { subscription: true, relatives: true, nurseProfile: true },
    });
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, phone: user.phone, country: user.country, city: user.city, subscription: user.subscription, relatives: user.relatives } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

// POST /auth/forgot-password
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true });
    // Invalidate old tokens
    await prisma.passwordReset.updateMany({ where: { userId: user.id, used: false }, data: { used: true } });
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });
    const BASE_URL = process.env.FRONTEND_URL || 'https://vonaxity.com';
    const resetUrl = `${BASE_URL}/en/reset-password?token=${token}`;
    const { sendEmail } = require('../lib/email');
    await sendEmail({
      to: email,
      subject: 'Reset your Vonaxity password',
      html: `<div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#0F172A">
        <div style="font-size:22px;font-weight:700;color:#2563EB;margin-bottom:24px">Vonaxity</div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Reset your password</h2>
        <p style="color:#475569;margin-bottom:24px">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px">Reset password →</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">If you didn't request this, ignore this email.</p>
      </div>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// POST /auth/reset-password
router.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset || reset.used || reset.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired reset link' });
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } });
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });
    res.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
