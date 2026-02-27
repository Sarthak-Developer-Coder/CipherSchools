const jwt = require('jsonwebtoken');

/**
 * Optional auth middleware – if a token is present it decodes it,
 * otherwise the request proceeds as a guest.
 */
const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
};

/**
 * Required auth – blocks unauthenticated requests.
 */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { optionalAuth, requireAuth };
