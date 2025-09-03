const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const BookingIntent = require('../models/BookingIntent');
const verifyToken = require('../middleware/auth');

// Get user's transaction history
router.get('/history', verifyToken, async (req, res) => {
  try {
    // Get all tickets (successful transactions)
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('productId', 'title img1 location')
      .sort({ createdAt: -1 });

    // Get failed booking intents (failed transactions)
    const failedBookings = await BookingIntent.find({ 
      userId: req.user.id, 
      status: 'FAILED' 
    })
      .populate('productId', 'title img1 location')
      .sort({ createdAt: -1 });

    // Format transactions
    const transactions = [
      // Successful bookings
      ...tickets.map(ticket => ({
        id: ticket.orderId,
        title: ticket.productId?.title || 'Experience Booking',
        type: 'booking',
        status: ticket.paymentStatus === 'PAID' ? 'completed' : 'pending',
        amount: ticket.totalPrice,
        basePrice: ticket.totalPrice - ticket.gst - (ticket.discount || 0),
        gst: ticket.gst,
        discount: ticket.discount || 0,
        participants: ticket.participants,
        date: ticket.createdAt,
        method: 'Cashfree',
        paymentId: ticket.paymentId,
        ticketNumber: ticket.ticketNumber,
        productImage: ticket.productId?.img1,
        location: ticket.productId?.location
      })),
      
      // Failed transactions
      ...failedBookings.map(booking => ({
        id: booking.orderId,
        title: booking.productId?.title || 'Experience Booking',
        type: 'booking',
        status: 'failed',
        amount: booking.totalPrice,
        basePrice: booking.totalPrice - booking.gst - (booking.discount || 0),
        gst: booking.gst,
        discount: booking.discount || 0,
        participants: booking.participants,
        date: booking.createdAt,
        method: 'Cashfree',
        paymentId: null,
        ticketNumber: null,
        productImage: booking.productId?.img1,
        location: booking.productId?.location
      }))
    ];

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      totalSpent: transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      totalFailed: transactions
        .filter(t => t.status === 'failed')
        .reduce((sum, t) => sum + t.amount, 0),
      pendingCount: transactions.filter(t => t.status === 'pending').length,
      thisMonthCount: transactions.filter(t => 
        new Date(t.date).getMonth() === new Date().getMonth() &&
        new Date(t.date).getFullYear() === new Date().getFullYear()
      ).length
    };

    res.json({ 
      success: true, 
      transactions,
      stats
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific transaction details
router.get('/:transactionId', verifyToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Try to find in tickets first
    let transaction = await Ticket.findOne({ 
      orderId: transactionId, 
      userId: req.user.id 
    }).populate('productId', 'title img1 location');
    
    if (transaction) {
      const details = {
        id: transaction.orderId,
        title: transaction.productId?.title || 'Experience Booking',
        type: 'booking',
        status: transaction.paymentStatus === 'PAID' ? 'completed' : 'pending',
        amount: transaction.totalPrice,
        basePrice: transaction.totalPrice - transaction.gst - (transaction.discount || 0),
        gst: transaction.gst,
        discount: transaction.discount || 0,
        participants: transaction.participants,
        selectedDate: transaction.selectedDate,
        date: transaction.createdAt,
        method: 'Cashfree',
        paymentId: transaction.paymentId,
        ticketNumber: transaction.ticketNumber,
        productImage: transaction.productId?.img1,
        location: transaction.productId?.location
      };
      
      return res.json({ success: true, transaction: details });
    }
    
    // Try to find in booking intents
    transaction = await BookingIntent.findOne({ 
      orderId: transactionId, 
      userId: req.user.id 
    }).populate('productId', 'title img1 location');
    
    if (transaction) {
      const details = {
        id: transaction.orderId,
        title: transaction.productId?.title || 'Experience Booking',
        type: 'booking',
        status: transaction.status === 'FAILED' ? 'failed' : 'pending',
        amount: transaction.totalPrice,
        basePrice: transaction.totalPrice - transaction.gst - (transaction.discount || 0),
        gst: transaction.gst,
        discount: transaction.discount || 0,
        participants: transaction.participants,
        selectedDate: transaction.selectedDate,
        date: transaction.createdAt,
        method: 'Cashfree',
        paymentId: null,
        ticketNumber: null,
        productImage: transaction.productId?.img1,
        location: transaction.productId?.location
      };
      
      return res.json({ success: true, transaction: details });
    }
    
    res.status(404).json({ success: false, message: 'Transaction not found' });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;