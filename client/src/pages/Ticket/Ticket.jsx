import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, CircularProgress, Alert, Paper, Grid, Chip, 
  useTheme, useMediaQuery, Divider, Button, IconButton, Stack
} from '@mui/material';
import { 
  CalendarToday, LocationOn, Person, ConfirmationNumber, 
  CheckCircle, QrCode2, Download, Home, ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI } from '../../services/api';
import QRCode from 'qrcode';

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

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Simple ticket download (you can enhance this)
    ctx.fillStyle = theme.palette.background.paper;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = '24px Arial';
    ctx.fillText(`Ticket: ${ticket.ticketNumber}`, 50, 100);
    ctx.fillText(`Experience: ${ticket.productId?.title}`, 50, 150);
    
    const link = document.createElement('a');
    link.download = `ticket-${ticket.ticketNumber}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
      width: '100vw',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 1, sm: 2, md: 3 },
      position: 'relative'
    }}>
      {/* Header Actions */}
      <Box sx={{
        position: 'absolute',
        top: { xs: 16, md: 24 },
        left: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { boxShadow: 2 }
          }}
          size={isMobile ? 'small' : 'medium'}
        >
          <Home fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
        
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Download
        </Button>
      </Box>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ 
          width: '100%', 
          maxWidth: isMobile ? '100%' : '900px',
          marginTop: isMobile ? '60px' : '80px'
        }}
      >
        <Paper sx={{
          bgcolor: 'background.paper',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0,0,0,0.4)' 
            : '0 8px 32px rgba(0,0,0,0.12)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(0,0,0,0.05)',
          position: 'relative'
        }}>
          {/* Premium Header Strip */}
          <Box sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            height: { xs: 4, sm: 6, md: 8 },
            position: 'relative'
          }} />
          
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Success Badge */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 3 } }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Chip
                  icon={<CheckCircle sx={{ fontSize: { xs: 16, md: 18 } }} />}
                  label="CONFIRMED"
                  sx={{
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    px: { xs: 1, md: 2 },
                    py: 0.5,
                    '& .MuiChip-label': {
                      px: { xs: 1, md: 1.5 }
                    }
                  }}
                />
              </motion.div>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {/* Main Ticket Content */}
              <Grid item xs={12} md={8}>
                {/* Experience Title */}
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: { xs: 2, md: 3 },
                    lineHeight: 1.2,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  {ticket.productId?.title}
                </Typography>

                {/* Ticket Number */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: { xs: 2, md: 3 } }}>
                  <ConfirmationNumber sx={{ 
                    fontSize: { xs: 18, md: 20 }, 
                    color: 'primary.main' 
                  }} />
                  <Typography 
                    variant={isMobile ? 'body1' : 'h6'} 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                    }}
                  >
                    {ticket.ticketNumber}
                  </Typography>
                </Stack>

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
                          {ticket.productId?.location?.city}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        >
                          {ticket.productId?.location?.state}
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
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            height: { xs: 4, sm: 6, md: 8 }
          }} />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Ticket;