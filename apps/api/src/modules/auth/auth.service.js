const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../../db/pool');

async function login(email, password) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, department: user.department, location: user.location, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, user: { id: user.id, name: user.name, role: user.role, department: user.department, location: user.location } };
}

module.exports = { login };
