const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BookingIntent = require('../models/BookingIntent');
const Ticket = require('../models/Ticket');
const { sendEmail } = require('../services/emailService');

// Test route to check if refund ticket routes are working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Refund ticket routes are working' });
});

// Create refund ticket
router.post('/create-refund-ticket', auth, async (req, res) => {
  try {
    const { ticketId, upiId } = req.body;
    
    // Simple validation
    if (!ticketId || !upiId) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID and UPI ID are required'
      });
    }

    const userId = req.user._id;

    // Try to find ticket first, then booking intent
    let ticket = await Ticket.findOne({ 
      _id: ticketId, 
      userId: userId,
      status: 'active'
    }).populate('productId');
    
    let bookingIntent;
    
    if (!ticket) {
      // If not found as ticket, try as booking intent
      bookingIntent = await BookingIntent.findOne({ 
        _id: ticketId, 
        userId: userId,
        status: 'PAID'
      });
      
      if (bookingIntent && bookingIntent.ticketId) {
        ticket = await Ticket.findById(bookingIntent.ticketId).populate('productId');
      }
    } else {
      // Find the booking intent using orderId
      bookingIntent = await BookingIntent.findOne({ 
        orderId: ticket.orderId 
      });
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Active ticket not found'
      });
    }

    if (!bookingIntent) {
      return res.status(404).json({
        success: false,
        message: 'Booking intent not found'
      });
    }

    // PRIORITY 1: Update user's UPI ID and delete booking data immediately
    const User = require('../models/User');
    await Promise.all([
      User.findByIdAndUpdate(userId, { upiId: upiId }, { new: true }),
      BookingIntent.deleteOne({ _id: bookingIntent._id }),
      Ticket.deleteOne({ _id: ticket._id })
    ]);

    // PRIORITY 2: Send immediate response to frontend
    res.json({
      success: true,
      message: 'Refund ticket created successfully. Manual refund will be processed within 5-7 business days.',
      refundTicketId: `RT-${Date.now()}`
    });

    // PRIORITY 3: Process emails in background (after response sent)
    setImmediate(async () => {
      try {
        const authorizedEmails = [
          'anmolsinha4321@gmail.com',
          'rishi.sinha0101@gmail.com', 
          'teamwandercall@gmail.com'
        ];

        const refundTicketData = {
          ticketNumber: ticket.ticketNumber,
          orderId: ticket.orderId,
          userEmail: req.user.email,
          userName: req.user.name,
          upiId: upiId,
          productTitle: ticket.productId?.title || 'Experience',
          totalAmount: ticket.totalPrice,
          bookingDate: ticket.createdAt,
          selectedDate: ticket.selectedDate,
          participants: ticket.participants
        };

        // Send email to authorized owners
        for (const email of authorizedEmails) {
          await sendEmail({
            to: email,
            subject: `🎫 Refund Ticket Created - ${ticket.ticketNumber}`,
            template: 'refund-ticket',
            data: refundTicketData
          });
        }

        // Send cancellation email to provider if available
        if (ticket.productId?.email) {
          await sendEmail({
            to: ticket.productId.email,
            subject: `Booking Cancelled - ${ticket.ticketNumber}`,
            template: 'booking-cancelled-provider',
            data: {
              ticketNumber: ticket.ticketNumber,
              productTitle: ticket.productId.title,
              selectedDate: ticket.selectedDate,
              participants: ticket.participants,
              totalAmount: ticket.totalPrice
            }
          });
        }

      } catch (emailError) {
        console.error('Email processing failed:', emailError);
      }
    });

  } catch (error) {
    console.error('Error creating refund ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create refund ticket'
    });
  }
});

module.exports = router;