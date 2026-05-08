const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/uploadMiddleware');

const { protect, restrictTo } = require('../middleware/authMiddleware');
const { resolveSchool } = require('../middleware/tenantMiddleware');

// Public route to fetch events
router.get('/', resolveSchool, eventController.getAllEvents);
router.get('/:slug', resolveSchool, eventController.getEventBySlug);
router.get('/id/:id', resolveSchool, eventController.getEventById);

// Protected routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.post('/', resolveSchool, upload.any(), eventController.createEvent);
router.patch('/:id', resolveSchool, upload.any(), eventController.updateEvent);
router.delete('/:id', resolveSchool, eventController.deleteEvent);

module.exports = router;
