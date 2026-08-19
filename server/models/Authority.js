const mongoose = require('mongoose');

// Prototype-only model. In production this would back real accounts
// with hashed passwords and roles/permissions per department.
const authoritySchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'authority' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Authority', authoritySchema);
