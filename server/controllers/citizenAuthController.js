const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Citizen = require('../models/Citizen');

// POST /api/citizens/signup
async function signup(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await Citizen.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please log in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const citizen = await Citizen.create({ name, email: email.toLowerCase(), passwordHash, phone: phone || '' });

    const token = jwt.sign(
      { citizenId: citizen._id.toString(), name: citizen.name, role: 'citizen' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ success: true, token, name: citizen.name });
  } catch (err) {
    console.error('citizen signup error:', err);
    return res.status(500).json({ success: false, message: 'Could not create your account right now. Please try again.' });
  }
}

// POST /api/citizens/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const citizen = await Citizen.findOne({ email: email.toLowerCase() });
    if (!citizen) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, citizen.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { citizenId: citizen._id.toString(), name: citizen.name, role: 'citizen' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ success: true, token, name: citizen.name });
  } catch (err) {
    console.error('citizen login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

module.exports = { signup, login };
