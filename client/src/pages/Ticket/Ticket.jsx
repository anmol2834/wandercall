import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, CircularProgress, Alert, Paper, Grid, Chip, 
  useTheme, useMediaQuery, Divider, Button, IconButton, Stack, Container
} from '@mui/material';
import { 
  CalendarToday, LocationOn, Person, ConfirmationNumber, 
  CheckCircle, QrCode2, Download, Home, ArrowBack, FileDownload, Celebration, Schedule, Phone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI } from '../../services/api';
import QRCode from 'qrcode';
import TicketDownloader from '../../components/PDFTicket/TicketDownloader';
import TicketSkeleton from '../../components/loaders/TicketSkeleton';

const Ticket = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    if (orderId) {
      verifyPaymentAndFetchTicket();
    } else {
      setError('No order ID found');
      setLoading(false);
    }
  }, [user, orderId]);

  const verifyPaymentAndFetchTicket = async () => {
    try {
      setLoading(true);
      
      // Wait for webhook to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const paymentResult = await paymentAPI.verifyPayment({ order_id: orderId });
      
      if (paymentResult.data.status === 'PAID') {
        // Try to fetch ticket with better error handling
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/by-order/${orderId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            const ticketData = await response.json();
            
            if (response.ok && ticketData.success && ticketData.ticket) {
              setTicket(ticketData.ticket);
              generateQRCode(ticketData.ticket);
              return;
            }
            
            // Handle different response statuses
            if (response.status === 202 && ticketData.status === 'PENDING') {
              console.log('Payment still processing...');
            } else if (response.status === 400 && ticketData.status === 'FAILED') {
              setError('Payment failed. Please try booking again.');
              return;
            }
            
          } catch (fetchError) {
            console.log(`Attempt ${attempts + 1} failed:`, fetchError.message);
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            // Exponential backoff: 2s, 4s, 6s, 8s
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
          }
        }
        
        // No fallback needed - webhook should handle ticket creation
        
        setError(`Ticket processing delayed. Order ID: ${orderId}. Please contact support if this persists.`);
      } else {
        setError('Payment not completed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (ticketData) => {
    try {
      const qrData = JSON.stringify({
        ticketNumber: ticketData.ticketNumber,
        orderId: ticketData.orderId,
        userId: ticketData.userId?._id,
        productId: ticketData.productId?._id,
        date: ticketData.selectedDate,
        participants: ticketData.participants,
        amount: ticketData.totalPrice
      });
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: isMobile ? 80 : 100,
        margin: 1,
        color: { 
          dark: theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a2e', 
          light: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff' 
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const formatTicketData = () => {
    if (!ticket) return null;
    
    console.log('formatTicketData - Raw ticket:', ticket);
    console.log('formatTicketData - ticket.openTime:', ticket.openTime);
    console.log('formatTicketData - ticket.closeTime:', ticket.closeTime);
    console.log('formatTicketData - ticket.productId?.openTime:', ticket.productId?.openTime);
    console.log('formatTicketData - ticket.productId?.closeTime:', ticket.productId?.closeTime);
    
    const basePrice = ticket.totalPrice - ticket.gst - (ticket.discount || 0);
    return {
      ticketNumber: ticket.ticketNumber,
      title: ticket.productId?.title || 'Experience',
      userName: ticket.userId?.name || 'Guest',
      userEmail: ticket.userId?.email || '',
      userPhone: ticket.userId?.phone || '',
      selectedDate: ticket.selectedDate,
      participants: ticket.participants,
      location: `${ticket.productId?.location?.city || 'City'}, ${ticket.productId?.location?.state || 'State'}`,
      fullAddress: ticket.productId?.location?.address || `${ticket.productId?.location?.city || 'City'}, ${ticket.productId?.location?.state || 'State'}`,
      pincode: ticket.productId?.location?.pincode || '000000',
      providerPhone: ticket.productId?.phone || 'N/A',
      totalPrice: ticket.totalPrice,
      basePrice: basePrice > 0 ? basePrice : ticket.totalPrice,
      gst: ticket.gst || 0,
      discount: ticket.discount || 0,
      paymentId: ticket.paymentId || 'Processing',
      openTime: ticket.openTime || ticket.productId?.openTime,
      closeTime: ticket.closeTime || ticket.productId?.closeTime
    };
  };

  if (loading) {
    return <TicketSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
        gap: 2
      }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          size={isMobile ? 'small' : 'medium'}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  if (!ticket) return null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e0e7ff 75%, #f3f4f6 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Celebration Animation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                scale: 0,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: -100,
                rotate: 360
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                borderRadius: '50%'
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

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
          <IconButton 
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              color: theme.palette.mode === 'dark' ? 'white' : 'black',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <TicketDownloader
            ticketData={formatTicketData()}
            fileName={`wandercall-ticket-${ticket.ticketNumber}.pdf`}
          >
            {({ loading, error }) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <FileDownload />}
                  disabled={loading || error || !ticket}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    px: { xs: 2.5, sm: 3.5 },
                    py: { xs: 1, sm: 1.2 },
                    minWidth: { xs: 100, sm: 120 },
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'rgba(102, 126, 234, 0.6)',
                      color: 'white'
                    }
                  }}
                >
                  {loading ? 'Generating...' : 'Download'}
                </Button>
              </motion.div>
            )}
          </TicketDownloader>
        </Box>
        
        {/* Main Ticket Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2
          }}
        >
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
            <Box sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              height: { xs: 6, sm: 8 },
              position: 'relative'
            }} />
          
            <Box sx={{ p: { xs: '5px', sm: 4, md: 5 } }}>
              {/* Success Badge */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, sm: 4 } }}>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.5, 
                    type: 'spring', 
                    stiffness: 200,
                    damping: 10
                  }}
                >
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    label="BOOKING CONFIRMED"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.2 },
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 }
                      }
                    }}
                  />
                </motion.div>
              </Box>

              {/* Experience Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: { xs: 2, sm: 3 },
                    lineHeight: 1.2,
                    fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
                    textAlign: 'center'
                  }}
                >
                  {ticket.productId?.title}
                </Typography>
              </motion.div>

              {/* Ticket Number */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: { xs: 3, sm: 4 }
                }}>
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(102, 126, 234, 0.1)'
                      : 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <ConfirmationNumber sx={{ 
                      fontSize: { xs: 20, sm: 22 }, 
                      color: 'primary.main' 
                    }} />
                    <Typography 
                      variant="h6"
                      sx={{ 
                        fontWeight: 700, 
                        color: 'text.primary',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        letterSpacing: 0.5
                      }}
                    >
                      {ticket.ticketNumber}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

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
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      mb: 3, 
                      color: 'text.primary',
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}>
                      Ticket Information
                    </Typography>
                    
                    <Grid container spacing={{ xs: 1, md: 3 }}>
                      {/* Date */}
                      <Grid item xs={6} md={6}>
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
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <CalendarToday sx={{ fontSize: 20, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="caption" sx={{ 
                                color: 'text.secondary', 
                                textTransform: 'uppercase', 
                                letterSpacing: 0.5,
                                fontWeight: 600
                              }}>
                                Date
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {new Date(ticket.selectedDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>

                      {/* Participants */}
                      <Grid item xs={6} md={6}>
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
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Person sx={{ fontSize: 20, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="caption" sx={{ 
                                color: 'text.secondary', 
                                textTransform: 'uppercase', 
                                letterSpacing: 0.5,
                                fontWeight: 600
                              }}>
                                Guests
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {ticket.participants} {ticket.participants === 1 ? 'Person' : 'People'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                      {/* Opening Time */}
                      {(ticket.openTime || ticket.productId?.openTime) && (
                        <Grid item xs={6} md={6}>
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
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Schedule sx={{ fontSize: 20, color: 'primary.main' }} />
                              <Box>
                                <Typography variant="caption" sx={{ 
                                  color: 'text.secondary', 
                                  textTransform: 'uppercase', 
                                  letterSpacing: 0.5,
                                  fontWeight: 600
                                }}>
                                  Starts At
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {ticket.openTime || ticket.productId?.openTime}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>
                      )}

                      {/* Closing Time */}
                      {(ticket.closeTime || ticket.productId?.closeTime) && (ticket.closeTime || ticket.productId?.closeTime).trim() && (
                        <Grid item xs={6} md={6}>
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
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Schedule sx={{ fontSize: 20, color: 'primary.main' }} />
                              <Box>
                                <Typography variant="caption" sx={{ 
                                  color: 'text.secondary', 
                                  textTransform: 'uppercase', 
                                  letterSpacing: 0.5,
                                  fontWeight: 600
                                }}>
                                  Ends At
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {ticket.closeTime || ticket.productId?.closeTime}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>
                      )}
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        Guest Information
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{ticket.userId?.name}</Typography>
                        </Box>
                      </Stack>
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        Venue Details
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                              {ticket.productId?.location?.address}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ticket.productId?.location?.city}, {ticket.productId?.location?.state} - {ticket.productId?.location?.pincode}
                            </Typography>
                          </Box>
                        </Box>
                        {ticket.productId?.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">{ticket.productId.phone}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Column - QR Code & Payment */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={{ xs: 1, md: 3 }}>
                    {/* QR Code Section */}
                    <Box sx={{
                      p: { xs: 1, md: 3 },
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        Entry QR Code
                      </Typography>
                      <QrCode2 sx={{ fontSize: 32, color: 'primary.main', mb: 2 }} />
                      {qrCodeUrl && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <img src={qrCodeUrl} alt="QR Code" style={{ width: 120, height: 120 }} />
                        </Box>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Show this code at venue
                      </Typography>
                    </Box>

                    {/* Payment Info */}
                    <Box sx={{
                      p: { xs: 1, md: 3 },
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                        Payment Summary
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" color="text.secondary">Total Paid</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ₹{ticket.totalPrice}
                        </Typography>
                      </Box>
                      <Chip
                        label={ticket.paymentStatus}
                        sx={{
                          mt: 2,
                          bgcolor: ticket.paymentStatus === 'PAID' ? 'success.main' : 'warning.main',
                          color: ticket.paymentStatus === 'PAID' ? 'success.contrastText' : 'warning.contrastText',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            {/* Bottom Premium Strip */}
            <Box sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              height: { xs: 6, sm: 8 }
            }} />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Ticket;