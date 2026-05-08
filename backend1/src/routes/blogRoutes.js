const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', blogController.getAllBlogs);
router.post('/', protect, blogController.createBlog);
router.patch('/:id', protect, blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);

module.exports = router;
