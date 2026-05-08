const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', eventController.getAllEvents);
router.post('/', protect, eventController.createEvent);
router.patch('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

module.exports = router;
