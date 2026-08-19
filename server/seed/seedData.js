/**
 * Seeds demo complaints so the authority dashboard looks populated
 * during a hackathon demo. Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Complaint = require('../models/Complaint');

const demoComplaints = [
  {
    complaintId: 'CP-2026-0001',
    category: 'Road Damage',
    description: 'Large pothole causing difficulty for vehicles near the main market road.',
    location: { latitude: 15.8497, longitude: 74.4977, address: 'Belagavi, Karnataka' },
    photoUrl: null,
    priority: { level: 'P2', score: 65, reason: 'Potential impact on public mobility and requires municipal attention.' },
    status: 'REPORTED',
    department: null,
  },
  {
    complaintId: 'CP-2026-0002',
    category: 'Garbage/Waste',
    description: 'Garbage accumulation near the residential block, not collected for several days.',
    location: { latitude: 15.8522, longitude: 74.5001, address: 'Belagavi, Karnataka' },
    photoUrl: null,
    priority: { level: 'P1', score: 90, reason: 'Overflowing waste poses a public health and sanitation risk.' },
    status: 'ASSIGNED',
    department: 'Sanitation Department',
  },
  {
    complaintId: 'CP-2026-0003',
    category: 'Streetlight',
    description: 'Streetlight has been broken for two weeks, area is dark at night.',
    location: { latitude: 15.8560, longitude: 74.5090, address: 'Belagavi, Karnataka' },
    photoUrl: null,
    priority: { level: 'P3', score: 35, reason: 'Streetlight outages affect visibility and safety at night.' },
    status: 'IN_PROGRESS',
    department: 'Electrical Department',
  },
  {
    complaintId: 'CP-2026-0004',
    category: 'Drainage',
    description: 'Drainage blocked and overflowing onto the street after rain.',
    location: { latitude: 15.8440, longitude: 74.4890, address: 'Belagavi, Karnataka' },
    photoUrl: null,
    priority: { level: 'P2', score: 60, reason: 'Drainage issues risk flooding and public health concerns.' },
    status: 'RESOLVED',
    department: 'Public Works Department',
    resolvedAt: new Date(),
  },
];

async function seed() {
  await connectDB();
  await Complaint.deleteMany({ complaintId: { $in: demoComplaints.map((c) => c.complaintId) } });
  await Complaint.insertMany(demoComplaints);
  console.log('Seeded demo complaints CP-2026-0001 through CP-2026-0004.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
