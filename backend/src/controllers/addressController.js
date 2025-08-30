const User = require('../models/User');

// Get user addresses
const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.addresses) {
      user.addresses = [];
      await user.save();
    }
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    
    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ success: false, message: 'All address fields are required' });
    }

    const user = await User.findById(req.user._id);
    
    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // Check address limit
    if (user.addresses.length >= 2) {
      return res.status(400).json({ success: false, message: 'Maximum 2 addresses allowed' });
    }
    
    // If this is set as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    // If this is the first address, make it default
    const newAddress = {
      type: type || 'Home',
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0
    };
    
    user.addresses.push(newAddress);
    await user.save();
    
    res.json({ success: true, user, message: 'Address added successfully' });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    
    // If setting as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    // Update address fields
    address.type = type || address.type;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.isDefault = isDefault || address.isDefault;
    
    await user.save();
    
    res.json({ success: true, user, message: 'Address updated successfully' });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    
    const wasDefault = address.isDefault;
    address.remove();
    
    // If deleted address was default, make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.json({ success: true, user, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

// Set default address
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    
    // Unset all defaults and set new default
    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
    
    await user.save();
    
    res.json({ success: true, user, message: 'Default address updated successfully' });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ success: false, message: 'Failed to set default address' });
  }
};

module.exports = {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};