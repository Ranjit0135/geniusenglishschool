const express = require('express');
const router = express.Router();
const { login, register, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', protect, (req, res) => res.json(req.user));
router.patch('/profile', protect, updateProfile);

module.exports = router;
