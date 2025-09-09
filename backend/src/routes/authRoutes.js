const express = require('express');
const { register, login, sendOTP, verifyOTP, forgotPassword, resetPassword, sendPasswordResetOTP } = require('../controllers/authController');
const { loginLimiter, otpLimiter, passwordResetLimiter, registrationLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/register', registrationLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);
router.post('/send-password-reset-otp', otpLimiter, sendPasswordResetOTP);

module.exports = router;