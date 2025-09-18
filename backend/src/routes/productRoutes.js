const express = require('express');
const { getAllProducts, getProductById, searchProducts, getProviderAvailability } = require('../controllers/productController');
const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Search products
router.get('/search', searchProducts);

// Get provider availability for a product
router.get('/:id/availability', getProviderAvailability);

// Get product by ID
router.get('/:id', getProductById);

module.exports = router;