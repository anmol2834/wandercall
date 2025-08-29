const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({ 
      user: req.user.id, 
      product: productId 
    });
    
    if (existingWishlist) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
    
    const wishlistItem = new Wishlist({
      user: req.user.id,
      product: productId
    });
    
    await wishlistItem.save();
    
    res.status(201).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: productId
    });
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
    }
    
    res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      product: productId
    });
    
    res.json({ success: true, isWishlisted: !!wishlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
};