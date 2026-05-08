const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.patch('/', protect, updateSettings);

module.exports = router;
