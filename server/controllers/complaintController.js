const Complaint = require('../models/Complaint');
const generateComplaintId = require('../utils/complaintIdGenerator');
const { analyzePriority } = require('../services/aiPriorityService');
const { distanceMeters } = require('../utils/geo');

const DUPLICATE_RADIUS_METERS = 200;

// Looks for unresolved complaints in the same category within ~200m of the
// given point. Free (no external service) - plain haversine math against
// the same-category, not-yet-resolved complaints already in Mongo.
async function findNearbyDuplicates(category, latitude, longitude) {
  const candidates = await Complaint.find({
    category,
    status: { $ne: 'RESOLVED' },
  })
    .select('complaintId location')
    .limit(200)
    .lean();

  return candidates
    .filter((c) => distanceMeters(latitude, longitude, c.location.latitude, c.location.longitude) <= DUPLICATE_RADIUS_METERS)
    .map((c) => c.complaintId);
}

// POST /api/complaints
async function createComplaint(req, res) {
  try {
    const { category, description, latitude, longitude, address } = req.body;

    if (!category || !description || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Category, description and location are required to submit a complaint.',
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const complaintId = await generateComplaintId();
    const priority = await analyzePriority(description, category);
    const photoUrl = req.file ? req.file.path : null;
    const possibleDuplicates = await findNearbyDuplicates(category, lat, lng);

    const complaint = await Complaint.create({
      complaintId,
      category,
      description,
      location: { latitude: lat, longitude: lng, address: address || '' },
      photoUrl,
      priority,
      status: 'REPORTED',
      department: null,
      possibleDuplicates,
      citizenId: req.citizen.citizenId,
    });

    return res.status(201).json({ success: true, complaint });
  } catch (err) {
    console.error('createComplaint error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while submitting your complaint. Please try again.',
    });
  }
}

// GET /api/complaints/:complaintId
async function getComplaint(req, res) {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'No complaint found with that ID. Please check and try again.' });
    }
    return res.json({ success: true, complaint });
  } catch (err) {
    console.error('getComplaint error:', err);
    return res.status(500).json({ success: false, message: 'Unable to fetch complaint right now. Please try again shortly.' });
  }
}

// GET /api/complaints  (supports ?search=&status=&priority=&department=)
async function getAllComplaints(req, res) {
  try {
    const { search, status, priority, department } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status.toUpperCase();
    if (priority && priority !== 'All') filter['priority.level'] = priority;
    if (department && department !== 'All') filter.department = department;

    if (search) {
      filter.$or = [
        { complaintId: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
      ];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    const stats = {
      total: await Complaint.countDocuments(),
      reported: await Complaint.countDocuments({ status: 'REPORTED' }),
      assigned: await Complaint.countDocuments({ status: 'ASSIGNED' }),
      inProgress: await Complaint.countDocuments({ status: 'IN_PROGRESS' }),
      resolved: await Complaint.countDocuments({ status: 'RESOLVED' }),
    };

    return res.json({ success: true, complaints, stats });
  } catch (err) {
    console.error('getAllComplaints error:', err);
    return res.status(500).json({ success: false, message: 'Unable to load complaints right now.' });
  }
}

// PATCH /api/complaints/:complaintId  (authority only) - status / department changes
// that do NOT need a file upload (assign department, mark in progress).
async function updateComplaint(req, res) {
  try {
    const { status, department } = req.body;
    const update = {};

    if (status) {
      const validStatuses = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
      }
      update.status = status;
      if (status === 'RESOLVED') update.resolvedAt = new Date();
    }

    if (department) update.department = department;

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: req.params.complaintId },
      update,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Cascade the same change to any complaints merged into this one
    if (complaint.mergedComplaints?.length > 0) {
      await Complaint.updateMany({ complaintId: { $in: complaint.mergedComplaints } }, update);
    }

    return res.json({ success: true, complaint });
  } catch (err) {
    console.error('updateComplaint error:', err);
    return res.status(500).json({ success: false, message: 'Unable to update complaint right now.' });
  }
}

// POST /api/complaints/:complaintId/resolve  (authority only)
// Dedicated endpoint so an optional resolution photo can be uploaded via multipart/form-data.
async function resolveComplaint(req, res) {
  try {
    const resolutionPhotoUrl = req.file ? req.file.path : null;
    const update = { status: 'RESOLVED', resolvedAt: new Date() };
    if (resolutionPhotoUrl) update.resolutionPhotoUrl = resolutionPhotoUrl;

    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: req.params.complaintId },
      update,
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Cascade the same change to any complaints merged into this one
    if (complaint.mergedComplaints?.length > 0) {
      await Complaint.updateMany({ complaintId: { $in: complaint.mergedComplaints } }, update);
    }

    return res.json({ success: true, complaint });
  } catch (err) {
    console.error('resolveComplaint error:', err);
    return res.status(500).json({ success: false, message: 'Unable to resolve this complaint right now.' });
  }
}

// POST /api/complaints/:complaintId/merge  (authority only)
// Links other complaints (same issue, reported separately) to this one. From
// then on, any status/department/resolve change made on this complaint is
// automatically copied onto every complaint merged into it, so the authority
// only has to manage one, and every citizen who reported it sees the same
// live status when they track their own Complaint ID.
async function mergeComplaints(req, res) {
  try {
    const { duplicateIds } = req.body;

    if (!Array.isArray(duplicateIds) || duplicateIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one complaint to merge.' });
    }

    const primary = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!primary) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Point each duplicate at the primary and immediately sync its current
    // status/department/resolution so they're in sync from the moment of merging.
    await Complaint.updateMany(
      { complaintId: { $in: duplicateIds } },
      {
        mergedInto: primary.complaintId,
        status: primary.status,
        department: primary.department,
        resolvedAt: primary.resolvedAt,
        resolutionPhotoUrl: primary.resolutionPhotoUrl,
      }
    );

    primary.mergedComplaints = Array.from(new Set([...(primary.mergedComplaints || []), ...duplicateIds]));
    await primary.save();

    return res.json({ success: true, complaint: primary });
  } catch (err) {
    console.error('mergeComplaints error:', err);
    return res.status(500).json({ success: false, message: 'Could not merge these complaints right now.' });
  }
}

// PATCH /api/complaints/:complaintId/rate  (citizen, no auth - anyone with the complaint ID)
async function rateComplaint(req, res) {
  try {
    const { score, feedback } = req.body;
    const numScore = parseInt(score, 10);

    if (!numScore || numScore < 1 || numScore > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5 stars.' });
    }

    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({ success: false, message: 'You can only rate a complaint after it has been resolved.' });
    }
    if (complaint.rating?.score) {
      return res.status(400).json({ success: false, message: 'This complaint has already been rated. Thank you!' });
    }

    complaint.rating = { score: numScore, feedback: feedback || '', ratedAt: new Date() };
    await complaint.save();

    return res.json({ success: true, complaint });
  } catch (err) {
    console.error('rateComplaint error:', err);
    return res.status(500).json({ success: false, message: 'Unable to submit your rating right now.' });
  }
}

// GET /api/complaints/mine/list  (citizen only) - complaints tied to the logged-in citizen's account
async function getMyComplaints(req, res) {
  try {
    const complaints = await Complaint.find({ citizenId: req.citizen.citizenId }).sort({ createdAt: -1 });
    return res.json({ success: true, complaints });
  } catch (err) {
    console.error('getMyComplaints error:', err);
    return res.status(500).json({ success: false, message: 'Unable to load your complaints right now.' });
  }
}

// GET /api/complaints/stats/public - lightweight public stats for landing page
async function getPublicStats(req, res) {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'RESOLVED' });
    const responseRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return res.json({ success: true, stats: { total, resolved, responseRate } });
  } catch (err) {
    console.error('getPublicStats error:', err);
    return res.status(500).json({ success: false, message: 'Unable to load stats.' });
  }
}

module.exports = {
  createComplaint,
  getComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaint,
  resolveComplaint,
  mergeComplaints,
  rateComplaint,
  getPublicStats,
};