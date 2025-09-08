const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const BookingIntent = require('../models/BookingIntent');
const verifyToken = require('../middleware/auth');

// Get user's tickets/bookings with booking intents for completed ones
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('productId', 'title img1 img2 img3 img4 location phone email')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    
    // For completed tickets, also get booking intent data
    const bookingsWithIntents = await Promise.all(
      tickets.map(async (ticket) => {
        if (ticket.status === 'used') {
          const bookingIntent = await BookingIntent.findOne({ orderId: ticket.orderId })
            .populate('productId', 'title img1 img2 img3 img4 location phone email');
          return {
            ...ticket.toObject(),
            bookingIntent: bookingIntent || null
          };
        }
        return ticket.toObject();
      })
    );
    
    res.json({ success: true, tickets: bookingsWithIntents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific ticket
router.get('/:ticketId', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ 
      _id: req.params.ticketId, 
      userId: req.user.id 
    })
    .populate('productId', 'title img1 location phone email')
    .populate('userId', 'name email phone');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ticket by order ID with booking intent fallback
router.get('/by-order/:orderId', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ 
      orderId: req.params.orderId, 
      userId: req.user.id 
    })
    .populate('productId', 'title img1 location phone email')
    .populate('userId', 'name email phone');
    
    if (ticket) {
      return res.json({ success: true, ticket });
    }
    
    // Check booking intent status if no ticket found
    const bookingIntent = await BookingIntent.findOne({ 
      orderId: req.params.orderId, 
      userId: req.user.id 
    });
    
    if (bookingIntent) {
      if (bookingIntent.status === 'FAILED') {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment failed', 
          canRetry: true,
          status: 'FAILED'
        });
      } else if (bookingIntent.status === 'PENDING' || bookingIntent.status === 'PROCESSING') {
        return res.status(202).json({ 
          success: false, 
          message: 'Payment processing', 
          status: bookingIntent.status
        });
      }
    }
    
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found',
      canRetry: true
    });
  } catch (error) {
    console.error('Error fetching ticket by order ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update ticket status (soft cancellation support)
router.patch('/:ticketId/status', verifyToken, async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    
    const updateData = { status };
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = cancelReason || 'User cancelled';
    }
    
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.ticketId, userId: req.user.id },
      updateData,
      { new: true }
    )
    .populate('productId', 'title img1 location phone email')
    .populate('userId', 'name email phone');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;