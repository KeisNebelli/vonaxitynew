const jwt = require('jsonwebtoken');

/**
 * authMiddleware — verifies the JWT on every protected request.
 *
 * Token sources (checked in order):
 *   1. Cookie: `vonaxity-token` — set by Next.js middleware after login for SSR/edge route guards
 *   2. Authorization header: `Bearer <token>` — used by all direct API calls from the frontend
 *
 * On success: attaches `req.user = { userId, role, email, name }` to the request.
 * On failure: returns 401. The frontend clears the stored token and redirects to /login.
 *
 * JWT_SECRET is in the backend .env. Rotating it invalidates ALL active sessions immediately.
 */
function authMiddleware(req, res, next) {
  // Check cookie first, then Authorization header
  const token = req.cookies?.['vonaxity-token'] ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token || token === 'set') {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * requireRole(...roles) — factory that returns [authMiddleware, roleGuard].
 *
 * Usage: router.get('/admin-only', ...requireRole('ADMIN'), handler)
 *        router.post('/visit', ...requireRole('CLIENT', 'ADMIN'), handler)
 *
 * Roles: CLIENT | NURSE | ADMIN
 * Returns 403 if the authenticated user's role is not in the allowed list.
 */
function requireRole(...roles) {
  return [
    authMiddleware,
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    },
  ];
}

module.exports = { authMiddleware, requireRole };
