const Product = require('../models/Product');
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
    console.log('Fetching product with ID:', id);
    console.log('ObjectId valid:', mongoose.Types.ObjectId.isValid(id));
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    // Try to find all products first
    const allProducts = await Product.find();
    console.log('Total products in DB:', allProducts.length);
    console.log('All product IDs:', allProducts.map(p => p._id.toString()));
    
    const product = await Product.findById(id);
    console.log('Product found:', product ? 'Yes' : 'No');
    console.log('Searched ID:', id);
    
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

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts
};