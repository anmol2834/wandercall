import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  Chip, Button, Avatar, LinearProgress, Tab, Tabs, Paper
} from '@mui/material';
import {
  FlightTakeoff, Schedule, LocationOn, Star, 
  CheckCircle, Cancel, Pending, CalendarToday, AccessTime
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const BookingsPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const bookings = [
    {
      id: 1,
      title: 'Himalayan Trek Adventure',
      location: 'Nepal, Everest Base Camp',
      date: '2024-03-15',
      endDate: '2024-03-22',
      status: 'confirmed',
      image: '/api/placeholder/400/250',
      price: '$1,299',
      rating: 4.8,
      duration: '7 days',
      category: 'Adventure'
    },
    {
      id: 2,
      title: 'Safari Experience',
      location: 'Kenya, Maasai Mara',
      date: '2024-04-20',
      endDate: '2024-04-25',
      status: 'pending',
      image: '/api/placeholder/400/250',
      price: '$899',
      rating: 4.6,
      duration: '5 days',
      category: 'Wildlife'
    },
    {
      id: 3,
      title: 'Northern Lights Tour',
      location: 'Iceland, Reykjavik',
      date: '2024-02-10',
      endDate: '2024-02-14',
      status: 'completed',
      image: '/api/placeholder/400/250',
      price: '$1,599',
      rating: 4.9,
      duration: '4 days',
      category: 'Nature'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'completed': return <Star />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return booking.status === 'confirmed' || booking.status === 'pending'; // Upcoming
    if (tabValue === 2) return booking.status === 'completed'; // Completed
    if (tabValue === 3) return booking.status === 'cancelled'; // Cancelled
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  ✈️ My Bookings
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Track and manage your travel experiences
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`${bookings.length} Total Bookings`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  <Chip label={`${bookings.filter(b => b.status === 'confirmed').length} Confirmed`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ textAlign: 'center' }}
                >
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="rgba(255,255,255,0.1)" />
                    <text x="60" y="70" textAnchor="middle" fill="white" fontSize="40">✈️</text>
                  </svg>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.9rem' },
              minWidth: 'auto',
              px: { xs: 1, sm: 2 }
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Upcoming" />
          <Tab label="Done" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      {/* Bookings Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tabValue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={3}>
            {filteredBookings.map((booking, index) => (
              <Grid item xs={12} md={6} lg={4} key={booking.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    height: 420,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Image Section */}
                    <Box sx={{ 
                      height: 180, 
                      background: `linear-gradient(45deg, ${getStatusColor(booking.status)}40, ${getStatusColor(booking.status)}20)`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Typography sx={{ fontSize: '4rem' }}>
                          {booking.category === 'Adventure' ? '🏔️' : 
                           booking.category === 'Wildlife' ? '🦁' : '🌌'}
                        </Typography>
                      </motion.div>
                      
                      <Chip
                        icon={getStatusIcon(booking.status)}
                        label={booking.status.toUpperCase()}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: getStatusColor(booking.status),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        {booking.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {booking.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarToday fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {new Date(booking.date).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccessTime fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {booking.duration}
                        </Typography>
                      </Box>

                      {booking.status === 'completed' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                fontSize="small" 
                                sx={{ 
                                  color: i < Math.floor(booking.rating) ? '#ffd700' : '#e0e0e0',
                                  fontSize: '1rem'
                                }} 
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                            {booking.rating}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: getStatusColor(booking.status), fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                          {booking.price}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          sx={{ 
                            borderRadius: 2,
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            px: 2
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {filteredBookings.length === 0 && (
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center', 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3
            }}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FlightTakeoff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>No bookings found</Typography>
              <Typography variant="body1" color="text.secondary">
                {tabValue === 1 ? 'No upcoming bookings' :
                 tabValue === 2 ? 'No completed bookings' :
                 tabValue === 3 ? 'No cancelled bookings' :
                 'Start your adventure by booking an experience!'}
              </Typography>
            </Paper>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default BookingsPage;