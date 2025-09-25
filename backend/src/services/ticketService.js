const crypto = require('crypto');
const Ticket = require('../models/Ticket');
const BookingIntent = require('../models/BookingIntent');
const Product = require('../models/Product');
const { sendBookingNotificationToProvider } = require('./emailService');

// Generate cryptographically secure unique order ID
const generateOrderId = (userId) => {
  const timestamp = Date.now();
  const userSuffix = userId.toString().slice(-6);
  const randomBytes = crypto.randomBytes(4).toString('hex');
  return `order_${userSuffix}_${timestamp}_${randomBytes}`;
};

// Centralized idempotent ticket creation with atomic operations
const createTicketFromPayment = async (orderId, paymentId = null) => {
  try {
    // Atomic check and update booking intent status first
    const bookingIntent = await BookingIntent.findOneAndUpdate(
      { orderId, status: 'PENDING' },
      { status: 'PROCESSING' },
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('productId', 'title location phone email openTime closeTime');

    if (!bookingIntent) {
      const existingTicket = await Ticket.findOne({ orderId });
      if (existingTicket) {
        return { success: true, ticket: existingTicket, created: false };
      }
      
      return { success: false, error: 'Booking intent not found or already processed' };
    }

    // Create ticket
    const ticketNumber = `WC${Date.now().toString().slice(-8)}`;
    
    const ticket = new Ticket({
      ticketNumber,
      userId: bookingIntent.userId._id,
      productId: bookingIntent.productId._id,
      orderId,
      paymentId: paymentId || `payment_${Date.now()}`,
      selectedDate: bookingIntent.selectedDate,
      participants: bookingIntent.participants,
      openTime: bookingIntent.productId.openTime,
      closeTime: bookingIntent.productId.closeTime,
      totalPrice: bookingIntent.totalPrice,
      gst: bookingIntent.gst,
      discount: bookingIntent.discount,
      paymentStatus: 'PAID'
    });

    await ticket.save();

    // Mark as PAID and set ticket reference
    await BookingIntent.findByIdAndUpdate(bookingIntent._id, { 
      status: 'PAID',
      ticketId: ticket._id 
    });

    // Send email notification to provider
    try {
      const product = await Product.findById(bookingIntent.productId._id);
      if (product && product.email) {
        const emailData = {
          ticketNumber,
          title: product.title,
          userName: bookingIntent.userId.name,
          userEmail: bookingIntent.userId.email,
          userPhone: bookingIntent.userId.phone,
          selectedDate: bookingIntent.selectedDate,
          participants: bookingIntent.participants,
          totalPrice: bookingIntent.totalPrice
        };
        
        await sendBookingNotificationToProvider(product.email, emailData);
      }
    } catch (emailError) {
      console.error('Failed to send provider notification:', emailError);
    }

    return { success: true, ticket, created: true };

  } catch (error) {
    await BookingIntent.findOneAndUpdate(
      { orderId, status: 'PROCESSING' },
      { status: 'PENDING' }
    ).catch(() => {});
    
    if (error.code === 11000) {
      const existingTicket = await Ticket.findOne({ orderId });
      if (existingTicket) {
        return { success: true, ticket: existingTicket, created: false };
      }
    }
    
    return { success: false, error: error.message };
  }
};

// Mark booking intent as failed
const markPaymentFailed = async (orderId) => {
  try {
    await BookingIntent.findOneAndUpdate(
      { orderId, status: { $in: ['PENDING', 'PROCESSING'] } },
      { status: 'FAILED' }
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOrderId,
  createTicketFromPayment,
  markPaymentFailed
};