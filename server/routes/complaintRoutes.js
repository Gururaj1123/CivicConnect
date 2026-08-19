const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { requireAuthority, requireCitizen } = require('../middleware/authMiddleware');
const {
  createComplaint,
  getComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaint,
  resolveComplaint,
  rateComplaint,
  getPublicStats,
} = require('../controllers/complaintController');

router.get('/stats/public', getPublicStats);
router.get('/mine/list', requireCitizen, getMyComplaints);
router.post('/', requireCitizen, upload.single('photo'), createComplaint);
router.get('/', requireAuthority, getAllComplaints);
router.get('/:complaintId', getComplaint);
router.patch('/:complaintId', requireAuthority, updateComplaint);
router.post('/:complaintId/resolve', requireAuthority, upload.single('resolutionPhoto'), resolveComplaint);
router.patch('/:complaintId/rate', rateComplaint);

module.exports = router;
