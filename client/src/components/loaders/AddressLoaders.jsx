import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Wireframe loader for address cards
export const AddressCardLoader = () => {
  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header with chips */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 3 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
        
        {/* Address lines */}
        <Skeleton variant="text" width="85%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
        
        {/* Button */}
        <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: 1 }} />
      </CardContent>
    </Card>
  );
};

// Wireframe loader for the entire address page
export const AddressPageLoader = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Skeleton variant="text" width={250} height={48} />
        <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Address cards grid */}
      <Grid container spacing={3}>
        {[1, 2].map((index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <AddressCardLoader />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Loading overlay for set default action
export const SetDefaultLoader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 4,
          minWidth: 300,
          textAlign: 'center'
        }}>
          <Box sx={{ mb: 3 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block' }}
            >
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '3px solid rgba(99, 102, 241, 0.3)',
                borderTop: '3px solid #6366f1',
                margin: '0 auto'
              }} />
            </motion.div>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Updating Default Address
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we update your preferences...
          </Typography>
        </Card>
      </motion.div>
    </motion.div>
  );
};