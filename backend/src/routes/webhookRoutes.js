const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Cashfree webhook handler
router.post('/cashfree-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    
    // Verify webhook signature (recommended for production)
    if (process.env.CASHFREE_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
        .update(timestamp + '.' + req.body)
        .digest('hex');
        
      if (signature !== expectedSignature) {
        console.log('Invalid webhook signature');
        return res.status(400).json({ message: 'Invalid signature' });
      }
    }

    const webhookData = JSON.parse(req.body);
    const { type, data } = webhookData;

    console.log('Webhook received:', type, data);

    // Handle payment success
    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order_id, payment_id, order_amount } = data.order;
      
      // Find and update ticket status
      const ticket = await Ticket.findOne({ orderId: order_id });
      if (ticket) {
        ticket.paymentStatus = 'PAID';
        ticket.paymentId = payment_id;
        await ticket.save();
        
        console.log(`Ticket ${ticket.ticketNumber} payment confirmed via webhook`);
      }
    }
    
    // Handle payment failure
    if (type === 'PAYMENT_FAILED_WEBHOOK') {
      const { order_id } = data.order;
      
      const ticket = await Ticket.findOne({ orderId: order_id });
      if (ticket) {
        ticket.paymentStatus = 'FAILED';
        await ticket.save();
        
        console.log(`Ticket ${ticket.ticketNumber} payment failed via webhook`);
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;