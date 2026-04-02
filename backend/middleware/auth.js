const jwt = require('jsonwebtoken');

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
