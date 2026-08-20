const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Garbage/Waste',
        'Road Damage',
        'Streetlight',
        'Drainage',
        'Water Supply',
        'Sanitation',
        'Public Infrastructure',
        'Other',
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    photoUrl: {
      type: String,
      default: null,
    },
    priority: {
      level: { type: String, enum: ['P1', 'P2', 'P3', 'P4'], default: 'P4' },
      score: { type: Number, default: 0 },
      reason: { type: String, default: '' },
      source: { type: String, enum: ['ai', 'rule-based'], default: 'rule-based' },
    },
    status: {
      type: String,
      enum: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
      default: 'REPORTED',
    },
    department: {
      type: String,
      enum: [
        null,
        'Public Works Department',
        'Sanitation Department',
        'Water Supply Department',
        'Electrical Department',
        'Municipal Engineering Department',
      ],
      default: null,
    },
    citizenId: {
      type: String,
      default: null, // reserved for future citizen-account feature
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionPhotoUrl: {
      type: String,
      default: null, // proof-of-work photo the authority uploads when resolving
    },
    rating: {
      score: { type: Number, min: 1, max: 5, default: null },
      feedback: { type: String, default: '' },
      ratedAt: { type: Date, default: null },
    },
    possibleDuplicates: {
      type: [String], // complaintIds of nearby, unresolved, same-category complaints at submission time
      default: [],
    },
    mergedInto: {
      type: String,
      default: null, // if set, this complaint follows the status of the complaintId named here
    },
    mergedComplaints: {
      type: [String],
      default: [], // for a "primary" complaint: complaintIds merged into it
    },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model('Complaint', complaintSchema);