const jwt = require('jsonwebtoken');

/**
 * Protects authority-only routes. Expects:
 *   Authorization: Bearer <token>
 * Prototype-level check only - see authController.js for production notes.
 */
function requireAuthority(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authority login required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'authority') {
      return res.status(403).json({ success: false, message: 'Authority login required.' });
    }
    req.authority = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }
}

/**
 * Protects citizen-only routes (e.g. "My Complaints"). Same bearer-token
 * pattern as requireAuthority, but checks for role: 'citizen' so an
 * authority token can never be used to view someone's private complaint list.
 */
function requireCitizen(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please log in to view your complaints.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'citizen') {
      return res.status(403).json({ success: false, message: 'Citizen login required.' });
    }
    req.citizen = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}

module.exports = { requireAuthority, requireCitizen };
