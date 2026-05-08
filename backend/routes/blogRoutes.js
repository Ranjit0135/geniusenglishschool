const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/uploadMiddleware');

const { protect, restrictTo } = require('../middleware/authMiddleware');
const { resolveSchool } = require('../middleware/tenantMiddleware');

// Public routes
router.get('/', resolveSchool, blogController.getAllPosts);
router.get('/:slug', resolveSchool, blogController.getPostBySlug);
router.get('/id/:id', resolveSchool, blogController.getPostById);

// Protected routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.post('/', resolveSchool, upload.single('image'), blogController.createPost);
router.patch('/:id', resolveSchool, upload.single('image'), blogController.updatePost);
router.delete('/:id', resolveSchool, blogController.deletePost);

module.exports = router;
