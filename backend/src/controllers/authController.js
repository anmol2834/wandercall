const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetOTP } = require('../services/emailService');

const generateToken = (id) => {
  // Hardcode JWT expiration since env var is corrupted
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Temporary storage for OTP data (in production, use Redis)
const otpStorage = new Map();
const passwordResetOtpStorage = new Map();

exports.sendOTP = async (req, res) => {
  try {
    const { email, name, agreedToTerms, password } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Email and name are required' });
    }
    
    // Check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }
    
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store OTP data in memory (not in database)
    otpStorage.set(email, {
      name,
      email,
      password,
      otp,
      otpExpires,
      isVerified: false,
      agreedToTerms: agreedToTerms || true
    });
    
    // Send OTP email asynchronously (don't wait)
    sendOTPEmail(email, otp, name).catch(emailError => {
      console.error('Email sending failed but continuing:', emailError);
    });
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {

    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    
    // Get OTP data from memory storage
    const otpData = otpStorage.get(email);
    if (!otpData) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }
    

    
    if (otpData.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    if (otpData.otpExpires < new Date()) {
      otpStorage.delete(email); // Clean up expired OTP
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    
    // Create user in database immediately after email verification
    const user = new User({
      name: otpData.name,
      email: otpData.email,
      password: otpData.password,
      isEmailVerified: true,
      agreedToTerms: otpData.agreedToTerms
    });
    await user.save();
    
    // Clean up memory storage
    otpStorage.delete(email);
    
    // Link waitlist entry if exists
    const { linkWaitlistToUser } = require('./waitlistController');
    const linked = await linkWaitlistToUser(user._id, email);
    console.log('Waitlist linking result:', linked, 'for user:', user._id, 'email:', email);
    
    // Send welcome email asynchronously (don't wait)
    sendWelcomeEmail(email, otpData.name).catch(emailError => {
      console.error('Welcome email sending failed but continuing:', emailError);
    });
    
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find the user (should already exist from email verification)
    const user = await User.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Please verify your email first' });
    }
    

    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {

    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Please complete your registration first' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }
    
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store OTP for password reset
    passwordResetOtpStorage.set(email, {
      otp,
      otpExpires,
      userId: user._id
    });
    
    // Send password reset OTP email asynchronously (don't wait)
    sendPasswordResetOTP(email, otp, user.name).catch(emailError => {
      console.error('Password reset email sending failed but continuing:', emailError);
    });
    
    res.json({ success: true, message: 'Password reset OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send password reset OTP' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, old password, and new password are required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }
    
    // Get OTP data from storage
    const otpData = passwordResetOtpStorage.get(email);
    if (!otpData) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }
    
    // Verify OTP
    if (otpData.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    if (otpData.otpExpires < new Date()) {
      passwordResetOtpStorage.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    
    // Find user and update password
    const user = await User.findById(otpData.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();
    
    // Clean up OTP storage
    passwordResetOtpStorage.delete(email);
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};