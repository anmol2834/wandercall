const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connectionAttempted = false;
  }

  async connect() {
    if (this.connectionAttempted) return;
    this.connectionAttempted = true;
    
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 3000,
          lazyConnect: true
        }
      });

      this.client.on('error', (err) => {
        if (err.code === 'ECONNREFUSED' && !this.isConnected) {
          console.log('⚠️  Redis server not available - running without cache');
        }
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis Client Connected');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('⚠️  Redis server not running - continuing without cache');
      }
      this.isConnected = false;
    }
  }

  async set(key, value, expiration = 3600) {
    if (!this.isConnected) return false;
    try {
      await this.client.setEx(key, expiration, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;