const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const verifyToken = require('../middleware/auth');
const crypto = require('crypto');
const axios = require('axios');

// Create payment session
router.post('/create-payment-session', verifyToken, async (req, res) => {
  const { amount } = req.body;
  
  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orderId = `order_${Date.now()}`;
    const requestData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.name || 'Unnamed Customer',
        customer_email: user.email,
        customer_phone: user.phone || '0000000000',
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ticket/${user._id}?order_id={order_id}`
      }
    };

    // Cashfree API call
    const cashfreeResponse = await axios.post(
      `https://sandbox.cashfree.com/pg/orders`,
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify payment and create ticket
router.post('/verify-payment', verifyToken, async (req, res) => {
  const { order_id } = req.body;
  
  try {
    if (!order_id) {
      return res.status(400).json({ message: 'Missing order ID' });
    }

    // Verify payment with Cashfree
    const verifyResponse = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${order_id}`,
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
    
    // If payment is successful, create ticket
    if (orderData.order_status === 'PAID') {
      // Get booking data from localStorage (passed from frontend)
      const bookingData = req.body.bookingData;
      
      if (bookingData) {
        const ticketNumber = `WC${Date.now().toString().slice(-8)}`;
        
        const ticket = new Ticket({
          ticketNumber,
          userId: req.user.id,
          productId: bookingData.productId,
          orderId: order_id,
          paymentId: orderData.cf_order_id,
          title: bookingData.title,
          city: bookingData.city,
          state: bookingData.state,
          selectedDate: new Date(bookingData.selectedDate),
          participants: bookingData.participants,
          guestInfo: bookingData.guestInfo,
          totalPrice: bookingData.totalPrice,
          gst: bookingData.gst,
          discount: bookingData.discount || 0
        });
        
        await ticket.save();
        
        return res.status(200).json({
          message: 'Payment verified and ticket created successfully',
          status: orderData.order_status,
          paymentId: orderData.cf_order_id,
          ticket: ticket
        });
      }
    }
    
    res.status(200).json({
      message: 'Payment verified successfully',
      status: orderData.order_status,
      paymentId: orderData.cf_order_id,
      orderData
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error during payment verification', 
      error: err.message 
    });
  }
});

// Create booking/ticket after payment verification
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const bookingData = req.body;
    const ticketNumber = `WC${Date.now().toString().slice(-8)}`;
    
    const ticket = new Ticket({
      ticketNumber,
      userId: req.user.id,
      productId: bookingData.productId,
      orderId: bookingData.orderId || `order_${Date.now()}`,
      paymentId: bookingData.paymentId,
      title: bookingData.title,
      city: bookingData.city,
      state: bookingData.state,
      selectedDate: new Date(bookingData.selectedDate),
      participants: bookingData.participants,
      guestInfo: bookingData.guestInfo,
      totalPrice: bookingData.totalPrice,
      gst: bookingData.gst,
      discount: bookingData.discount || 0
    });
    
    await ticket.save();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
});

module.exports = router;