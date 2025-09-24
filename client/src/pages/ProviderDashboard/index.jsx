import {
  Box, Container, Typography, Button, Card, CardContent, Switch, 
  FormControlLabel, Grid, Avatar, Chip, IconButton, useTheme, useMediaQuery,
  Paper, Divider, LinearProgress, Fab
} from '@mui/material';
import {
  QrCodeScanner, Analytics, Inventory, TrendingUp, People, 
  Schedule, Settings, Notifications, PowerSettingsNew, Dashboard as DashboardIcon,
  Edit, Visibility, Delete, Add, AttachMoney, CalendarToday, Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

const ProviderDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dutyMode, setDutyMode] = useState(true);

  const providerData = {
    name: 'Alex Johnson',
    role: 'Experience Provider',
    experience: '2+ years',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=provider&backgroundColor=b6e3f4'
  };

  const statsData = [
    { title: 'Total Bookings', value: '247', change: '+18%', icon: <People />, color: '#6366f1' },
    { title: 'Tickets Scanned', value: '189', change: '+12%', icon: <QrCodeScanner />, color: '#10b981' },
    { title: 'Monthly Earnings', value: '₹85,420', change: '+25%', icon: <AttachMoney />, color: '#f59e0b' },
    { title: 'Active Products', value: '8', change: '+2', icon: <Inventory />, color: '#ec4899' }
  ];

  const products = [
    { name: 'City Food Tour', bookings: 45, rating: 4.8, status: 'Active' },
    { name: 'Heritage Walk', bookings: 32, rating: 4.9, status: 'Active' },
    { name: 'Cooking Workshop', bookings: 28, rating: 4.7, status: 'Paused' }
  ];

  const quickActions = [
    { title: 'Manage Products', icon: <Inventory />, color: '#6366f1' },
    { title: 'Check Scans', icon: <Analytics />, color: '#10b981' },
    { title: 'View Earnings', icon: <AttachMoney />, color: '#f59e0b' },
    { title: 'Schedule', icon: <CalendarToday />, color: '#ec4899' }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 1, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          py: { xs: 1.5, sm: 3 },
          gap: { xs: 1, sm: 2 }
        }}>
          {/* Provider Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                  <Avatar 
                    src={providerData.avatar}
                    sx={{ width: { xs: 45, sm: 60 }, height: { xs: 45, sm: 60 }, border: '3px solid', borderColor: 'primary.main' }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                      {providerData.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {providerData.role}
                    </Typography>
                    <Chip 
                      label={`${providerData.experience} Experience`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
            {/* Duty Toggle */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card sx={{
                background: dutyMode 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                borderRadius: 3,
                boxShadow: dutyMode ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none'
              }}>
                <CardContent sx={{ p: { xs: '12px !important', sm: '16px !important' } }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dutyMode}
                        onChange={(e) => setDutyMode(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'white'
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'rgba(255,255,255,0.3)'
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <PowerSettingsNew fontSize="small" />
                        <Typography variant="body1" sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '1rem' },
                          color: dutyMode ? 'white' : 'text.primary'
                        }}>
                          {dutyMode ? 'On Duty' : 'Off Duty'}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <ThemeToggle />
          </Box>
        </Box>

        {/* QR Scanner Button - Floating on Mobile */}
        {isMobile && (
          <Fab
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              width: 64,
              height: 64,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #7c3aed 100%)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <QrCodeScanner sx={{ fontSize: 28 }} />
          </Fab>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* QR Scanner Section - Desktop */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          QR Ticket Scanner
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                          Scan customer tickets to verify and validate entries
                        </Typography>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<QrCodeScanner />}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Start Scanning
                        </Button>
                      </Box>
                      <QrCodeScanner sx={{ fontSize: 80, opacity: 0.3 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Analytics Board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 2 }, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Analytics Overview
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {statsData.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card sx={{
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 60,
                          height: 60,
                          background: `${stat.color}15`,
                          borderRadius: '0 0 0 60px'
                        }} />
                        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{
                              p: 1,
                              borderRadius: 2,
                              backgroundColor: `${stat.color}20`,
                              color: stat.color
                            }}>
                              {stat.icon}
                            </Box>
                            <Chip 
                              label={stat.change} 
                              size="small" 
                              sx={{ 
                                backgroundColor: stat.change.includes('+') ? '#10b98120' : '#ef444420',
                                color: stat.change.includes('+') ? '#10b981' : '#ef4444',
                                fontWeight: 600
                              }} 
                            />
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.title}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Product Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card sx={{
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' }, whiteSpace: 'nowrap' }}>
                      Product Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: 2
                      }}
                    >
                      Add Product
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 } }}>
                    {products.map((product, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Paper sx={{
                          p: { xs: 1.5, sm: 2.5 },
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : 'rgba(0, 0, 0, 0.02)'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                mb: { xs: 0.5, sm: 1 },
                                fontSize: { xs: '0.9rem', sm: '1.25rem' },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {product.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                                <Chip 
                                  label={`${product.bookings} bookings`} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: '#6366f120', 
                                    color: '#6366f1',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    height: { xs: 20, sm: 24 }
                                  }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ fontSize: { xs: 14, sm: 16 }, color: '#f59e0b' }} />
                                  <Typography variant="body2" sx={{ 
                                    fontWeight: 600,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}>
                                    {product.rating}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={product.status} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: product.status === 'Active' ? '#10b98120' : '#f59e0b20',
                                    color: product.status === 'Active' ? '#10b981' : '#f59e0b',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    height: { xs: 20, sm: 24 }
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                              <IconButton size="small" sx={{ 
                                color: 'primary.main',
                                p: { xs: 0.5, sm: 1 }
                              }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton size="small" sx={{ 
                                color: 'primary.main',
                                p: { xs: 0.5, sm: 1 }
                              }}>
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton size="small" sx={{ 
                                color: 'error.main',
                                p: { xs: 0.5, sm: 1 }
                              }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card sx={{
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: `${action.color}20`,
                            color: action.color,
                            display: 'inline-flex',
                            mb: 1
                          }}>
                            {action.icon}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {action.title}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Performance Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card sx={{
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Weekly Performance
                  </Typography>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Chart visualization will be implemented here
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProviderDashboard;