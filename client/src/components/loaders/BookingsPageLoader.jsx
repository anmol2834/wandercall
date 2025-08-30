import React from 'react';
import { Box, Container, Card, CardContent, Grid, Skeleton, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';

const BookingsPageLoader = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Card Loader */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          mb: 4,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Skeleton variant="text" width={200} height={48} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 1 }} />
                <Skeleton variant="text" width={300} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="rounded" width={120} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3 }} />
                  <Skeleton variant="rounded" width={100} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3 }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Loader */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={0} variant="fullWidth">
          <Tab label={<Skeleton variant="text" width={40} />} />
          <Tab label={<Skeleton variant="text" width={60} />} />
          <Tab label={<Skeleton variant="text" width={50} />} />
          <Tab label={<Skeleton variant="text" width={70} />} />
        </Tabs>
      </Box>

      {/* Booking Cards Loader */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <Grid item xs={12} md={6} lg={4} key={item}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                height: 420
              }}>
                <Box sx={{ height: 180, position: 'relative' }}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                  <Skeleton 
                    variant="rounded" 
                    width={80} 
                    height={24} 
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      borderRadius: 3 
                    }} 
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" width="90%" height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="65%" height={20} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Skeleton variant="text" width={80} height={28} />
                    <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookingsPageLoader;