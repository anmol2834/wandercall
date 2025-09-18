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
    
    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Find the provider
    let availability = [];
    if (product.providerId) {
      const provider = await Provider.findById(product.providerId);
      if (provider && provider.availableDays) {
        availability = provider.availableDays;
      }
    }
    
    // If no provider or availability found, return empty array (safe fallback)
    res.json({ 
      success: true, 
      availability,
      productId: id
    });
  } catch (error) {
    console.error('Get provider availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch provider availability',
      availability: [] // Safe fallback
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getProviderAvailability
};