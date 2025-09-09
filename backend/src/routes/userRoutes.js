const express = require('express');
const { getProfile, updateProfile, updatePassword, sendEmailOTP, updatePasswordWithEmail, syncWaitlistRewards } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { profileUpdateLimiter, otpLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, profileUpdateLimiter, updateProfile);
router.post('/send-email-otp', auth, otpLimiter, sendEmailOTP);
router.put('/update-password', auth, passwordResetLimiter, updatePassword);
router.put('/update-password-email', auth, passwordResetLimiter, updatePasswordWithEmail);
router.post('/sync-waitlist-rewards', auth, syncWaitlistRewards);
router.get('/waitlist-rewards', auth, async (req, res) => {
  try {
    const Waitlist = require('../models/Waitlist');
    const User = require('../models/User');
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const waitlistEntry = await Waitlist.findOne({
      $or: [{ userId: user._id }, { email: user.email }]
    });

    if (waitlistEntry && waitlistEntry.isRewardsClaimed) {
      return res.json({
        success: true,
        isWaitlistMember: true,
        waitlistRewards: waitlistEntry.exclusiveRewards || []
      });
    }
    res.json({
      success: true,
      isWaitlistMember: false,
      waitlistRewards: []
    });
  } catch (error) {
    console.error('Error fetching waitlist rewards:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;