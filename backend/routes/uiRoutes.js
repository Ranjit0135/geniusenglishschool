const express = require('express');
const router = express.Router();
const uiController = require('../controllers/uiController');
const upload = require('../middleware/uploadMiddleware');

const { protect, restrictTo, optionalProtect } = require('../middleware/authMiddleware');
const { resolveSchool } = require('../middleware/tenantMiddleware');

// Public routes for website display (Resolved via x-school-id or domain)
router.get('/about', resolveSchool, uiController.getAboutContent);
router.get('/gallery', resolveSchool, uiController.getGalleryItems);
router.get('/hero', resolveSchool, uiController.getHeroContent);
router.get('/principal-message', resolveSchool, uiController.getPrincipalContent);
router.get('/contact', resolveSchool, uiController.getContactContent);
router.get('/school', optionalProtect, resolveSchool, uiController.getSchoolSettings);
router.get('/courses', resolveSchool, uiController.getCourses);
router.get('/courses/:id', resolveSchool, uiController.getCourseById);

// Protected management routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.post('/about', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'tour_image', maxCount: 1 }
]), uiController.updateAboutContent);
router.post('/gallery', upload.single('media'), uiController.createGalleryItem);
router.patch('/gallery/:id', upload.single('media'), uiController.updateGalleryItem);
router.delete('/gallery/:id', uiController.deleteGalleryItem);
router.patch('/hero', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'principal_image', maxCount: 1 }
]), uiController.updateHeroContent);
router.patch('/principal-message', upload.any(), uiController.updatePrincipalContent);
router.patch('/contact', upload.single('image'), uiController.updateContactContent);
router.patch('/school', upload.fields([
    { name: 'general_hero', maxCount: 1 },
    { name: 'event_hero', maxCount: 1 },
    { name: 'blog_hero', maxCount: 1 },
    { name: 'gallery_hero', maxCount: 1 },
    { name: 'news_hero', maxCount: 1 },
    { name: 'about_hero', maxCount: 1 },
    { name: 'contact_hero', maxCount: 1 },
    { name: 'school_life_hero', maxCount: 1 },
    { name: 'courses_hero', maxCount: 1 }
]), uiController.updateSchoolSettings);
router.post('/finish-setup', uiController.finishSetup);

// Testimonials
router.get('/testimonials', uiController.getTestimonials);
router.post('/testimonials', upload.single('image'), uiController.createTestimonial);
router.patch('/testimonials/:id', upload.single('image'), uiController.updateTestimonial);
router.delete('/testimonials/:id', uiController.deleteTestimonial);

// Courses Management
router.get('/manage-courses', uiController.getCourses);
router.post('/courses', upload.single('image'), uiController.createCourse);
router.patch('/courses/:id', upload.single('image'), uiController.updateCourse);
router.delete('/courses/:id', uiController.deleteCourse);

// Super Admin only routes
router.get('/schools', restrictTo('SUPER_ADMIN'), uiController.getAllSchools);
router.patch('/toggle-status/:id', restrictTo('SUPER_ADMIN'), uiController.toggleSchoolStatus);
router.patch('/school/:id', restrictTo('SUPER_ADMIN'), uiController.adminUpdateSchool);

module.exports = router;
