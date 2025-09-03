const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { createTicketFromPayment, markPaymentFailed } = require('../services/ticketService');
const Ticket = require('../models/Ticket');
const BookingIntent = require('../models/BookingIntent');

// Handle successful refund from Cashfree dashboard
const handleRefundSuccess = async (orderId) => {
  try {

    
    // Find and delete ticket
    const ticket = await Ticket.findOne({ orderId });
    if (ticket) {
      await Promise.all([
        Ticket.findByIdAndDelete(ticket._id),
        BookingIntent.findOneAndDelete({ orderId })
      ]);
      

    } else {

    }
  } catch (error) {

  }
};

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

router.post('/cashfree-webhook', async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.body.toString('utf8');



    // Verify signature
    if (process.env.CF_CLIENT_SECRET && signature && timestamp) {
      const signedPayload = timestamp + rawBody;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CF_CLIENT_SECRET)
        .update(signedPayload)
        .digest('base64');

      if (signature !== expectedSignature) {
        return res.status(401).json({ message: 'Unauthorized: Invalid signature' });
      }
    }

    // Parse payload
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    const eventType = webhookData.type || webhookData.eventType;

    // Handle test payloads from dashboard
    if (eventType === "WEBHOOK" && webhookData.data?.test_object) {
      return res.status(200).send("Test OK");
    }

    // Handle payment events using centralized service
    const orderData = webhookData.data?.order || webhookData.order;

    
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' && orderData) {
      const { order_id } = orderData;
      const payment_id = webhookData.data?.payment?.cf_payment_id || orderData.payment_id || 'unknown';
      
      await createTicketFromPayment(order_id, payment_id);
    } 
    
    else if (eventType === 'PAYMENT_FAILED_WEBHOOK' && orderData) {
      const { order_id } = orderData;
      
      await markPaymentFailed(order_id);
    }
    
    // Handle refund events
    else if (eventType === 'REFUND_STATUS_WEBHOOK') {
      const refundData = webhookData.data?.refund || webhookData.refund;
      
      if (refundData && refundData.refund_status === 'SUCCESS') {
        const { order_id } = refundData;
        
        if (order_id) {

          await handleRefundSuccess(order_id);
        }
      }
    }

    // Final success response
    res.status(200).send("OK");  // ✅ Required for Cashfree
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;