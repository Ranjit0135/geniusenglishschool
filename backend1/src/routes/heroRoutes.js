const express = require('express');
const router = express.Router();
const { getHero, updateHero } = require('../controllers/heroController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getHero);
router.patch('/', protect, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), updateHero);

module.exports = router;
