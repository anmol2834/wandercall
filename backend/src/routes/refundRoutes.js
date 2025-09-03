const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const BookingIntent = require('../models/BookingIntent');
const axios = require('axios');

// Handle manual refund from Cashfree dashboard
router.post('/manual-refund', async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    if (!orderId && !paymentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either orderId or paymentId is required' 
      });
    }

    // Find ticket by orderId or paymentId
    let ticket;
    if (orderId) {
      ticket = await Ticket.findOne({ orderId });
    } else if (paymentId) {
      ticket = await Ticket.findOne({ paymentId });
    }

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found for refund processing' 
      });
    }

    // Verify refund status with Cashfree (optional verification)
    let refundVerified = false;
    if (ticket.paymentId) {
      try {
        const cashfreeBaseUrl = process.env.CASHFREE_MODE === 'production' 
          ? 'https://api.cashfree.com/pg/orders'
          : 'https://sandbox.cashfree.com/pg/orders';

        const refundsResponse = await axios.get(
          `${cashfreeBaseUrl}/${ticket.orderId}/refunds`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-client-id': process.env.CF_CLIENT_ID,
              'x-client-secret': process.env.CF_CLIENT_SECRET,
              'x-api-version': '2023-08-01'
            }
          }
        );
        
        // Check if any refund exists for this order
        refundVerified = refundsResponse.data && refundsResponse.data.length > 0;

      } catch (error) {

      }
    }

    // Delete from both collections
    await Promise.all([
      Ticket.findByIdAndDelete(ticket._id),
      BookingIntent.findOneAndDelete({ orderId: ticket.orderId })
    ]);

    res.json({ 
      success: true, 
      message: 'Manual refund processed and booking data cleaned up successfully',
      deletedTicketId: ticket._id,
      deletedOrderId: ticket.orderId,
      refundVerified
    });
  } catch (error) {
    console.error('Error processing manual refund:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;