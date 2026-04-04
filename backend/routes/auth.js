const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/db');

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
    const {
      name, email, password, phone,
      city, bio, experience, languages, services,
      licenseNumber, issuingAuthority,
      availability, diplomaUrl, licenseUrl, profilePhotoUrl,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!licenseNumber) {
      return res.status(400).json({ error: 'License number is required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name, email, passwordHash, phone,
        role: 'NURSE', status: 'ACTIVE',
        nurseProfile: {
          create: {
            city: city || '',
            bio: bio || '',
            experience: experience || '',
            languages: JSON.stringify(languages || []),
            services: JSON.stringify(services || []),
            licenseNumber,
            issuingAuthority: issuingAuthority || '',
            availability: JSON.stringify(availability || []),
            diplomaUrl: diplomaUrl || null,
            licenseUrl: licenseUrl || null,
            profilePhotoUrl: profilePhotoUrl || null,
            status: 'PENDING',
            submittedAt: new Date(),
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email }, include: { nurseProfile: true } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account suspended. Contact support.' });
    }

    if (user.role === 'NURSE') {
      if (user.nurseProfile?.status === 'PENDING') {
        return res.status(403).json({ error: 'Your nurse account is pending approval.' });
      }
      if (user.nurseProfile?.status === 'SUSPENDED') {
        return res.status(403).json({ error: 'Your nurse account has been suspended.' });
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
