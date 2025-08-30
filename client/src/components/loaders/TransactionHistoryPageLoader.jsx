import React from 'react';
import { Box, Container, Card, CardContent, Grid, Skeleton, Tabs, Tab, Avatar, TextField, InputAdornment, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Download, FilterList } from '@mui/icons-material';

const TransactionHistoryPageLoader = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Card Loader */}
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
                <Skeleton variant="text" width={280} height={48} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 1 }} />
                <Skeleton variant="text" width={350} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Skeleton variant="rounded" width={150} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3 }} />
                  <Skeleton variant="rounded" width={120} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3 }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton variant="circular" width={100} height={100} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mx: 'auto' }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards Loader */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((stat, index) => (
            <Grid item xs={6} md={3} key={stat}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  p: 2
                }}>
                  <Skeleton variant="circular" width={50} height={50} sx={{ mx: 'auto', mb: 1.5 }} />
                  <Skeleton variant="text" width={80} height={32} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width={100} height={20} sx={{ mx: 'auto' }} />
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Search and Filter Loader */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 3
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={300} height={40} sx={{ flex: 1, minWidth: 200, borderRadius: 1 }} />
              <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Loader */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={0} variant="fullWidth">
          <Tab label={<Skeleton variant="text" width={40} />} />
          <Tab label={<Skeleton variant="text" width={70} />} />
          <Tab label={<Skeleton variant="text" width={60} />} />
          <Tab label={<Skeleton variant="text" width={60} />} />
        </Tabs>
      </Box>

      {/* Transaction List Loader */}
      <Card sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 0 }}>
          {[1, 2, 3, 4, 5].map((transaction, index) => (
            <motion.div
              key={transaction}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Box sx={{ 
                p: 3, 
                borderBottom: index < 4 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' 
              }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="circular" width={50} height={50} />
                      <Box>
                        <Skeleton variant="text" width={150} height={24} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width={120} height={16} />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3} md={2}>
                    <Skeleton variant="text" width={80} height={24} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width={60} height={16} />
                  </Grid>
                  
                  <Grid item xs={6} sm={3} md={2}>
                    <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="text" width={80} height={16} />
                      <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 2 }} />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TransactionHistoryPageLoader;