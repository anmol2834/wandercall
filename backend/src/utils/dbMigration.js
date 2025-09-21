const mongoose = require('mongoose');
const { updateBookingIntentsWithTicketIds } = require('./updateBookingIntents');

const cleanupDatabase = async () => {
  try {
    const db = mongoose.connection.db;
    
    const oldIndexes = ['ticketId_1', 'securityCode_1', 'qrCode_1', 'bookingId_1'];
    
    for (const indexName of oldIndexes) {
      try {
        await db.collection('tickets').dropIndex(indexName);
      } catch (error) {
        // Index not found or already dropped
      }
    }
    
    try {
      await db.collection('tickets').createIndex({ orderId: 1 }, { unique: true });
    } catch (error) {
      // Index already exists
    }
    
    try {
      await db.collection('tickets').createIndex({ ticketNumber: 1 }, { unique: true });
    } catch (error) {
      // Index already exists
    }
    
    try {
      await db.collection('bookingintents').createIndex({ orderId: 1 }, { unique: true });
    } catch (error) {
      // Index already exists
    }
    
    // Run BookingIntent ticketId migration
    try {
      await updateBookingIntentsWithTicketIds();
    } catch (error) {
      console.error('BookingIntent migration failed:', error);
    }
    
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
};

module.exports = { cleanupDatabase };