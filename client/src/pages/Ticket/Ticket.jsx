import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, CircularProgress, Alert, Paper, Grid, Chip, 
  useTheme, useMediaQuery, Divider, Button, IconButton, Stack, Container
} from '@mui/material';
import { 
  CalendarToday, LocationOn, Person, ConfirmationNumber, 
  CheckCircle, QrCode2, Download, Home, ArrowBack, FileDownload, Celebration
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI } from '../../services/api';
import QRCode from 'qrcode';
import TicketDownloader from '../../components/PDFTicket/TicketDownloader';

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
      paymentId: ticket.paymentId || 'Processing'
    };
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress size={isMobile ? 40 : 60} />
      </Box>
    );
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
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: { xs: 3, sm: 4 }
        }}>
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
          
            <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
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

              <Grid container spacing={{ xs: 3, sm: 4 }}>
                {/* Main Ticket Content */}
                <Grid item xs={12} md={8}>
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
                        fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' }
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
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: { xs: 3, sm: 4 },
                      px: 2,
                      py: 1,
                      borderRadius: 2,
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
                  </motion.div>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {/* Date & Time */}
                  <Grid item xs={6} sm={6}>
                    <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="flex-start">
                      <CalendarToday sx={{ 
                        fontSize: { xs: 16, sm: 18, md: 20 }, 
                        color: 'primary.main',
                        mt: 0.5
                      }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary', 
                            textTransform: 'uppercase', 
                            letterSpacing: 0.5,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            fontWeight: 500
                          }}
                        >
                          Date
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {new Date(ticket.selectedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Location */}
                  <Grid item xs={6} sm={6}>
                    <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="flex-start">
                      <LocationOn sx={{ 
                        fontSize: { xs: 16, sm: 18, md: 20 }, 
                        color: 'primary.main',
                        mt: 0.5
                      }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary', 
                            textTransform: 'uppercase', 
                            letterSpacing: 0.5,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            fontWeight: 500
                          }}
                        >
                          Location
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {ticket.productId?.location?.address}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {ticket.productId?.location?.city}, {ticket.productId?.location?.state} - {ticket.productId?.location?.pincode}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            display: 'block',
                            mt: 0.5
                          }}
                        >
                          📞 {ticket.productId?.phone || 'Contact info not available'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Participants */}
                  <Grid item xs={6} sm={6}>
                    <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="flex-start">
                      <Person sx={{ 
                        fontSize: { xs: 16, sm: 18, md: 20 }, 
                        color: 'primary.main',
                        mt: 0.5
                      }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary', 
                            textTransform: 'uppercase', 
                            letterSpacing: 0.5,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            fontWeight: 500
                          }}
                        >
                          Guests
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          {ticket.participants}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Guest Info */}
                  <Grid item xs={6} sm={6}>
                    <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="flex-start">
                      <Person sx={{ 
                        fontSize: { xs: 16, sm: 18, md: 20 }, 
                        color: 'primary.main',
                        mt: 0.5
                      }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary', 
                            textTransform: 'uppercase', 
                            letterSpacing: 0.5,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            fontWeight: 500
                          }}
                        >
                          Guest
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {ticket.userId?.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 2, md: 3 } }} />

                {/* Payment Info */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  justifyContent="space-between" 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={{ xs: 1, sm: 2 }}
                >
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary', 
                        textTransform: 'uppercase', 
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        fontWeight: 500
                      }}
                    >
                      Total Paid
                    </Typography>
                    <Typography 
                      variant={isMobile ? 'h6' : 'h5'} 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      ₹{ticket.totalPrice}
                    </Typography>
                  </Box>
                  <Chip
                    label={ticket.paymentStatus}
                    sx={{
                      bgcolor: ticket.paymentStatus === 'PAID' ? 'success.main' : 'warning.main',
                      color: ticket.paymentStatus === 'PAID' ? 'success.contrastText' : 'warning.contrastText',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      px: { xs: 1, sm: 1.5 }
                    }}
                  />
                </Stack>
              </Grid>

              {/* QR Code Section */}
              <Grid item xs={12} md={4}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 180, sm: 200, md: 280 },
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                  borderRadius: { xs: 2, md: 3 },
                  p: { xs: 2, sm: 3 },
                  border: `2px dashed ${theme.palette.divider}`,
                  position: 'relative'
                }}>
                  <QrCode2 sx={{ 
                    fontSize: { xs: 24, sm: 28, md: 32 }, 
                    color: 'primary.main', 
                    mb: { xs: 1, md: 2 } 
                  }} />
                  
                  <Typography 
                    variant={isMobile ? 'subtitle2' : 'h6'} 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary', 
                      mb: { xs: 1, md: 2 }, 
                      textAlign: 'center',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                    }}
                  >
                    Entry QR Code
                  </Typography>
                  
                  {qrCodeUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Box sx={{
                        p: { xs: 1, sm: 1.5 },
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1,
                        border: `1px solid ${theme.palette.divider}`
                      }}>
                        <img 
                          src={qrCodeUrl} 
                          alt="Ticket QR Code" 
                          style={{ 
                            display: 'block', 
                            width: isMobile ? '80px' : '100px', 
                            height: isMobile ? '80px' : '100px' 
                          }}
                        />
                      </Box>
                    </motion.div>
                  )}
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary', 
                      textAlign: 'center', 
                      mt: { xs: 1, md: 2 },
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      lineHeight: 1.3,
                      px: 1
                    }}
                  >
                    Show this code at venue
                  </Typography>
                </Box>
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