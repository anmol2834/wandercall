const express = require('express');
const router = express.Router();
const BookingIntent = require('../models/BookingIntent');
const Ticket = require('../models/Ticket');
const verifyToken = require('../middleware/auth');

// Get user's bookings from bookingintents collection
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch all booking intents for the user
    const bookingIntents = await BookingIntent.find({ 
      userId,
      status: 'PAID' // Only show successful bookings
    })
    .populate('productId', 'title img1 img2 img3 img4 location phone email')
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });
    
    // Process each booking to determine status and handle ticket cleanup
    const processedBookings = await Promise.all(
      bookingIntents.map(async (booking) => {
        const bookingDate = new Date(booking.selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);
        
        // Check if ticket exists
        let ticket = await Ticket.findOne({ orderId: booking.orderId });
        
        let status = 'active';
        let ticketData = null;
        let ticketId = null;
        
        if (ticket) {
          ticketId = ticket._id;
          
          // If booking date has passed and ticket is not used, delete it
          if (bookingDate < today && ticket.status !== 'used') {
            await Ticket.findByIdAndDelete(ticket._id);
            ticket = null; // Set to null after deletion
            status = 'expired';
          } else {
            status = ticket.status;
            ticketData = {
              _id: ticket._id,
              ticketNumber: ticket.ticketNumber,
              paymentId: ticket.paymentId,
              status: ticket.status
            };
          }
        } else if (bookingDate < today) {
          // If no ticket and date has passed, mark as expired
          status = 'expired';
        }
        
        return {
          _id: booking._id,
          orderId: booking.orderId,
          userId: booking.userId,
          productId: booking.productId,
          selectedDate: booking.selectedDate,
          participants: booking.participants,
          totalPrice: booking.totalPrice,
          gst: booking.gst,
          discount: booking.discount,
          status,
          ticketNumber: ticketData?.ticketNumber || `BI-${booking._id.toString().slice(-6)}`,
          paymentId: ticketData?.paymentId || 'PROCESSED',
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          // Include ticket reference if exists
          ticketId: ticketId
        };
      })
    );
    
    res.json({ 
      success: true, 
      bookings: processedBookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;