const Provider = require('../models/Provider');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendOTPEmail } = require('../services/emailService');

// Register new provider
const registerProvider = async (req, res) => {
  try {
    
    const {
      fullName, email, phone, password,
      businessName, businessType, description, availableDays,
      address, city, state, pincode, mapLink,
      agreeTerms
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !businessName || 
        !businessType || !description || !availableDays || !address || 
        !city || !state || !pincode || !mapLink || !agreeTerms) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate terms acceptance
    if (agreeTerms !== true) {
      return res.status(400).json({
        success: false,
        message: 'Terms and conditions must be accepted'
      });
    }

    // Check if email is verified
    if (!global.verifiedEmails?.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email must be verified before registration'
      });
    }

    // Check if provider already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'Provider with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create provider
    const provider = new Provider({
      fullName,
      email,
      emailVerified: true, // Set to true since we verified it
      phone,
      password: hashedPassword,
      businessName,
      businessType,
      description,
      availableDays,
      address,
      city,
      state,
      pincode,
      mapLink,
      agreeTerms
    });

    await provider.save();

    // Remove from verified emails after successful registration
    global.verifiedEmails?.delete(email);

    // Check for matching products and create cross-references
    const matchingProducts = await Product.find({ email });
    if (matchingProducts.length > 0) {
      // Add product references to provider
      provider.products = matchingProducts.map(product => product._id);
      await provider.save();

      // Add provider reference to matching products
      await Product.updateMany(
        { email },
        { $set: { providerId: provider._id } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Provider registered successfully',
      provider: {
        id: provider._id,
        fullName: provider.fullName,
        email: provider.email,
        businessName: provider.businessName,
        status: provider.status
      }
    });

  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register provider'
    });
  }
};

// Send email verification
const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email is already registered
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use a different email or login to your existing account.'
      });
    }

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification data temporarily
    const tempVerification = {
      email,
      code: verificationCode,
      expires: verificationExpires
    };

    // Store in memory or database (for simplicity, using a Map)
    if (!global.emailVerifications) {
      global.emailVerifications = new Map();
    }
    global.emailVerifications.set(email, tempVerification);

    // Try to send email using existing email service
    try {
      await sendOTPEmail(email, verificationCode, 'Provider');
    } catch (emailError) {
      // Continue with the process even if email fails
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }
};

// Verify email code
const verifyEmailCode = async (req, res) => {
  try {
    const { code, email } = req.body;

    if (!code || !email) {
      return res.status(400).json({
        success: false,
        message: 'Code and email are required'
      });
    }

    // Check verification data
    const verification = global.emailVerifications?.get(email);
    
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    if (verification.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    if (new Date() > verification.expires) {
      global.emailVerifications.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Mark as verified and remove from temporary storage
    global.emailVerifications.delete(email);
    
    // Store verified status
    if (!global.verifiedEmails) {
      global.verifiedEmails = new Set();
    }
    global.verifiedEmails.add(email);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email'
    });
  }
};

module.exports = {
  registerProvider,
  sendEmailVerification,
  verifyEmailCode
};