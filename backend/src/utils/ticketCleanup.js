const BookingIntent = require('../models/BookingIntent');
const Ticket = require('../models/Ticket');

/**
 * Clean up past tickets that are no longer needed
 * Removes tickets for past experiences that weren't used
 */
const cleanupPastTickets = async () => {
  try {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find all booking intents with past dates
    const pastBookings = await BookingIntent.find({
      selectedDate: { $lt: today },
      status: 'PAID'
    });
    
    let deletedCount = 0;
    
    for (const booking of pastBookings) {
      const ticket = await Ticket.findOne({ orderId: booking.orderId });
      
      if (ticket && ticket.status !== 'used') {
        // Delete the ticket document (not used experiences)
        await Ticket.findByIdAndDelete(ticket._id);
        deletedCount++;

      }
    }
    
    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error in ticket cleanup:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize automatic ticket cleanup using native setTimeout
 * Runs daily at midnight using recursive setTimeout
 */
const initializeTicketCleanup = () => {
  const scheduleNextCleanup = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(async () => {
      await cleanupPastTickets();
      scheduleNextCleanup(); // Schedule next cleanup
    }, msUntilMidnight);
  };
  
  scheduleNextCleanup();
};

module.exports = {
  cleanupPastTickets,
  initializeTicketCleanup
};