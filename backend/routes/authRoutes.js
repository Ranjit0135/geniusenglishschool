const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

const upload = require('../middleware/uploadMiddleware');

// State synchronization
router.get('/me', protect, authController.getMe);
router.patch('/update-credentials', protect, authController.updateCredentials);
router.patch('/avatar', protect, upload.single('avatar'), authController.updateAvatar);

module.exports = router;
