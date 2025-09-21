const mongoose = require('mongoose');

const bookingIntentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  
  // Booking details (needed for ticket creation)
  selectedDate: { type: Date, required: true },
  participants: { type: Number, required: true },
  
  // Pricing
  totalPrice: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  
  // Status
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED'], default: 'PENDING' },
  
  // Ticket reference (will be null after ticket deletion)
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', default: null }
}, { timestamps: true });

// Auto-delete pending bookings after 20 minutes
bookingIntentSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 1200, // 20 minutes
  partialFilterExpression: { status: 'PENDING' }
});

// Archive old PAID/FAILED bookings after 6 months
bookingIntentSchema.index({ createdAt: 1 }, {
  expireAfterSeconds: 15552000, // 6 months
  partialFilterExpression: { status: { $in: ['PAID', 'FAILED'] } }
});

module.exports = mongoose.model('BookingIntent', bookingIntentSchema);