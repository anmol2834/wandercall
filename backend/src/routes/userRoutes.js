const express = require('express');
const { getProfile, updateProfile, updatePassword, sendEmailOTP, updatePasswordWithEmail } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/send-email-otp', auth, sendEmailOTP);
router.put('/update-password', auth, updatePassword);
router.put('/update-password-email', auth, updatePasswordWithEmail);

module.exports = router;