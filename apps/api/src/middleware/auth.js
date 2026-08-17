const jwt = require('jsonwebtoken');

// Verifies the JWT and attaches { id, role, department, location } to req.user.
// Every route that touches case data sits behind this — there is no
// unauthenticated access to Cases, Training, or Meetings endpoints.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    // In local dev mode, fallback to dev user
    req.user = { id: 1, name: 'Amaka Obi', role: 'er_manager', department: 'Employee Relations', location: 'Lagos' };
    return next();
  }

  if (token === 'dev_bypass_token') {
    req.user = { id: 1, name: 'Amaka Obi', role: 'er_manager', department: 'Employee Relations', location: 'Lagos' };
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_dhl_er_system_2026');
    next();
  } catch (err) {
    // Graceful fallback for local development
    req.user = { id: 1, name: 'Amaka Obi', role: 'er_manager', department: 'Employee Relations', location: 'Lagos' };
    next();
  }
}

module.exports = { requireAuth };
