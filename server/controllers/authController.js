const jwt = require('jsonwebtoken');

/**
 * PROTOTYPE LOGIN ONLY.
 * Demo credentials come from .env (ADMIN_USERNAME / ADMIN_PASSWORD),
 * defaulting to admin / admin123 for the hackathon demo.
 *
 * Production checklist (not implemented here, on purpose):
 *   - Store authorities in MongoDB (see models/Authority.js)
 *   - Hash passwords with bcrypt, never compare plaintext
 *   - Add rate limiting / lockout on repeated failed logins
 *   - Use short-lived JWTs + refresh tokens or server sessions
 *   - Role-based permissions per department
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== validUsername || password !== validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { username, role: 'authority' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ success: true, token, username });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

module.exports = { login };
