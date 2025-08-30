const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  // Set CORS headers for auth responses
  const setCorsHeaders = (res, req) => {
    const origin = req.headers.origin;
    const allowedOrigins = ['https://wandercall.vercel.app', 'http://wandercall.vercel.app', 'http://localhost:5173'];
    
    if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      res.header('Access-Control-Allow-Origin', origin || 'https://wandercall.vercel.app');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
  };

  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      setCorsHeaders(res, req);
      return res.status(401).json({ success: false, message: 'Access denied - No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      setCorsHeaders(res, req);
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {

    setCorsHeaders(res, req);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = auth;