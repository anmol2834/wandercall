const BookingIntent = require('../models/BookingIntent');

// Manual cleanup function for pending bookings older than 20 minutes
const cleanupExpiredBookings = async () => {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
    
    await BookingIntent.deleteMany({
      status: 'PENDING',
      createdAt: { $lt: twentyMinutesAgo }
    });
  } catch (error) {
    console.error('Error cleaning up expired bookings:', error);
  }
};

const startBookingCleanup = () => {
  setInterval(cleanupExpiredBookings, 10 * 60 * 1000);
};

module.exports = { cleanupExpiredBookings, startBookingCleanup };