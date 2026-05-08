const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { resolveSchool } = require('../middleware/tenantMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', resolveSchool, newsController.getAllNews);
router.get('/:slug', resolveSchool, newsController.getNewsBySlug);
router.get('/id/:id', resolveSchool, newsController.getNewsById);

// Protected admin routes
router.post('/', protect, resolveSchool, upload.any(), newsController.createNews);
router.patch('/:id', protect, resolveSchool, upload.any(), newsController.updateNews);
router.delete('/:id', protect, resolveSchool, newsController.deleteNews);

module.exports = router;
