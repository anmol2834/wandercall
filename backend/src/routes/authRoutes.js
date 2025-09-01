const express = require('express');
const { register, login, sendOTP, verifyOTP, forgotPassword, resetPassword, sendPasswordResetOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-password-reset-otp', sendPasswordResetOTP);

module.exports = router;