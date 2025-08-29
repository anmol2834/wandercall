const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Temporary storage for OTP data (in production, use Redis)
const otpStorage = new Map();

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
    
    // Send OTP email
    await sendOTPEmail(email, otp, name);
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('OTP Verification attempt:', { email, otp });
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    
    // Get OTP data from memory storage
    const otpData = otpStorage.get(email);
    if (!otpData) {
      console.log('OTP data not found for email:', email);
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }
    
    console.log('OTP data:', { 
      storedOTP: otpData.otp, 
      receivedOTP: otp, 
      otpExpires: otpData.otpExpires,
      currentTime: new Date()
    });
    
    if (otpData.otp !== otp.toString()) {
      console.log('OTP mismatch');
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    if (otpData.otpExpires < new Date()) {
      console.log('OTP expired');
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
    
    console.log('User created after email verification:', user._id);
    
    // Link waitlist entry if exists
    const { linkWaitlistToUser } = require('./waitlistController');
    await linkWaitlistToUser(user._id, email);
    
    // Send welcome email
    await sendWelcomeEmail(email, otpData.name);
    
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
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
    
    console.log('User login after verification:', user._id);
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      console.log('Login validation failed: Missing fields');
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (!user.password) {
      console.log('User has no password set:', email);
      return res.status(401).json({ success: false, message: 'Please complete your registration first' });
    }
    
    console.log('Comparing password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    console.log('Login successful for user:', user._id);
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};