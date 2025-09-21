const BookingIntent = require('../models/BookingIntent');
const Ticket = require('../models/Ticket');

// Update existing BookingIntent records with ticketId references
const updateBookingIntentsWithTicketIds = async () => {
  try {
    
    // Find all PAID booking intents without ticketId
    const bookingIntents = await BookingIntent.find({ 
      status: 'PAID',
      ticketId: null 
    });
    
    let updatedCount = 0;
    
    for (const booking of bookingIntents) {
      // Find corresponding ticket
      const ticket = await Ticket.findOne({ orderId: booking.orderId });
      
      if (ticket) {
        // Update booking intent with ticket reference
        await BookingIntent.findByIdAndUpdate(booking._id, { 
          ticketId: ticket._id 
        });
        updatedCount++;
      }
    }
    return { success: true, updatedCount };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { updateBookingIntentsWithTicketIds };