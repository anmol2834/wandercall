import React from 'react';
import { Box, Container, Card, CardContent, Grid, Skeleton, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';

const RewardsPageLoader = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Card Loader */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          mb: 3,
          borderRadius: 2
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Skeleton variant="text" width={180} height={36} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 0.5 }} />
                <Skeleton variant="text" width={250} height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', mb: 1.5 }} />
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 3 }} />
                  <Skeleton variant="text" width={60} height={28} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={60} height={60} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Card Loader */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card sx={{ mb: 2, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={16} />
            </Box>
            <Skeleton variant="rounded" width="100%" height={6} sx={{ borderRadius: 3 }} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Loader */}
      <Box sx={{ mb: 2 }}>
        <Tabs value={0} variant="fullWidth">
          <Tab label={<Skeleton variant="text" width={60} />} />
          <Tab label={<Skeleton variant="text" width={70} />} />
          <Tab label={<Skeleton variant="text" width={50} />} />
        </Tabs>
      </Box>

      {/* Content Cards Loader */}
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item, index) => (
          <Grid item xs={12} sm={6} key={item}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="rounded" width={60} height={20} sx={{ borderRadius: 3 }} />
                    </Box>
                    <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 1 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Card Loader */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          mt: 4,
          borderRadius: 3
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Skeleton variant="text" width={300} height={48} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                <Skeleton variant="text" width="90%" height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', mb: 3 }} />
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((feature, idx) => (
                    <Grid item xs={6} sm={3} key={idx}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mx: 'auto', mb: 0.5 }} />
                        <Skeleton variant="text" width="80%" height={16} sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', mx: 'auto' }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton variant="circular" width={120} height={120} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mx: 'auto' }} />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Skeleton variant="rounded" width={200} height={48} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 25, mx: 'auto' }} />
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default RewardsPageLoader;