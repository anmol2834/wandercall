import {
  Box, Container, Typography, Button, Card, CardContent, Grid, Divider,
  IconButton, useTheme, useMediaQuery, Chip, Paper
} from '@mui/material';
import {
  ArrowBack, CheckCircle, LocationOn, CalendarToday, Group, 
  AccessTime, Star, Download, Share, QrCode, Celebration,
  FlightTakeoff, LocalActivity
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Ticket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showConfetti, setShowConfetti] = useState(true);
  
  const bookingData = location.state || {
    experience: {
      id: id,
      title: "Sunset Desert Safari Adventure",
      location: "Dubai, UAE",
      price: 299,
      rating: 4.8,
      duration: "6 hours",
      images: ["https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop"]
    },
    selectedDate: new Date(),
    participants: 2,
    guestInfo: { name: "John Doe", email: "john@example.com", phone: "+1234567890" },
    totalPrice: 656.82
  };

  const ticketNumber = `WC${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      overflow: 'auto',
      position: 'relative',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'white',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      {/* Floating Elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              y: [-20, -40, -20],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              position: 'absolute',
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
          >
            {i % 3 === 0 ? <FlightTakeoff sx={{ fontSize: 40, color: 'rgba(255,255,255,0.1)' }} /> :
             i % 3 === 1 ? <LocalActivity sx={{ fontSize: 35, color: 'rgba(255,255,255,0.1)' }} /> :
             <Celebration sx={{ fontSize: 30, color: 'rgba(255,255,255,0.1)' }} />}
          </motion.div>
        ))}
      </Box>

      {/* Header */}
      <Box sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={() => navigate('/')} 
                sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  color: theme.palette.mode === 'dark' ? 'white' : 'black',
                  '&:hover': { 
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            </motion.div>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700} sx={{ 
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                textShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(255,255,255,0.8)'
              }}>
                🎉 Booking Confirmed!
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)'
              }}>
                Your experience ticket is ready
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Main Ticket Container */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2,
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: '100%', maxWidth: '900px' }}
        >
          {/* Ticket Card */}
          <Card sx={{ 
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.9) 100%)'
              : '#ffffff',
            backdropFilter: 'blur(30px)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
              : '0 4px 20px rgba(0,0,0,0.1)',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
            }
          }}>
            {/* Ticket Header */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}
              >
                <Celebration sx={{ fontSize: 100 }} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Typography variant="h4" fontWeight={800} mb={1} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  TICKET
                </Typography>
                <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: 2 }}>
                  #{ticketNumber}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Valid for single use • Non-transferable
                </Typography>
              </motion.div>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left Side - Experience Details */}
                <Grid item xs={12} md={8}>
                  {/* Experience Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                        {bookingData.experience.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#90caf9' }} />
                        <Typography variant="body2" fontWeight={400} sx={{ color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.600' }}>
                          {bookingData.experience.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                        <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.mode === 'dark' ? 'grey.300' : 'grey.600' }}>
                          {bookingData.experience.rating} • Experience
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.2)' }} />

                  {/* Booking Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)', border: '1px solid #667eea30' }}>
                          <CalendarToday sx={{ fontSize: 24, color: '#667eea', mb: 1 }} />
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} display="block">
                            Date
                          </Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                            {new Date(bookingData.selectedDate).toLocaleDateString()}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f5576c20 0%, #f093fb20 100%)', border: '1px solid #f5576c30' }}>
                          <Group sx={{ fontSize: 24, color: '#f5576c', mb: 1 }} />
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} display="block">
                            Guests
                          </Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                            {bookingData.participants} {bookingData.participants === 1 ? 'Person' : 'People'}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #4facfe20 0%, #00f2fe20 100%)', border: '1px solid #4facfe30' }}>
                          <AccessTime sx={{ fontSize: 24, color: '#4facfe', mb: 1 }} />
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} display="block">
                            Duration
                          </Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                            {bookingData.experience.duration}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #43e97b20 0%, #38f9d720 100%)', border: '1px solid #43e97b30' }}>
                          <CheckCircle sx={{ fontSize: 24, color: '#43e97b', mb: 1 }} />
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} display="block">
                            Status
                          </Typography>
                          <Chip label="✓ Confirmed" color="success" size="small" sx={{ fontWeight: 700 }} />
                        </Paper>
                      </Grid>
                    </Grid>
                  </motion.div>

                  {/* Guest Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <Paper sx={{ 
                      p: 2, 
                      mb: 3, 
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)'
                        : '#f5f5f5', 
                      border: theme.palette.mode === 'dark' ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.8)' : '#ffffff'
                    }}>
                      <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                        Guest Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.600' }} display="block">
                            Full Name
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                            {bookingData.guestInfo.name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.600' }} display="block">
                            Email Address
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                            {bookingData.guestInfo.email}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.600' }} display="block">
                            Phone Number
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>
                            {bookingData.guestInfo.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>

                {/* Right Side - QR Code */}
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Paper sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}
                      >
                        <QrCode sx={{ fontSize: 60 }} />
                      </motion.div>
                      
                      <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        Scan to Verify
                      </Typography>
                      
                      <motion.div
                        animate={{ 
                          boxShadow: [
                            '0 0 0 0 rgba(255,255,255,0.4)',
                            '0 0 0 10px rgba(255,255,255,0)',
                            '0 0 0 0 rgba(255,255,255,0)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Box sx={{ 
                          width: 120, 
                          height: 120, 
                          backgroundColor: 'white', 
                          borderRadius: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2
                        }}>
                          <QrCode sx={{ fontSize: 80, color: '#667eea' }} />
                        </Box>
                      </motion.div>
                      
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Show this QR code at the venue
                      </Typography>
                      
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                        <Typography variant="h6" fontWeight={700}>
                          ${bookingData.totalPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Total Amount Paid
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 4 }}>
                  <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Download />}
                      sx={{ 
                        py: 2, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' },
                        fontWeight: 600
                      }}
                    >
                      Download PDF
                    </Button>
                  </motion.div>
                  
                  <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Share />}
                      sx={{ 
                        py: 2,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2, backgroundColor: 'primary.main', color: 'white' },
                        fontWeight: 600
                      }}
                    >
                      Share Ticket
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    color: theme.palette.mode === 'dark' ? 'white' : '#667eea',
                    border: theme.palette.mode === 'dark' ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Back to Home
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Ticket;