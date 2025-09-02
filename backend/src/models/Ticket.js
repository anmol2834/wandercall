const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: String, required: true, unique: true, index: true },
  paymentId: { type: String, required: true },
  
  // Booking Details
  selectedDate: { type: Date, required: true },
  participants: { type: Number, required: true },
  
  // Pricing
  totalPrice: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  
  // Status (soft deletion support)
  status: { type: String, enum: ['active', 'used', 'cancelled'], default: 'active' },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  
  // Audit fields
  cancelledAt: { type: Date },
  cancelReason: { type: String }
}, { 
  timestamps: true,
  // Never auto-delete tickets - keep for audit trail
  collection: 'tickets'
});

module.exports = mongoose.model('Ticket', ticketSchema);