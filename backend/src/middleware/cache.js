const redisClient = require('../config/redis');

// Cache middleware for GET requests
const cache = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET' || !redisClient.isConnected) {
      return next();
    }

    const key = `cache:${req.originalUrl}:${req.user?.id || 'anonymous'}`;
    
    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = function(data) {
        // Cache the response only if Redis is connected
        if (redisClient.isConnected) {
          redisClient.set(key, data, duration);
        }
        
        // Call original json method
        originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Clear cache for specific patterns
const clearCache = async (pattern) => {
  try {
    if (redisClient.isConnected && redisClient.client) {
      const keys = await redisClient.client.keys(pattern);
      if (keys.length > 0) {
        await redisClient.client.del(keys);
      }
    }
  } catch (error) {
    // Silently fail if Redis is not available
  }
};

module.exports = { cache, clearCache };