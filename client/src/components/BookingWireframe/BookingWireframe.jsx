import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const BookingWireframe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  const WireframeBox = ({ width, height, delay = 0, borderRadius = 1 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      style={{
        width,
        height,
        borderRadius: theme.spacing(borderRadius),
        background: `linear-gradient(90deg, 
          rgba(255,255,255,0.05) 25%, 
          rgba(255,255,255,0.15) 50%, 
          rgba(255,255,255,0.05) 75%)`,
        backgroundSize: '200% 100%',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
      }}
      {...shimmer}
    />
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 3
    }}>
      {/* Header */}
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            p: 2,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <WireframeBox width={40} height={40} delay={0.1} borderRadius={50} />
            <WireframeBox width={isMobile ? 150 : 200} height={32} delay={0.2} />
            <WireframeBox width={80} height={36} delay={0.3} borderRadius={3} />
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Experience Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <WireframeBox width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} delay={0.5} borderRadius={2} />
                    <Box sx={{ flex: 1 }}>
                      <WireframeBox width="80%" height={24} delay={0.6} />
                      <Box sx={{ mt: 1 }}>
                        <WireframeBox width="60%" height={16} delay={0.7} />
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <WireframeBox width="40%" height={16} delay={0.8} />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[...Array(3)].map((_, i) => (
                      <WireframeBox key={i} width={60} height={24} delay={0.9 + i * 0.1} borderRadius={3} />
                    ))}
                  </Box>
                </Box>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <WireframeBox width="40%" height={24} delay={1.3} />
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <WireframeBox width="100%" height={56} delay={1.4} borderRadius={1} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <WireframeBox width="100%" height={56} delay={1.5} borderRadius={1} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <WireframeBox width="100%" height={56} delay={1.6} borderRadius={1} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <WireframeBox width="100%" height={56} delay={1.7} borderRadius={1} />
                    </Grid>
                    <Grid item xs={12}>
                      <WireframeBox width="100%" height={100} delay={1.8} borderRadius={1} />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>

              {/* Guest Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.9 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <WireframeBox width="50%" height={24} delay={2} />
                  
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[...Array(3)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <WireframeBox width={40} height={40} delay={2.1 + i * 0.1} borderRadius={50} />
                        <Box sx={{ flex: 1 }}>
                          <WireframeBox width="70%" height={16} delay={2.2 + i * 0.1} />
                          <Box sx={{ mt: 0.5 }}>
                            <WireframeBox width="50%" height={12} delay={2.3 + i * 0.1} />
                          </Box>
                        </Box>
                        <WireframeBox width={80} height={32} delay={2.4 + i * 0.1} borderRadius={2} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.7 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <WireframeBox width="40%" height={24} delay={2.8} />
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {[...Array(3)].map((_, i) => (
                      <Grid item xs={12} sm={4} key={i}>
                        <Box sx={{ 
                          p: 2, 
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 1.5,
                          textAlign: 'center'
                        }}>
                          <WireframeBox width={40} height={40} delay={2.9 + i * 0.1} borderRadius={1} />
                          <Box sx={{ mt: 1 }}>
                            <WireframeBox width="80%" height={16} delay={3 + i * 0.1} />
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Booking Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 3.3 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(99,102,241,0.3)',
                  position: 'sticky',
                  top: 20
                }}>
                  <WireframeBox width="60%" height={24} delay={3.4} />
                  
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[...Array(4)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <WireframeBox width="60%" height={16} delay={3.5 + i * 0.1} />
                        <WireframeBox width="25%" height={16} delay={3.6 + i * 0.1} />
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ 
                    mt: 2, 
                    pt: 2, 
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <WireframeBox width="40%" height={20} delay={3.9} />
                    <WireframeBox width="30%" height={24} delay={4} />
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <WireframeBox width="100%" height={48} delay={4.1} borderRadius={3} />
                  </Box>
                </Box>
              </motion.div>

              {/* Policies */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 4.2 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <WireframeBox width="50%" height={20} delay={4.3} />
                  
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[...Array(3)].map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <WireframeBox width={16} height={16} delay={4.4 + i * 0.1} borderRadius={50} />
                        <WireframeBox width="85%" height={14} delay={4.5 + i * 0.1} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 4.8 }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center'
                }}>
                  <WireframeBox width={60} height={60} delay={4.9} borderRadius={50} />
                  <Box sx={{ mt: 2 }}>
                    <WireframeBox width="70%" height={16} delay={5} />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <WireframeBox width="50%" height={12} delay={5.1} />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <WireframeBox width="80%" height={36} delay={5.2} borderRadius={2} />
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingWireframe;