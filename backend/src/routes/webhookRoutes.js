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

router.post('/cashfree-webhook', async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.body.toString('utf8');

    console.log("Raw body string:", rawBody);
    console.log("Webhook headers:", req.headers);

    // Verify signature
    if (process.env.CF_CLIENT_SECRET && signature && timestamp) {
      const signedPayload = timestamp + rawBody;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CF_CLIENT_SECRET)
        .update(signedPayload)
        .digest('base64');

      if (signature !== expectedSignature) {
        console.error('❌ Signature mismatch - webhook rejected');
        return res.status(401).json({ message: 'Unauthorized: Invalid signature' });
      }
      console.log('✅ Webhook signature verified successfully');
    }

    // Parse payload
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
    } catch (error) {
      console.error('JSON parse error:', error.message);
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    const eventType = webhookData.type || webhookData.eventType;

    // Handle test payloads from dashboard
    if (eventType === "WEBHOOK" && webhookData.data?.test_object) {
      console.log("📌 Cashfree test webhook received");
      return res.status(200).send("Test OK");  // ✅ Always return 200
    }

    // Handle payment success/failure
    const orderData = webhookData.data?.order || webhookData.order;
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' && orderData) {
      const { order_id, payment_id } = orderData;
      const ticket = await Ticket.findOne({ orderId: order_id });
      if (ticket) {
        ticket.paymentStatus = 'PAID';
        ticket.paymentId = payment_id;
        await ticket.save();
        console.log(`✅ Payment confirmed for ticket: ${ticket.ticketNumber}`);
      }
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' && orderData) {
      const { order_id } = orderData;
      const ticket = await Ticket.findOne({ orderId: order_id });
      if (ticket) {
        ticket.paymentStatus = 'FAILED';
        await ticket.save();
        console.log(`❌ Payment failed for ticket: ${ticket.ticketNumber}`);
      }
    }

    // Final success response
    res.status(200).send("OK");  // ✅ Required for Cashfree
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;