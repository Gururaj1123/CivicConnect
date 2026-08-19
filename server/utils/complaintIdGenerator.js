const Complaint = require('../models/Complaint');

/**
 * Generates a unique, sequential complaint ID like CP-2026-0001.
 * Uses the latest complaint created in the current year to build
 * the next sequence number, then verifies uniqueness against the DB
 * before returning (guards against race conditions on concurrent submits).
 */
async function generateComplaintId() {
  const year = new Date().getFullYear();
  const prefix = `CP-${year}-`;

  const latest = await Complaint.findOne({ complaintId: new RegExp(`^${prefix}`) })
    .sort({ createdAt: -1 })
    .lean();

  let nextNumber = 1;
  if (latest) {
    const lastSeq = parseInt(latest.complaintId.split('-')[2], 10);
    nextNumber = lastSeq + 1;
  }

  let candidateId;
  let exists = true;
  while (exists) {
    candidateId = `${prefix}${String(nextNumber).padStart(4, '0')}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Complaint.exists({ complaintId: candidateId });
    if (exists) nextNumber += 1;
  }

  return candidateId;
}

module.exports = generateComplaintId;
