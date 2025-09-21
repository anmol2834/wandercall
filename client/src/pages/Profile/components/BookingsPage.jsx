import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  Chip, Button, Tab, Tabs, Paper, CircularProgress
} from '@mui/material';
import {
  Explore, LocationOn, Star, 
  CheckCircle, Cancel, Schedule, CalendarToday, Download, Visibility, RateReview, CancelOutlined, AccountBalance, Group
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, markTicketAsDownloaded } from '../../../redux/slices/ticketSlice';
import BookingsPageLoader from '../../../components/loaders/BookingsPageLoader';
import TicketDownloader from '../../../components/PDFTicket/TicketDownloader';
import TicketModal from '../../../components/TicketModal/TicketModal';
import CustomAlert from '../../../components/Alert/CustomAlert';
import ConfirmDialog from '../../../components/Alert/ConfirmDialog';
import RefundModal from '../../../components/RefundModal/RefundModal';
import { cancellationAPI } from '../../../services/cancellationAPI';
import { refundTicketAPI } from '../../../services/refundTicketAPI';

const BookingsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [cancellingTickets, setCancellingTickets] = useState(new Set());
  const [cancellationEligibility, setCancellationEligibility] = useState({});
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'info', title: '', message: '' });
  const [confirmConfig, setConfirmConfig] = useState({ open: false, ticketId: null });
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedRefundTicket, setSelectedRefundTicket] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const { bookings, loading, error } = useSelector(state => state.tickets);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleDownloadTicket = async (ticketId) => {
    try {
      if (!ticketId) {
        console.error('No ticket ID provided');
        return;
      }
      // Mark as downloaded in Redux without affecting the booking data
      await dispatch(markTicketAsDownloaded(ticketId));
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setAlertConfig({
        open: true,
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download ticket. Please try again.'
      });
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedTicket(formatTicketData(booking));
    setTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setTicketModalOpen(false);
    setSelectedTicket(null);
  };

  const handleRefundRequest = (booking) => {
    setSelectedRefundTicket({
      _id: booking._id,
      ticketNumber: booking.ticketNumber,
      productTitle: booking.productId?.title || booking.title,
      totalPrice: booking.totalPrice
    });
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = async (upiId) => {
    try {
      setRefundLoading(true);
      const result = await refundTicketAPI.createRefundTicket(selectedRefundTicket._id, upiId);
      
      if (result.success) {
        // Immediately close modal and show success
        setRefundModalOpen(false);
        setSelectedRefundTicket(null);
        setRefundLoading(false);
        
        // Show success message immediately
        setAlertConfig({
          open: true,
          type: 'success',
          title: 'Refund Request Submitted',
          message: 'Your refund request has been submitted successfully. Manual refund will be processed within 5-7 business days.'
        });
        
        // Refresh bookings list immediately (data already deleted from backend)
        dispatch(fetchMyBookings());
      } else {
        setRefundLoading(false);
        setAlertConfig({
          open: true,
          type: 'error',
          title: 'Refund Request Failed',
          message: result.message || 'Failed to submit refund request'
        });
      }
    } catch (error) {
      console.error('Error submitting refund request:', error);
      setRefundLoading(false);
      setAlertConfig({
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to submit refund request. Please try again.'
      });
    }
  };

  const handleCancelBooking = async (ticketId) => {
    try {
      setCancellingTickets(prev => new Set([...prev, ticketId]));
      const result = await cancellationAPI.cancelBooking(ticketId);
      
      if (result.success) {
        dispatch(fetchMyBookings());
        const message = result.refundId ? 
          'Booking cancelled and refund initiated successfully. Refund will be processed within 5-7 business days.' :
          'Booking cancelled successfully.';
        setAlertConfig({
          open: true,
          type: 'success',
          title: 'Cancellation Successful',
          message
        });
      } else {
        setAlertConfig({
          open: true,
          type: 'error',
          title: 'Cancellation Failed',
          message: result.message || 'Failed to cancel booking'
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setAlertConfig({
        open: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to cancel booking. Please try again.'
      });
    } finally {
      setCancellingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  const checkCancellationEligibility = async (ticketId) => {
    // Skip if already checked or checking
    if (cancellationEligibility[ticketId] || cancellingTickets.has(ticketId)) {
      return;
    }
    
    try {
      const result = await cancellationAPI.checkCancellationEligibility(ticketId);
      setCancellationEligibility(prev => ({
        ...prev,
        [ticketId]: result
      }));
    } catch (error) {
      console.error('Error checking cancellation eligibility:', error);
      // Set a default state to prevent repeated calls
      setCancellationEligibility(prev => ({
        ...prev,
        [ticketId]: { success: false, canCancel: false, hoursLeft: 0 }
      }));
    }
  };

  const isWithin48Hours = (bookingDate) => {
    const now = new Date();
    const booking = new Date(bookingDate);
    const diffInHours = (now - booking) / (1000 * 60 * 60);
    return diffInHours <= 48;
  };

  // Check if booking is in Done section (completed or past date)
  const isBookingInDoneSection = (booking) => {
    const bookingDate = new Date(booking.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    
    return booking.status === 'used' || bookingDate < today;
  };

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      // Only check for active bookings that haven't been checked yet
      const activeBookings = bookings.filter(booking => 
        booking.status === 'active' && !cancellationEligibility[booking._id]
      );
      
      activeBookings.forEach(booking => {
        checkCancellationEligibility(booking._id);
      });
    }
  }, [bookings]);

  const formatTicketData = (booking) => {
    const totalPrice = booking.totalPrice || 0;
    const gst = booking.gst || 0;
    const discount = booking.discount || 0;
    const basePrice = totalPrice - gst - discount;
    const productLocation = booking.productId?.location || {};
    
    return {
      ticketNumber: booking.ticketNumber || 'TKT001',
      title: booking.productId?.title || booking.title || 'Experience',
      userName: booking.guestInfo?.name || booking.userId?.name || 'Guest',
      userEmail: booking.guestInfo?.email || booking.userId?.email || 'guest@example.com',
      userPhone: booking.guestInfo?.phone || booking.userId?.phone || '+91 9999999999',
      selectedDate: booking.selectedDate || new Date().toISOString(),
      participants: booking.participants || 1,
      location: `${productLocation.city || booking.city || 'City'}, ${productLocation.state || booking.state || 'State'}`,
      fullAddress: productLocation.address || `${booking.city || 'City'}, ${booking.state || 'State'}`,
      pincode: productLocation.pincode || '000000',
      providerPhone: booking.productId?.phone || 'N/A',
      totalPrice: totalPrice,
      basePrice: basePrice > 0 ? basePrice : totalPrice,
      gst: gst,
      discount: discount,
      paymentId: booking.paymentId || 'Processing'
    };
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
    if (tabValue === 0) return true; // All bookings
    
    if (tabValue === 1) { // Upcoming - only today and tomorrow
      if (booking.status !== 'active') return false;
      
      const bookingDate = new Date(booking.selectedDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      today.setHours(0, 0, 0, 0);
      tomorrow.setHours(0, 0, 0, 0);
      bookingDate.setHours(0, 0, 0, 0);
      
      return bookingDate >= today && bookingDate <= tomorrow;
    }
    
    if (tabValue === 2) { // Done - completed or past dates
      const bookingDate = new Date(booking.selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      bookingDate.setHours(0, 0, 0, 0);
      
      return booking.status === 'used' || bookingDate < today;
    }
    
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
                    height: 450,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ 
                      height: 200, 
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box
                        component="img"
                        src={booking.productId?.img1 || '/placeholder-image.jpg'}
                        alt={booking.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {/* Location icon with map link */}
                      {booking.productId?.location?.mapLink && (
                        <Box
                          component="a"
                          href={booking.productId.location.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            textDecoration: 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.9)'
                            }
                          }}
                        >
                          <LocationOn fontSize="small" />
                        </Box>
                      )}
                      
                      {/* Only show download for upcoming bookings */}
                      {!isBookingInDoneSection(booking) && (
                        <TicketDownloader
                          ticketData={formatTicketData(booking)}
                          fileName={`wandercall-ticket-${booking.ticketNumber || 'ticket'}.pdf`}
                        >
                          {({ loading, error }) => (
                            <Box
                              onClick={() => !loading && !error && handleDownloadTicket(booking._id)}
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                backgroundColor: loading ? 'rgba(100, 116, 139, 0.7)' : 'rgba(0,0,0,0.7)',
                                borderRadius: '50%',
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: loading || error ? 'default' : 'pointer',
                                '&:hover': {
                                  backgroundColor: loading || error ? 'rgba(100, 116, 139, 0.7)' : 'rgba(0,0,0,0.9)'
                                }
                              }}
                            >
                              {loading ? (
                                <CircularProgress size={16} sx={{ color: 'white' }} />
                              ) : (
                                <Download fontSize="small" />
                              )}
                            </Box>
                          )}
                        </TicketDownloader>
                      )}
                    </Box>

                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 3 }, 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%'
                    }}>
                      {/* Content Section */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: { xs: 1, sm: 1.5 }, 
                            fontSize: { xs: '0.9rem', sm: '1.1rem' },
                            lineHeight: 1.3,
                            minHeight: { xs: '2.2rem', sm: '2.6rem' },
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {booking.productId?.title || booking.title}
                        </Typography>
                        
                        {/* Mobile Compact Layout */}
                        <Box sx={{ 
                          display: { xs: 'block', sm: 'flex' },
                          flexDirection: { sm: 'column' },
                          gap: { xs: 0.5, sm: 0.8 },
                          mb: { xs: 1.5, sm: 2 }
                        }}>
                          {/* Date and Participants in one row on mobile */}
                          <Box sx={{ 
                            display: { xs: 'flex', sm: 'block' },
                            justifyContent: { xs: 'space-between', sm: 'flex-start' },
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            mb: { xs: 0.5, sm: 0 }
                          }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              minWidth: { sm: '120px' }
                            }}>
                              <CalendarToday sx={{ 
                                fontSize: { xs: 14, sm: 18 },
                                minWidth: { sm: '18px' }
                              }} color="primary" />
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}
                              >
                                {new Date(booking.status === 'used' && booking.bookingIntent ? booking.bookingIntent.selectedDate : booking.selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5, 
                              pl: { xs: 0, sm: 0 }, 
                              mt: { xs: 0, sm: 0.5 },
                              minWidth: { sm: '120px' }
                            }}>
                              <Group sx={{ 
                                fontSize: { xs: 14, sm: 18 },
                                minWidth: { sm: '18px' }
                              }} color="primary" />
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}
                              >
                                {booking.status === 'used' && booking.bookingIntent ? booking.bookingIntent.participants : booking.participants} people
                              </Typography>
                            </Box>
                          </Box>

                          {booking.status !== 'used' && (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5, 
                              pl: { xs: 0, sm: 0 }, 
                              justifyContent: { xs: 'center', sm: 'flex-start' },
                              minWidth: { sm: '120px' }
                            }}>
                              <CheckCircle sx={{ 
                                fontSize: { xs: 14, sm: 18 },
                                minWidth: { sm: '18px' }
                              }} color="primary" />
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}
                              >
                                #{booking.ticketNumber}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Price and Actions Section */}
                      <Box sx={{ 
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        pt: { xs: 1.5, sm: 2 },
                        mt: 'auto'
                      }}>
                        {/* Price */}
                        <Box sx={{ 
                          mb: { xs: 1.5, sm: 2 },
                          textAlign: 'center'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: getStatusColor(booking.status), 
                              fontSize: { xs: '1rem', sm: '1.1rem' }
                            }}
                          >
                            ₹{((booking.status === 'used' && booking.bookingIntent ? booking.bookingIntent.totalPrice : booking.totalPrice) || 0).toFixed(2)}
                          </Typography>
                        </Box>
                        
                        {/* Action Buttons - All Devices */}
                        <Box sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 0.8, sm: 0.6 },
                          justifyContent: 'center',
                          alignItems: 'stretch'
                        }}>
                          {isBookingInDoneSection(booking) ? (
                            // Done section - show Review or Not Attended
                            booking.status === 'used' ? (
                              <Button 
                                variant="outlined" 
                                size="small"
                                startIcon={<RateReview />}
                                sx={{ 
                                  borderRadius: 2,
                                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                  px: { xs: 2, sm: 1.5 },
                                  py: { xs: 1, sm: 0.8 },
                                  minWidth: { xs: 'auto', sm: 90 },
                                  flex: { xs: 1, sm: 'none' }
                                }}
                              >
                                Review
                              </Button>
                            ) : (
                              <Chip 
                                label="Not Attended" 
                                color="warning"
                                variant="outlined"
                                sx={{ 
                                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                  fontWeight: 600
                                }}
                              />
                            )
                          ) : (
                            // Upcoming section - show View and Refund buttons
                            <>
                              <Button 
                                variant="outlined" 
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => handleViewTicket(booking)}
                                sx={{ 
                                  borderRadius: 2,
                                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                  px: { xs: 2, sm: 1.5 },
                                  py: { xs: 1, sm: 0.8 },
                                  minWidth: { xs: 'auto', sm: 80 },
                                  flex: { xs: 1, sm: 'none' }
                                }}
                              >
                                View
                              </Button>

                              {booking.status === 'active' && isWithin48Hours(booking.createdAt) && (
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  color="warning"
                                  startIcon={<AccountBalance />}
                                  onClick={() => handleRefundRequest(booking)}
                                  sx={{ 
                                    borderRadius: 2,
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    px: { xs: 2, sm: 1.5 },
                                    py: { xs: 1, sm: 0.8 },
                                    minWidth: { xs: 'auto', sm: 80 },
                                    flex: { xs: 1, sm: 'none' }
                                  }}
                                >
                                  Refund
                                </Button>
                              )}
                            </>
                          )}
                        </Box>
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

      {/* Ticket Modal */}
      <TicketModal
        open={ticketModalOpen}
        onClose={handleCloseTicketModal}
        ticketData={selectedTicket}
      />

      {/* Custom Alert */}
      <CustomAlert
        open={alertConfig.open}
        onClose={() => setAlertConfig({ ...alertConfig, open: false })}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
      />

      {/* Refund Modal */}
      <RefundModal
        open={refundModalOpen}
        onClose={() => {
          setRefundModalOpen(false);
          setSelectedRefundTicket(null);
        }}
        onConfirm={handleRefundConfirm}
        ticketData={selectedRefundTicket}
        loading={refundLoading}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmConfig.open}
        onClose={() => setConfirmConfig({ open: false, ticketId: null })}
        onConfirm={() => {
          if (confirmConfig.ticketId) {
            handleCancelBooking(confirmConfig.ticketId);
          }
        }}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone and a refund will be processed."
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        type="danger"
      />
    </Container>
  );
};

export default BookingsPage;