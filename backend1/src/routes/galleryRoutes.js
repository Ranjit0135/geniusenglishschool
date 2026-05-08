const express = require('express');
const router = express.Router();
const { getGallery, createGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGallery);
router.post('/', protect, createGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
