const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const verifyToken = require('../middleware/auth');

// Get user's tickets/bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('productId', 'title img1 location')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific ticket
router.get('/:ticketId', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ 
      _id: req.params.ticketId, 
      userId: req.user.id 
    }).populate('productId', 'title img1 location');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark ticket as downloaded
router.patch('/:ticketId/download', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.ticketId, userId: req.user.id },
      { isDownloaded: true },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;