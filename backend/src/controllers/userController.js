const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendPasswordResetOTP } = require('../services/emailService');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

exports.getProfile = async (req, res) => {
  try {
    const WaitlistService = require('../services/waitlistService');
    
    // Get user with waitlist data attached
    const user = await WaitlistService.getUserWithWaitlistData(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, selectedAvatar } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (selectedAvatar !== undefined) updateData.selectedAvatar = selectedAvatar;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    // If user doesn't have waitlist rewards but is a waitlist member, try to fetch from waitlist
    if (user.isWaitlistMember && (!user.waitlistRewards || user.waitlistRewards.length === 0)) {
      const Waitlist = require('../models/Waitlist');
      const waitlistEntry = await Waitlist.findOne({ 
        $or: [{ userId: user._id }, { email: user.email }] 
      });
      
      if (waitlistEntry && waitlistEntry.exclusiveRewards && waitlistEntry.exclusiveRewards.length > 0) {
        // Update user with waitlist rewards
        user.waitlistRewards = waitlistEntry.exclusiveRewards;
        await user.save();
      }
    }
    

    
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



exports.sendEmailOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (10 minutes)
    const otpKey = `email_${req.user._id}`;
    otpStore.set(otpKey, {
      otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send password reset OTP email
    await sendPasswordResetOTP(user.email, otp, user.name);
    
    res.json({ 
      success: true, 
      message: 'Password reset OTP sent to your email address'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has a password (for OAuth users)
    if (!user.password) {
      return res.status(400).json({ success: false, message: 'Password not set for this account' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await User.findByIdAndUpdate(req.user._id, { password: hashedNewPassword });
    
    res.json({ 
      success: true, 
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePasswordWithEmail = async (req, res) => {
  try {
    const { emailOtp, newPassword } = req.body;
    
    if (!emailOtp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email OTP and new password are required' });
    }

    const otpKey = `email_${req.user._id}`;
    const storedOtpData = otpStore.get(otpKey);
    
    if (!storedOtpData) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (Date.now() > storedOtpData.expires) {
      otpStore.delete(otpKey);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (storedOtpData.otp !== emailOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await User.findByIdAndUpdate(req.user._id, { password: hashedNewPassword });
    
    // Clean up OTP
    otpStore.delete(otpKey);
    
    res.json({ 
      success: true, 
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new endpoint to sync waitlist rewards
exports.syncWaitlistRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const Waitlist = require('../models/Waitlist');
    const waitlistEntry = await Waitlist.findOne({ 
      $or: [{ userId: user._id }, { email: user.email }] 
    });
    
    if (waitlistEntry && waitlistEntry.exclusiveRewards && waitlistEntry.exclusiveRewards.length > 0) {
      // Update user with waitlist rewards
      user.waitlistRewards = waitlistEntry.exclusiveRewards;
      user.isWaitlistMember = true;
      await user.save();
      
      // Also update the waitlist entry to link it properly
      if (!waitlistEntry.userId) {
        waitlistEntry.userId = user._id;
        waitlistEntry.isRewardsClaimed = true;
        await waitlistEntry.save();
      }
    }
    
    res.json({ success: true, user: await User.findById(req.user._id).select('-password') });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};