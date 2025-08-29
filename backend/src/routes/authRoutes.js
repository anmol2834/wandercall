const express = require('express');
const { register, login, sendOTP, verifyOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);

module.exports = router;