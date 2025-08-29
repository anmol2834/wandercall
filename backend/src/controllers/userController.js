const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendPasswordResetOTP } = require('../services/emailService');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
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