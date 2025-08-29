const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  
  // Booking Details
  title: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  selectedDate: { type: Date, required: true },
  participants: { type: Number, required: true },
  
  // Guest Information
  guestInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  // Pricing
  totalPrice: { type: Number, required: true },
  gst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  
  // Status
  status: { type: String, enum: ['active', 'used', 'cancelled'], default: 'active' },
  isDownloaded: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);