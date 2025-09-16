const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  provider_Name: {
    type: String,
    required: true
  },
  company_Name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closeTime: {
    type: String,
    required: true
  },
  whatsIncluded: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  description: {
    type: String,
    required: true
  },
  img1: {
    type: String,
    required: true
  },
  img2: String,
  img3: String,
  img4: String,
  location: {
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    mapLink: String,
    pincode: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  
  // Provider reference
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);