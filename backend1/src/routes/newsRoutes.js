const express = require('express');
const router = express.Router();
const { getNews, getNewsBySlug, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);
router.post('/', protect, createNews);
router.patch('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);

module.exports = router;
