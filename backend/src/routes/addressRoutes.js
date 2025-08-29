const express = require('express');
const { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/addressController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get user addresses
router.get('/', protect, getUserAddresses);

// Add new address
router.post('/', protect, addAddress);

// Update address
router.put('/:addressId', protect, updateAddress);

// Delete address
router.delete('/:addressId', protect, deleteAddress);

// Set default address
router.patch('/:addressId/default', protect, setDefaultAddress);

module.exports = router;