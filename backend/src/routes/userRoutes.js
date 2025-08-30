const express = require('express');
const { getProfile, updateProfile, updatePassword, sendEmailOTP, updatePasswordWithEmail } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { cache } = require('../middleware/cache');
const router = express.Router();

router.get('/profile', auth, cache(300), getProfile);
router.put('/profile', auth, updateProfile);
router.post('/send-email-otp', auth, sendEmailOTP);
router.put('/update-password', auth, updatePassword);
router.put('/update-password-email', auth, updatePasswordWithEmail);

module.exports = router;