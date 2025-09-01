const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Test endpoint for webhook
router.get('/cashfree-webhook', (req, res) => {
  res.status(200).json({
    message: 'Cashfree webhook endpoint is active',
    method: 'GET',
    timestamp: new Date().toISOString(),
    endpoint: '/api/webhooks/cashfree-webhook',
    status: 'Ready to receive POST requests'
  });
});

// Test POST endpoint
router.post('/test', (req, res) => {
  res.status(200).json({
    message: 'Test webhook received',
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Health check for webhooks
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Webhook Handler',
    timestamp: new Date().toISOString()
  });
});

// Cashfree webhook handler
router.post('/cashfree-webhook', (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    
    // Parse raw JSON body
    const rawBody = req.body.toString();
    let webhookData;
    
    try {
      webhookData = JSON.parse(rawBody);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    
    // Verify Cashfree webhook signature
    if (process.env.CASHFREE_WEBHOOK_SECRET && signature && timestamp) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
        .update(timestamp + '.' + rawBody)
        .digest('hex');
        
      if (signature !== expectedSignature) {
        return res.status(401).json({ message: 'Unauthorized: Invalid signature' });
      }
    }
    // Extract event type and order data
    const eventType = webhookData.type || webhookData.eventType;
    const orderData = webhookData.data?.order || webhookData.order;
    
    if (!eventType || !orderData) {
      return res.status(400).json({ message: 'Missing required webhook data' });
    }

    console.log('Cashfree webhook received:', eventType, orderData.order_id);

    // Handle payment success
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order_id, payment_id } = orderData;
      
      const ticket = await Ticket.findOne({ orderId: order_id });
      if (ticket) {
        ticket.paymentStatus = 'PAID';
        ticket.paymentId = payment_id;
        await ticket.save();
        console.log(`Payment confirmed for ticket: ${ticket.ticketNumber}`);
      }
    }
    
    // Handle payment failure
    else if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      const { order_id } = orderData;
      
      const ticket = await Ticket.findOne({ orderId: order_id });
      if (ticket) {
        ticket.paymentStatus = 'FAILED';
        await ticket.save();
        console.log(`Payment failed for ticket: ${ticket.ticketNumber}`);
      }
    }

    // Cashfree expects 200 OK response
    res.status(200).json({ 
      message: 'OK',
      status: 'success'
    });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;