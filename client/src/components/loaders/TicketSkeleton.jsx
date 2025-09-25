import React from 'react';
import { Box, Container, Paper, Grid, Skeleton, useTheme, useMediaQuery } from '@mui/material';

const TicketSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e0e7ff 75%, #f3f4f6 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg" sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 2, sm: 4 },
        position: 'relative',
        zIndex: 2
      }}>
        {/* Header Actions */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 3, sm: 4 }
        }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rounded" width={120} height={40} />
        </Box>
        
        {/* Main Ticket Card */}
        <Paper sx={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: { xs: 3, sm: 4 },
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 25px 50px rgba(0, 0, 0, 0.5)' 
            : '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.8)',
          position: 'relative'
        }}>
          {/* Premium Header Strip */}
          <Skeleton variant="rectangular" height={8} />
        
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            {/* Success Badge */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, sm: 4 } }}>
              <Skeleton variant="rounded" width={200} height={40} />
            </Box>

            {/* Experience Title */}
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
              <Skeleton variant="text" sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' } }} />
            </Box>

            {/* Ticket Number */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, sm: 4 } }}>
              <Skeleton variant="rounded" width={180} height={50} />
            </Box>

            <Grid container spacing={{ xs: 3, md: 4 }}>
              {/* Left Column - Ticket Details */}
              <Grid item xs={12} md={7}>
                <Box sx={{
                  p: { xs: 0.5, md: 3 },
                  width: { xs: '100%', md: 'auto' },
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 3 }} />
                  
                  <Grid container spacing={{ xs: 1, md: 3 }}>
                    {/* Date & Participants Cards */}
                    {[1, 2, 3, 4].map((item) => (
                      <Grid item xs={6} md={6} key={item}>
                        <Box sx={{ 
                          p: { xs: 0.5, md: 2 }, 
                          borderRadius: 2, 
                          bgcolor: 'background.paper', 
                          border: '1px solid', 
                          borderColor: 'divider',
                          minHeight: { xs: 60, md: 'auto' },
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={12} />
                            <Skeleton variant="text" width="80%" height={16} />
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Guest Information */}
                  <Box sx={{ 
                    mt: { xs: 0.5, md: 3 }, 
                    p: { xs: 0.5, md: 2 }, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper', 
                    border: '1px solid', 
                    borderColor: 'divider',
                    width: '100%'
                  }}>
                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="circular" width={16} height={16} />
                      <Skeleton variant="text" width="60%" height={16} />
                    </Box>
                  </Box>

                  {/* Location Information */}
                  <Box sx={{ 
                    mt: { xs: 0.5, md: 2 }, 
                    p: { xs: 0.5, md: 2 }, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper', 
                    border: '1px solid', 
                    borderColor: 'divider',
                    width: '100%'
                  }}>
                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      <Skeleton variant="circular" width={16} height={16} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="90%" height={16} />
                        <Skeleton variant="text" width="70%" height={14} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="circular" width={16} height={16} />
                      <Skeleton variant="text" width="50%" height={16} />
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column - QR Code & Payment */}
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 3 } }}>
                  {/* QR Code Section */}
                  <Box sx={{
                    p: { xs: 1, md: 3 },
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                  }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 2 }} />
                    <Skeleton variant="circular" width={32} height={32} sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="rectangular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                  </Box>

                  {/* Payment Info */}
                  <Box sx={{
                    p: { xs: 1, md: 3 },
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="30%" sx={{ fontSize: '1.5rem' }} />
                    </Box>
                    <Skeleton variant="rounded" width={80} height={32} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Bottom Premium Strip */}
          <Skeleton variant="rectangular" height={8} />
        </Paper>
      </Container>
    </Box>
  );
};

export default TicketSkeleton;