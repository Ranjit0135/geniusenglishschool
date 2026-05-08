const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');
const { resolveSchool } = require('../middleware/tenantMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to get links for a school
router.get('/', resolveSchool, socialController.getSocialLinks);

// Protected routes for management
router.post('/', protect, upload.single('icon'), socialController.createSocialLink);
router.patch('/:id', protect, upload.single('icon'), socialController.updateSocialLink);
router.delete('/:id', protect, socialController.deleteSocialLink);

module.exports = router;
