const express = require('express');
const { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/addressController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user addresses
router.get('/', auth, getUserAddresses);

// Add new address
router.post('/', auth, addAddress);

// Update address
router.put('/:addressId', auth, updateAddress);

// Delete address
router.delete('/:addressId', auth, deleteAddress);

// Set default address
router.patch('/:addressId/default', auth, setDefaultAddress);

module.exports = router;