const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Remove insecure TLS setting if it exists
delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
const connectDB = require('./config/database');
const { startRewardExpiryChecker } = require('./utils/rewardExpiry');
const { startBookingCleanup } = require('./utils/cleanupBookings');
const { cleanupDatabase } = require('./utils/dbMigration');


// Connect to database
connectDB().then(async () => {
  await cleanupDatabase();
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Start reward expiry checker
try {
  startRewardExpiryChecker();
} catch (err) {
  console.error('Reward expiry checker failed:', err);
}

// Start booking cleanup
try {
  startBookingCleanup();
} catch (err) {
  console.error('Booking cleanup failed:', err);
}



const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    'https://wandercall.com',
    'https://www.wandercall.com',
    'https://wandercall.vercel.app',
    'http://wandercall.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Additional CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://wandercall.vercel.app', 'https://www.wandercall.com', 'http://localhost:5173', 'https://wandercall.com', 'http://localhost:3000'];

  if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
    res.header('Access-Control-Allow-Origin', origin || 'https://wandercall.vercel.app');
  }

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Use raw body parser for webhook route only
app.use('/api/webhooks/cashfree-webhook', express.raw({ type: 'application/json' }));

// Use JSON parser for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
const { generalApiLimiter, readOnlyLimiter } = require('./middleware/rateLimiter');

// Use lenient rate limiter for read operations
app.use('/api/products', readOnlyLimiter);
app.use('/api/wishlist/check', readOnlyLimiter);
app.use('/api/reviews', readOnlyLimiter);

// Mount auth routes BEFORE general API limiter to ensure OTP routes are excluded
app.use('/api/auth', require('./routes/authRoutes'));

// Use general rate limiter for other operations (OTP routes already excluded in skip function)
app.use('/api', generalApiLimiter);

// Other Routes
app.use('/api/waitlist', require('./routes/waitlistRoutes'));
app.use('/api/rewards', require('./routes/rewardsRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/experiences', require('./routes/experienceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/cancellation', require('./routes/cancellationRoutes'));
app.use('/api/refund', require('./routes/refundRoutes'));
app.use('/api/refund-ticket', require('./routes/refundTicketRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/providers', require('./routes/providerRoutes'));



// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'wandercall API is running' });
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

// Global error handler with CORS headers
app.use((err, req, res, next) => {


  // Ensure CORS headers are present even on errors
  const origin = req.headers.origin;
  const allowedOrigins = ['https://wandercall.vercel.app', 'http://wandercall.vercel.app', 'http://localhost:5173'];

  if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
    res.header('Access-Control-Allow-Origin', origin || 'https://wandercall.vercel.app');
  }

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');

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

// Process monitoring
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit on unhandled rejection in development
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown();
  }
});

// Graceful shutdown
const gracefulShutdown = (signal = 'SIGTERM') => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
      }
      console.log('✅ Server shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during shutdown:', err);
      process.exit(0); // Exit gracefully even on error
    }
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.log('⚠️  Forced shutdown after timeout');
    process.exit(0);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;