const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// Photos are optional (see ComplaintForm) - this just wires uploads to
// Cloudinary's free tier when a file is present.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'civicconnect/complaints',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = upload;
