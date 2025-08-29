const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { startRewardExpiryChecker } = require('./utils/rewardExpiry');

// Connect to database
connectDB();

// Start reward expiry checker
startRewardExpiryChecker();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://wandercall.vercel.app',
    'http://wandercall.vercel.app',
    'http://wandercall.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (disabled for clean terminal)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`, req.body);
//   next();
// });

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
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
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
  // Server started silently
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;