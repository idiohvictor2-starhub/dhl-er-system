const jwt = require('jsonwebtoken');

// Verifies the JWT and attaches { id, role, department, location } to req.user.
// Every route that touches case data sits behind this — there is no
// unauthenticated access to Cases, Training, or Meetings endpoints.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
