const Product = require('../models/Product');
const Provider = require('../models/Provider');
const mongoose = require('mongoose');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { query, city, state, minPrice, maxPrice } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.state': { $regex: query, $options: 'i' } }
      ];
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ success: false, message: 'Failed to search products' });
  }
};

// Get provider availability for a product
const getProviderAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    // Find the product with provider
    const product = await Product.findById(id).populate('providerId');
    if (!product || !product.providerId) {
      return res.status(404).json({ success: false, message: 'Product or provider not found' });
    }
    
    const provider = product.providerId;
    const { availableDays, perDaySlot } = provider;
    
    if (!availableDays || availableDays.length === 0) {
      return res.json({ success: true, availability: [] });
    }
    
    // Get date range (next 60 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 60);
    
    // Get booking counts from Ticket collection
    const Ticket = require('../models/Ticket');
    const bookings = await Ticket.aggregate([
      {
        $match: {
          productId: product._id,
          selectedDate: { $gte: today, $lt: endDate },
          status: { $in: ['active', 'used'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$selectedDate" }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Create booking count map
    const bookingCounts = {};
    bookings.forEach(booking => {
      bookingCounts[booking._id] = booking.count;
    });
    
    // Generate availability data for 60 days
    const availability = [];
    for (let d = new Date(today); d < endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Check if day is in provider's available days
      const isProviderDay = availableDays.includes(dayName);
      
      if (isProviderDay) {
        // Get booking count for this date
        const bookingCount = bookingCounts[dateStr] || 0;
        const slotsAvailable = perDaySlot - bookingCount;
        
        availability.push({
          date: dateStr,
          isAvailable: slotsAvailable > 0,
          dayName,
          slotsAvailable: Math.max(0, slotsAvailable),
          totalSlots: perDaySlot
        });
      }
    }
    
    res.json({ 
      success: true, 
      availability
    });
  } catch (error) {
    console.error('Get provider availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch provider availability',
      availability: []
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getProviderAvailability
};