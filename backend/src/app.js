const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { startRewardExpiryChecker } = require('./utils/rewardExpiry');

// Connect to database
connectDB().catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Start reward expiry checker
try {
  startRewardExpiryChecker();
} catch (err) {
  console.error('Reward expiry checker failed:', err);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow specific origins
  if (!origin || 
      origin === 'https://wandercall.vercel.app' || 
      origin === 'http://wandercall.vercel.app' ||
      origin === 'http://localhost:5173' ||
      origin.includes('vercel.app')) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for debugging production issues
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/waitlist', require('./routes/waitlistRoutes'));
app.use('/api/rewards', require('./routes/rewardsRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/experiences', require('./routes/experienceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api', require('./routes/paymentRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'WanderCall API is running' });
});

// Database test
app.get('/test-db', async (req, res) => {
  try {
    const User = require('./models/User');
    const count = await User.countDocuments();
    res.json({ success: true, userCount: count, dbStatus: 'Connected' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 JWT_EXPIRE: ${process.env.JWT_EXPIRE}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;