import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  Chip, Button, Tab, Tabs, Paper, CircularProgress
} from '@mui/material';
import {
  Explore, LocationOn, Star, 
  CheckCircle, Cancel, Schedule, CalendarToday, Download
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, markTicketAsDownloaded } from '../../../redux/slices/ticketSlice';
import BookingsPageLoader from '../../../components/loaders/BookingsPageLoader';

const BookingsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const { bookings, loading, error } = useSelector(state => state.tickets);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleDownloadTicket = async (ticketId) => {
    try {
      await dispatch(markTicketAsDownloaded(ticketId));
      alert('Ticket download started!');
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'used': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'used': return <Star />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Confirmed';
      case 'used': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return booking.status === 'active';
    if (tabValue === 2) return booking.status === 'used';
    if (tabValue === 3) return booking.status === 'cancelled';
    return true;
  });

  if (loading) {
    return <BookingsPageLoader />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>Error loading bookings</Typography>
        <Typography variant="body2" color="text.secondary">{error}</Typography>
        <Button onClick={() => dispatch(fetchMyBookings())} sx={{ mt: 2 }}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  🎯 My Bookings
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Track and manage your experiences
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`${bookings.length} Total Bookings`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  <Chip label={`${bookings.filter(b => b.status === 'active').length} Active`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

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
              <Grid item xs={12} md={6} lg={4} key={booking._id}>
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
                    <Box sx={{ 
                      height: 180, 
                      background: `linear-gradient(45deg, ${getStatusColor(booking.status)}40, ${getStatusColor(booking.status)}20)`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography sx={{ fontSize: '4rem' }}>🎫</Typography>
                      
                      <Chip
                        icon={getStatusIcon(booking.status)}
                        label={getStatusLabel(booking.status)}
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
                          {booking.city}, {booking.state}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarToday fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {new Date(booking.selectedDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Participants: {booking.participants}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Ticket: {booking.ticketNumber}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: getStatusColor(booking.status), fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                          ₹{booking.totalPrice.toFixed(2)}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownloadTicket(booking._id)}
                          sx={{ 
                            borderRadius: 2,
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            px: 2
                          }}
                        >
                          Download
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
                <Explore sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
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