const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');
const uiController = require('../controllers/uiController');
const upload = require('../middleware/uploadMiddleware');

const { protect, restrictTo } = require('../middleware/authMiddleware');
const { resolveSchool } = require('../middleware/tenantMiddleware');

// Public route to fetch navigation
router.get('/navigation', resolveSchool, navigationController.getNavigation);
router.get('/testimonials', resolveSchool, uiController.getTestimonials);
router.post('/testimonials/submit', resolveSchool, upload.single('image'), uiController.createTestimonial);

// Protected routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.post('/navigation', navigationController.createNavigation);
router.patch('/navigation/:id', navigationController.updateNavigation);
router.delete('/navigation/:id', navigationController.deleteNavigation);

// New Logo Upload Route
router.patch('/school/logo', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'general_hero_image', maxCount: 1 }
]), navigationController.updateSchoolLogo);

module.exports = router;
