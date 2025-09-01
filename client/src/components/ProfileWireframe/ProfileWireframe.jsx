import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const ProfileWireframe = () => {
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
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Logo */}
              <WireframeBox width="100%" height={60} delay={0.1} borderRadius={2} />
              
              {/* Menu Items */}
              {[...Array(8)].map((_, i) => (
                <WireframeBox key={i} width="100%" height={48} delay={0.2 + i * 0.1} borderRadius={1.5} />
              ))}
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Header Section */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                {/* Avatar */}
                <WireframeBox width={isMobile ? 120 : 150} height={isMobile ? 120 : 150} delay={0.3} borderRadius={50} />
                
                {/* User Info */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                  <WireframeBox width={isMobile ? 200 : 250} height={32} delay={0.4} />
                  <WireframeBox width={isMobile ? 150 : 180} height={20} delay={0.5} />
                  <WireframeBox width={isMobile ? 120 : 140} height={20} delay={0.6} />
                  
                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <WireframeBox width={100} height={36} delay={0.7} borderRadius={3} />
                    <WireframeBox width={80} height={36} delay={0.8} borderRadius={3} />
                  </Box>
                </Box>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={2}>
                {[...Array(4)].map((_, i) => (
                  <Grid item xs={6} sm={3} key={i}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                    >
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center'
                      }}>
                        <WireframeBox width="60%" height={24} delay={1 + i * 0.1} />
                        <Box sx={{ mt: 1 }}>
                          <WireframeBox width="80%" height={16} delay={1.1 + i * 0.1} />
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Content Sections */}
              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Recent Activity */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.3 }}
                    >
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <WireframeBox width="40%" height={24} delay={1.4} />
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {[...Array(3)].map((_, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <WireframeBox width={40} height={40} delay={1.5 + i * 0.1} borderRadius={50} />
                              <Box sx={{ flex: 1 }}>
                                <WireframeBox width="70%" height={16} delay={1.6 + i * 0.1} />
                                <Box sx={{ mt: 0.5 }}>
                                  <WireframeBox width="50%" height={12} delay={1.7 + i * 0.1} />
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Bookings */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                    >
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <WireframeBox width="35%" height={24} delay={1.9} />
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          {[...Array(2)].map((_, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                              <Box sx={{ 
                                p: 2, 
                                borderRadius: 1.5, 
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)'
                              }}>
                                <WireframeBox width="100%" height={120} delay={2 + i * 0.1} borderRadius={1} />
                                <Box sx={{ mt: 1 }}>
                                  <WireframeBox width="80%" height={16} delay={2.1 + i * 0.1} />
                                </Box>
                                <Box sx={{ mt: 0.5 }}>
                                  <WireframeBox width="60%" height={12} delay={2.2 + i * 0.1} />
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </motion.div>
                  </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 2.3 }}
                    >
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <WireframeBox width="60%" height={20} delay={2.4} />
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {[...Array(4)].map((_, i) => (
                            <WireframeBox key={i} width="100%" height={40} delay={2.5 + i * 0.1} borderRadius={1.5} />
                          ))}
                        </Box>
                      </Box>
                    </motion.div>

                    {/* Rewards */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 2.9 }}
                    >
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <WireframeBox width="50%" height={20} delay={3} />
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <WireframeBox width={80} height={80} delay={3.1} borderRadius={50} />
                          <Box sx={{ mt: 1 }}>
                            <WireframeBox width="70%" height={16} delay={3.2} />
                          </Box>
                          <Box sx={{ mt: 0.5 }}>
                            <WireframeBox width="50%" height={12} delay={3.3} />
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileWireframe;