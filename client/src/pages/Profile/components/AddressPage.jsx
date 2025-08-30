import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, Button, 
  TextField, IconButton, Chip, Paper
} from '@mui/material';
import {
  LocationOn, Add, Edit, Delete, Home, Work
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { addressAPI } from '../../../services/api';
import { AddressPageLoader, SetDefaultLoader } from '../../../components/loaders/AddressLoaders';
import AddressCardWithLoader from '../../../components/loaders/AddressCardWithLoader';

const AddressPage = () => {
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [defaultLoading, setDefaultLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setPageLoading(true);
        if (user?.addresses) {
          // Simulate loading time for better UX
          await new Promise(resolve => setTimeout(resolve, 800));
          setAddresses(user.addresses);
        }
      } finally {
        setPageLoading(false);
      }
    };
    
    fetchAddresses();
  }, [user]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [addressId]: 'delete' }));
      const response = await addressAPI.deleteAddress(addressId);
      updateUser(response.data.user);
      setAddresses(response.data.user.addresses || []);
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [addressId]: null }));
    }
  };

  const handleSaveAddress = async () => {
    if (!editingAddress && addresses.length >= 2) {
      alert('Maximum 2 addresses allowed');
      return;
    }
    
    try {
      setLoading(true);
      let response;
      
      if (editingAddress) {
        response = await addressAPI.updateAddress(editingAddress._id, formData);
      } else {
        response = await addressAPI.addAddress(formData);
      }
      
      updateUser(response.data.user);
      setAddresses(response.data.user.addresses || []);
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [addressId]: 'setDefault' }));
      const response = await addressAPI.setDefaultAddress(addressId);
      updateUser(response.data.user);
      setAddresses(response.data.user.addresses || []);
    } catch (error) {
      console.error('Failed to set default address:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [addressId]: null }));
    }
  };

  // Show page loader while fetching addresses
  if (pageLoading) {
    return <AddressPageLoader />;
  }

  return (
    <>
      <SetDefaultLoader isVisible={defaultLoading} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Address Management
        </Typography>
        {!showForm && addresses.length < 2 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddAddress}
            sx={{ borderRadius: 2 }}
          >
            Add Address
          </Button>
        )}
      </Box>

      {/* Address Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                <LocationOn color="primary" />
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Address Type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    SelectProps={{ native: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  >
                    <option value="Home">🏠 Home</option>
                    <option value="Work">🏢 Work</option>
                    <option value="Other">📍 Other</option>
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    placeholder="Enter your street address"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    placeholder="Enter state or province"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    placeholder="Enter ZIP or postal code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelForm}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveAddress}
                  disabled={loading || !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country}
                  sx={{ 
                    borderRadius: 2,
                    minWidth: 140,
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Box sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white'
                        }} />
                      </motion.div>
                      {editingAddress ? 'Updating...' : 'Saving...'}
                    </Box>
                  ) : (
                    editingAddress ? 'Update Address' : 'Save Address'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Existing Addresses */}
      <Grid container spacing={3}>
        {addresses.map((address, index) => (
          <Grid item xs={12} md={6} key={address._id}>
            <AddressCardWithLoader
              address={address}
              index={index}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
              isLoading={!!loadingStates[address._id]}
              operationType={loadingStates[address._id]}
            />
          </Grid>
        ))}
        
        {addresses.length === 0 && !showForm && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center', 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)'
            }}>
              <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>No addresses added yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add your first address to get started
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleAddAddress}>
                Add Address
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      </Container>
    </>
  );
};

export default AddressPage;