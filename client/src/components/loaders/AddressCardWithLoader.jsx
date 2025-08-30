import React from 'react';
import { Box, Card, CardContent, IconButton, Chip, Typography, Button } from '@mui/material';
import { Edit, Delete, Home, Work } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AddressCardWithLoader = ({ 
  address, 
  index, 
  onEdit, 
  onDelete, 
  onSetDefault, 
  isLoading = false,
  operationType = null // 'delete', 'setDefault', 'edit'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
    >
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: address.isDefault ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        {/* Loading overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', marginBottom: 8 }}
              >
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  borderTop: '2px solid #6366f1'
                }} />
              </motion.div>
              <Typography variant="caption" sx={{ display: 'block', color: 'white', fontWeight: 500 }}>
                {operationType === 'delete' && 'Deleting...'}
                {operationType === 'setDefault' && 'Setting as default...'}
                {operationType === 'edit' && 'Updating...'}
                {!operationType && 'Processing...'}
              </Typography>
            </Box>
          </motion.div>
        )}

        <CardContent sx={{ 
          p: 3, 
          opacity: isLoading ? 0.6 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                icon={address.type === 'Home' ? <Home /> : <Work />}
                label={address.type} 
                size="small" 
                color={address.type === 'Home' ? 'primary' : 'secondary'} 
              />
              {address.isDefault && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Chip label="Default" size="small" color="success" />
                </motion.div>
              )}
            </Box>
            <Box>
              <IconButton 
                size="small" 
                onClick={() => onEdit(address)}
                disabled={isLoading}
                sx={{ 
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDelete(address._id)} 
                color="error"
                disabled={isLoading}
                sx={{ 
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {address.street}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {address.city}, {address.state} {address.zipCode}<br />
            {address.country}
          </Typography>
          
          {!address.isDefault && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onSetDefault(address._id)}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(99, 102, 241, 0.3)'
                }
              }}
            >
              Set as Default
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddressCardWithLoader;