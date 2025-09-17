const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// Custom key generator for token-based rate limiting
const tokenKeyGenerator = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return `user:${decoded.id}`;
    } catch (error) {
      // If token is invalid, fall back to IP
      return req.ip;
    }
  }
  return req.ip;
};

// Custom error response with modern UI styling
const createRateLimitResponse = (message, retryAfter) => ({
  success: false,
  error: {
    type: 'RATE_LIMIT_EXCEEDED',
    message,
    retryAfter,
    timestamp: new Date().toISOString(),
    code: 429
  },
  meta: {
    hint: 'Please wait before making another request',
    documentation: 'https://wandercall.com/api-docs/rate-limits'
  }
});

// Login rate limiter - 5 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: (req, res) => createRateLimitResponse(
    'Too many login attempts. Please try again in a minute.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many login attempts from this IP. Please try again in a minute.',
      retryAfter
    ));
  }
});

// OTP rate limiter - More lenient for critical email functionality
const otpLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes (reduced window)
  max: 10, // Increased limit for better UX
  message: (req, res) => createRateLimitResponse(
    'Too many OTP requests. Please try again in 2 minutes.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many OTP requests from this IP. Please wait 2 minutes before requesting another OTP.',
      retryAfter
    ));
  }
});

// Profile update rate limiter - 10 requests per hour per user
const profileUpdateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: (req, res) => createRateLimitResponse(
    'Too many profile updates. Please try again in an hour.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: tokenKeyGenerator,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many profile update attempts. Please wait an hour before trying again.',
      retryAfter
    ));
  }
});

// General API rate limiter - 1000 requests per minute per user token (Amazon-like)
const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // Increased for better user experience
  message: (req, res) => createRateLimitResponse(
    'API rate limit exceeded. Please slow down your requests.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: tokenKeyGenerator,
  skip: (req) => {
    // Skip rate limiting for critical operations and read-only operations
    const skipPaths = [
      '/api/products', 
      '/api/wishlist/check', 
      '/api/reviews',
      '/api/auth/send-otp', // Exclude OTP route from general limiter
      '/api/auth/verify-otp', // Exclude OTP verification
      '/api/auth/send-password-reset-otp' // Exclude password reset OTP
    ];
    return skipPaths.some(path => req.path === path) || 
           (skipPaths.some(path => req.path.startsWith(path)) && req.method === 'GET');
  },
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'You have exceeded the API rate limit. Please wait a minute before making more requests.',
      retryAfter
    ));
  }
});

// Password reset rate limiter - 3 requests per 15 minutes per IP
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: (req, res) => createRateLimitResponse(
    'Too many password reset attempts. Please try again in 15 minutes.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many password reset attempts from this IP. Please wait 15 minutes before trying again.',
      retryAfter
    ));
  }
});

// Registration rate limiter - 5 registrations per hour per IP
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: (req, res) => createRateLimitResponse(
    'Too many registration attempts. Please try again in an hour.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many registration attempts from this IP. Please wait an hour before trying again.',
      retryAfter
    ));
  }
});

// Booking rate limiter - 50 bookings per hour per user (increased)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: (req, res) => createRateLimitResponse(
    'Too many booking attempts. Please try again in an hour.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: tokenKeyGenerator,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many booking attempts. Please wait an hour before making more bookings.',
      retryAfter
    ));
  }
});

// Payment verification rate limiter - 10 requests per 5 minutes per user
const paymentVerificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: (req, res) => createRateLimitResponse(
    'Too many payment verification attempts. Please try again in a few minutes.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: tokenKeyGenerator,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many payment verification attempts. Please wait a few minutes before trying again.',
      retryAfter
    ));
  }
});

// Strict rate limiter for sensitive operations - 2 requests per 10 minutes per IP
const strictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2,
  message: (req, res) => createRateLimitResponse(
    'Too many sensitive operation attempts. Please try again in 10 minutes.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many sensitive operation attempts from this IP. Please wait 10 minutes before trying again.',
      retryAfter
    ));
  }
});

// Lenient rate limiter for read operations (browsing)
const readOnlyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2000, // Very high limit for browsing
  message: (req, res) => createRateLimitResponse(
    'Too many requests. Please slow down.',
    Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000)
  ),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: tokenKeyGenerator,
  handler: (req, res) => {
    const retryAfter = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now() / 1000);
    res.status(429).json(createRateLimitResponse(
      'Too many requests. Please wait a moment before continuing.',
      retryAfter
    ));
  }
});

module.exports = {
  loginLimiter,
  otpLimiter,
  profileUpdateLimiter,
  generalApiLimiter,
  readOnlyLimiter,
  passwordResetLimiter,
  registrationLimiter,
  bookingLimiter,
  paymentVerificationLimiter,
  strictLimiter
};