import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const ProfilePageLoader = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Sidebar Loader */}
      <Paper sx={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: 280,
        zIndex: 999,
        backgroundColor: 'background.paper',
        borderRadius: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 2
      }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Skeleton variant="text" width={120} height={32} />
        </Box>
        
        {/* Menu Items */}
        <Box sx={{ space: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, borderRadius: 2 }}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                <Skeleton variant="text" width={120} height={20} />
              </Box>
            </motion.div>
          ))}
        </Box>
        
        {/* Logout Button */}
        <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: 2 }} />
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ ml: '280px', p: 4 }}>
        {/* Hero Card Loader */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            mb: 4,
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton 
                      variant="circular" 
                      width={120} 
                      height={120} 
                      sx={{ 
                        mx: 'auto',
                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                      }} 
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Skeleton 
                      variant="text" 
                      width={200} 
                      height={40} 
                      sx={{ 
                        mb: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                      }} 
                    />
                    <Skeleton 
                      variant="text" 
                      width={250} 
                      height={24} 
                      sx={{ 
                        mb: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.15)'
                      }} 
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Skeleton 
                        variant="rounded" 
                        width={120} 
                        height={32} 
                        sx={{ 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.2)'
                        }} 
                      />
                      <Skeleton 
                        variant="rounded" 
                        width={140} 
                        height={32} 
                        sx={{ 
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.2)'
                        }} 
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Skeleton 
                    variant="rounded" 
                    width="100%" 
                    height={48} 
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }} 
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards Loader */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((stat, index) => (
            <Grid item xs={6} md={3} key={stat}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  p: 2
                }}>
                  <Skeleton 
                    variant="circular" 
                    width={40} 
                    height={40} 
                    sx={{ mx: 'auto', mb: 2 }} 
                  />
                  <Skeleton variant="text" width={60} height={32} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width={100} height={16} sx={{ mx: 'auto' }} />
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Address Section Loader */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={180} height={32} />
                </Box>
                <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: 2 }} />
              </Box>

              {/* Address Cards */}
              <Grid container spacing={3}>
                {[1, 2].map((address, index) => (
                  <Grid item xs={12} md={6} key={address}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Paper sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2
                      }}>
                        {/* Chips */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 3 }} />
                          <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 3 }} />
                        </Box>
                        
                        {/* Address Lines */}
                        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="75%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={20} />
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Illustration Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          style={{ textAlign: 'center', marginTop: '2rem' }}
        >
          <Skeleton 
            variant="rounded" 
            width={400} 
            height={300} 
            sx={{ 
              mx: 'auto',
              borderRadius: 3
            }} 
          />
        </motion.div>
      </Box>
    </Box>
  );
};

export default ProfilePageLoader;