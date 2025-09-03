const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BookingIntent = require('../models/BookingIntent');
const verifyToken = require('../middleware/auth');
const axios = require('axios');
const Ticket = require('../models/Ticket');
const { generateOrderId, createTicketFromPayment } = require('../services/ticketService');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes working', timestamp: new Date().toISOString() });
});

// Create payment session
router.post('/create-payment-session', verifyToken, async (req, res) => {
  try {
    const { bookingData } = req.body;
    
    if (!bookingData || !bookingData.totalPrice) {
      return res.status(400).json({ message: 'Invalid booking data' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orderId = generateOrderId(user._id);
    
    // Create booking intent
    const bookingIntent = new BookingIntent({
      orderId,
      userId: user._id,
      productId: bookingData.productId,
      selectedDate: new Date(bookingData.selectedDate),
      participants: bookingData.participants,
      totalPrice: bookingData.totalPrice,
      gst: bookingData.gst,
      discount: bookingData.discount || 0,
      status: 'PENDING'
    });
    
    await bookingIntent.save();

    // Create Cashfree payment session
    const requestData = {
      order_id: orderId,
      order_amount: bookingData.totalPrice,
      order_currency: 'INR',
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.name || 'Customer',
        customer_email: user.email,
        customer_phone: user.phone || '0000000000',
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://www.wandercall.com'}/ticket/${bookingData.productId}?order_id=${orderId}`
      }
    };

    const cashfreeBaseUrl = process.env.CASHFREE_MODE === 'production' 
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';
      
    const cashfreeResponse = await axios.post(
      cashfreeBaseUrl,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_CLIENT_ID,
          'x-client-secret': process.env.CF_CLIENT_SECRET,
          'x-api-version': '2023-08-01'
        }
      }
    );

    res.status(200).json({
      payment_session_id: cashfreeResponse.data.payment_session_id,
      order_id: orderId,
    });
  } catch (err) {
    console.error('Payment session creation failed:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify payment and trigger ticket creation if successful
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { order_id } = req.body;
    
    if (!order_id) {
      return res.status(400).json({ message: 'Missing order ID' });
    }

    const cashfreeBaseUrl = process.env.CASHFREE_MODE === 'production' 
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';
      
    const verifyResponse = await axios.get(
      `${cashfreeBaseUrl}/${order_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_CLIENT_ID,
          'x-client-secret': process.env.CF_CLIENT_SECRET,
          'x-api-version': '2023-08-01'
        }
      }
    );

    const orderData = verifyResponse.data;
    
    // Only trigger ticket creation if webhook hasn't processed it yet
    if (orderData.order_status === 'PAID') {
      const existingTicket = await Ticket.findOne({ orderId: order_id });
      
      if (!existingTicket) {
        const ticketResult = await createTicketFromPayment(
          order_id, 
          orderData.cf_order_id || orderData.payment_id
        );
        
        // Ticket creation handled by service
      }
    }
    
    res.status(200).json({
      message: 'Payment status retrieved',
      status: orderData.order_status,
      paymentId: orderData.cf_order_id,
      orderData
    });
  } catch (err) {
    console.error('Payment verification failed:', err.message);
    res.status(500).json({ 
      message: 'Server error during payment verification', 
      error: err.message 
    });
  }
});

module.exports = router;