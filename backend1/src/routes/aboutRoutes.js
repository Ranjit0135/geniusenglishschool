const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `about-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/', getAbout);
router.patch('/', protect, upload.single('image'), updateAbout);

module.exports = router;
