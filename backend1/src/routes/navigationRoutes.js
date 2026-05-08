const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config for Logo
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Navigation Routes
router.get('/public/navigation', navigationController.getNavigation);
router.post('/public/navigation', protect, navigationController.createNavigation);
router.get('/public/navigation/all', protect, navigationController.getAllNavigationAdmin);
router.patch('/public/navigation/:id', protect, navigationController.updateNavigation);
router.delete('/public/navigation/:id', protect, navigationController.deleteNavigation);

// Identity management (Logo/Name)
router.patch('/public/school/logo', protect, upload.single('logo'), navigationController.updateSchoolBranding);

module.exports = router;
