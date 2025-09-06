const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const BookingIntent = require('../models/BookingIntent');
const Product = require('../models/Product');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const axios = require('axios');
const { sendCancellationNotificationToProvider } = require('../services/emailService');

// Cancel booking within 48 hours
router.post('/cancel/:ticketId', verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    // Find the ticket
    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if cancellation is within 48 hours
    const bookingTime = new Date(ticket.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - bookingTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 48) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cancellation is only allowed within 48 hours of booking' 
      });
    }

    // Process refund through Cashfree
    let refundResult = null;
    if (ticket.paymentId && ticket.paymentStatus === 'PAID') {
      try {
        const cashfreeBaseUrl = process.env.CASHFREE_MODE === 'production' 
          ? 'https://api.cashfree.com/pg/orders'
          : 'https://sandbox.cashfree.com/pg/orders';

        // Generate short refund ID (max 40 chars)
        const shortRefundId = `rf_${ticket.orderId.slice(-10)}_${Date.now().toString().slice(-8)}`;
        
        const refundRequest = {
          refund_amount: ticket.totalPrice,
          refund_id: shortRefundId,
          refund_note: 'Booking cancelled by user within 48 hours'
        };

        refundResult = await axios.post(
          `${cashfreeBaseUrl}/${ticket.orderId}/refunds`,
          refundRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-client-id': process.env.CF_CLIENT_ID,
              'x-client-secret': process.env.CF_CLIENT_SECRET,
              'x-api-version': '2023-08-01'
            }
          }
        );


      } catch (refundError) {
        console.error('Cashfree refund error:', refundError.response?.data || refundError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to process refund. Please contact support.'
        });
      }
    }

    // Send cancellation email to provider before deletion
    try {
      const [product, user] = await Promise.all([
        Product.findById(ticket.productId),
        User.findById(ticket.userId)
      ]);
      
      if (product && product.email && user) {
        const emailData = {
          ticketNumber: ticket.ticketNumber,
          title: product.title,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          selectedDate: ticket.selectedDate,
          participants: ticket.participants,
          totalPrice: ticket.totalPrice
        };
        
        await sendCancellationNotificationToProvider(product.email, emailData);
      }
    } catch (emailError) {
      console.error('Failed to send cancellation notification:', emailError);
    }

    // Delete from both collections
    await Promise.all([
      Ticket.findByIdAndDelete(ticketId),
      BookingIntent.findOneAndDelete({ orderId: ticket.orderId })
    ]);

    res.json({ 
      success: true, 
      message: 'Booking cancelled and refund initiated successfully',
      refundId: refundResult?.data?.refund_id || null
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if cancellation is allowed
router.get('/check/:ticketId', verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const bookingTime = new Date(ticket.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - bookingTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    const canCancel = hoursDifference <= 48;
    const hoursLeft = canCancel ? Math.max(0, 48 - hoursDifference) : 0;

    res.json({ 
      success: true, 
      canCancel,
      hoursLeft: Math.round(hoursLeft * 10) / 10
    });
  } catch (error) {
    console.error('Error checking cancellation eligibility:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;