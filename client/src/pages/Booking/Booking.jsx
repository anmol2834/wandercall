import {
  Box, Container, Typography, Button, Card, CardContent, Grid, TextField,
  IconButton, useTheme, useMediaQuery, Divider, Alert,
  Paper, InputAdornment, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  ArrowBack, CalendarToday, Person, Email, Phone, LocalOffer,
  CreditCard, AccountBalanceWallet, QrCode, CheckCircle, LocationOn,
  AccessTime, Group, Star, EventAvailable, EventBusy, Payment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/slices/productsSlice';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, productLoading, error } = useSelector(state => state.products);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [participants, setParticipants] = useState(2);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponValid, setCouponValid] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates] = useState({
    '2024-12-25': false, '2024-12-26': true, '2024-12-27': true,
    '2024-12-28': false, '2024-12-29': true, '2024-12-30': true,
    '2025-01-01': false, '2025-01-02': true, '2025-01-03': true,
    '2025-01-04': true, '2025-01-05': false, '2025-01-06': true
  });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  // Loading and error states
  if (productLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: theme.palette.background.default,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        p: 3
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Box sx={{ width: '100%', height: 400, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 3 }} />
              </motion.div>
            </Grid>
            <Grid item xs={12} lg={4}>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>
                <Box sx={{ width: '100%', height: 350, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Experience not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
      </Box>
    );
  }

  // Map product data to experience format for UI compatibility
  const experience = {
    id: product._id,
    title: product.title,
    location: `${product.location.city}, ${product.location.state}`,
    price: product.price,
    originalPrice: product.mrp,
    rating: product.rating,
    duration: (() => {
      const start = new Date(`1970-01-01 ${product.openTime}`);
      const end = new Date(`1970-01-01 ${product.closeTime}`);
      const diff = (end - start) / (1000 * 60 * 60);
      return `${diff} hours`;
    })(),
    groupSize: "2-15 people", // Static for now
    images: [product.img1, product.img2, product.img3, product.img4].filter(Boolean)
  };

  const steps = [
    { label: 'Booking Details', icon: <CalendarToday /> },
    { label: 'User Information', icon: <Person /> },
    { label: 'Payment', icon: <Payment /> }
  ];
  const basePrice = experience.price * participants;
  const discount = couponApplied ? basePrice * 0.1 : 0;
  const gst = (basePrice - discount) * 0.18;
  const totalPrice = basePrice - discount + gst;

  const handleCouponApply = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setCouponValid(true);
      setCouponApplied(true);
    } else {
      setCouponValid(false);
      setCouponApplied(false);
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!selectedDate) errors.date = 'Please select a date';
      if (!participants) errors.participants = 'Please select number of participants';
    } else if (step === 1) {
      if (!guestInfo.name.trim()) errors.name = 'Name is required';
      if (!guestInfo.email.trim()) errors.email = 'Email is required';
      if (!guestInfo.phone.trim()) errors.phone = 'Phone is required';
      if (guestInfo.email && !/\S+@\S+\.\S+/.test(guestInfo.email)) {
        errors.email = 'Please enter a valid email';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handleBooking = () => {
    if (validateStep(activeStep)) {
      // Simulate payment success and redirect to ticket page
      const bookingData = {
        experience,
        selectedDate,
        participants,
        guestInfo,
        totalPrice
      };
      navigate(`/ticket/${id}`, { state: bookingData });
    }
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isAvailable = availableDates[dateStr] !== undefined ? availableDates[dateStr] : true;
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      
      days.push({
        date,
        dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isAvailable: !isPast && isAvailable,
        isSelected
      });
    }
    
    return days;
  };

  const handleDateSelect = (day) => {
    if (!day.isPast && day.isAvailable) {
      setSelectedDate(day.date);
      setValidationErrors(prev => ({ ...prev, date: null }));
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default,
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Header */}
      <Paper elevation={0} sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1100,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton onClick={handleBack} size="small">
                <ArrowBack />
              </IconButton>
            </motion.div>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Book Your Experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete your booking in just a few steps
              </Typography>
            </Box>

            {/* Modern Progress Bar */}
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                {steps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <motion.div
                      animate={{
                        scale: activeStep === index ? 1.2 : 1,
                        backgroundColor: activeStep >= index ? '#667eea' : '#e0e0e0'
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        position: 'relative'
                      }}
                    >
                      {activeStep > index ? <CheckCircle /> : step.icon}
                      {activeStep === index && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '2px solid #667eea',
                            opacity: 0.6
                          }}
                        />
                      )}
                    </motion.div>
                    <Typography variant="caption" sx={{ 
                      color: activeStep >= index ? 'primary.main' : 'text.secondary',
                      fontWeight: activeStep === index ? 600 : 400,
                      mt: 1,
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>
                      {step.label}
                    </Typography>
                  </Box>
                ))}
                
                {/* Progress Line */}
                <Box sx={{ 
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  height: 2,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 1,
                  zIndex: 1
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: '100%',
                      backgroundColor: '#667eea',
                      borderRadius: 1
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4}>
          
          {/* Left Column - Booking Forms */}
          <Grid item xs={12} lg={8}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                
                {/* Step 1: Booking Details */}
                {activeStep === 0 && (
                  <Card sx={{ 
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={700} mb={3}>
                        Select Date & Participants
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h6" fontWeight={600} mb={2}>
                            Select Your Date
                          </Typography>
                          
                          {/* Modern Calendar */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Card sx={{ 
                              p: { xs: 1, sm: 2 }, 
                              border: validationErrors.date ? '2px solid #f44336' : '1px solid #e0e0e0',
                              borderRadius: 3,
                              width: { xs: '100%', md: '80%' },
                              mx: { md: 'auto' }
                            }}>
                              {/* Calendar Header */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <IconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                                  <ArrowBack />
                                </IconButton>
                                <Typography variant="h6" fontWeight={600}>
                                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </Typography>
                                <IconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                                  <ArrowBack sx={{ transform: 'rotate(180deg)' }} />
                                </IconButton>
                              </Box>
                              
                              {/* Calendar Grid */}
                              <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(7, 1fr)', 
                                gap: { xs: 0.3, sm: 1 },
                                width: '100%',
                                mb: 2
                              }}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                  <Box key={day} sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: { xs: '32px', sm: '36px' }
                                  }}>
                                    <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 600 }}>
                                      {day}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                              
                              <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(7, 1fr)', 
                                gap: { xs: 0.3, sm: 1 },
                                width: '100%'
                              }}>
                                {generateCalendar().map((day, index) => (
                                  <motion.div
                                    key={index}
                                    whileHover={day.isAvailable ? { scale: 1.1 } : {}}
                                    whileTap={day.isAvailable ? { scale: 0.95 } : {}}
                                    animate={day.isSelected ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Box
                                      onClick={() => handleDateSelect(day)}
                                      sx={{
                                        width: '100%',
                                        height: { xs: '32px', sm: '36px' },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        cursor: day.isAvailable ? 'pointer' : 'not-allowed',
                                        backgroundColor: day.isSelected 
                                          ? '#667eea' 
                                          : day.isPast 
                                            ? '#f5f5f5'
                                            : day.isAvailable 
                                              ? '#e8f5e8'
                                              : '#ffebee',
                                        color: day.isSelected 
                                          ? 'white'
                                          : day.isPast 
                                            ? '#bdbdbd'
                                            : day.isAvailable 
                                              ? '#2e7d32'
                                              : '#c62828',
                                        opacity: day.isCurrentMonth ? 1 : 0.3,
                                        border: day.isSelected ? '2px solid #5a6fd8' : 'none',
                                        '&:hover': day.isAvailable ? {
                                          backgroundColor: day.isSelected ? '#5a6fd8' : '#c8e6c9',
                                          transform: 'scale(1.05)'
                                        } : {}
                                      }}
                                    >
                                      <Typography 
                                        variant="body2" 
                                        fontWeight={day.isSelected ? 600 : 400}
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                      >
                                        {day.day}
                                      </Typography>
                                    </Box>
                                  </motion.div>
                                ))}
                              </Box>
                              
                              {/* Legend */}
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ width: 12, height: 12, backgroundColor: '#e8f5e8', borderRadius: 1 }} />
                                  <Typography variant="caption">Available</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ width: 12, height: 12, backgroundColor: '#ffebee', borderRadius: 1 }} />
                                  <Typography variant="caption">Unavailable</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ width: 12, height: 12, backgroundColor: '#667eea', borderRadius: 1 }} />
                                  <Typography variant="caption">Selected</Typography>
                                </Box>
                              </Box>
                            </Card>
                            
                            {validationErrors.date && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Alert severity="error" sx={{ mt: 1 }}>
                                  {validationErrors.date}
                                </Alert>
                              </motion.div>
                            )}
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <motion.div
                            animate={validationErrors.participants ? { x: [-5, 5, -5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <FormControl fullWidth error={!!validationErrors.participants} variant="filled">
                              <InputLabel>Number of Participants</InputLabel>
                              <Select
                                value={participants}
                                onChange={(e) => {
                                  setParticipants(e.target.value);
                                  setValidationErrors(prev => ({ ...prev, participants: null }));
                                }}
                                sx={{
                                  '& .MuiFilledInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                    },
                                    '&.Mui-focused': {
                                      backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                    }
                                  }
                                }}
                                startAdornment={
                                  <InputAdornment position="start">
                                    <Group color="primary" />
                                  </InputAdornment>
                                }
                              >
                                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                  <MenuItem key={num} value={num}>
                                    {num} {num === 1 ? 'Person' : 'People'}
                                  </MenuItem>
                                ))}
                              </Select>
                              {validationErrors.participants && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                  {validationErrors.participants}
                                </Typography>
                              )}
                            </FormControl>
                          </motion.div>
                        </Grid>
                      </Grid>

                      {/* Coupon Section */}
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                          Have a Coupon Code?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            size="small"
                            variant="filled"
                            sx={{ 
                              flex: 1,
                              '& .MuiFilledInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                },
                                '&.Mui-focused': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                }
                              }
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalOffer color="primary" />
                                </InputAdornment>
                              )
                            }}
                            error={couponValid === false}
                            helperText={couponValid === false ? 'Invalid coupon code' : ''}
                          />
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outlined" 
                              onClick={handleCouponApply}
                              disabled={!couponCode}
                            >
                              Apply
                            </Button>
                          </motion.div>
                        </Box>
                        
                        {couponApplied && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Chip
                              icon={<CheckCircle />}
                              label="Coupon applied! 10% discount"
                              color="success"
                              sx={{ mt: 1 }}
                            />
                          </motion.div>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Guest Information */}
                {activeStep === 1 && (
                  <Card sx={{ 
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={700} mb={3}>
                        User Information
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <motion.div
                            animate={validationErrors.name ? { x: [-5, 5, -5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Full Name"
                              value={guestInfo.name}
                              onChange={(e) => {
                                setGuestInfo({...guestInfo, name: e.target.value});
                                setValidationErrors(prev => ({ ...prev, name: null }));
                              }}
                              error={!!validationErrors.name}
                              helperText={validationErrors.name}
                              variant="filled"
                              sx={{
                                '& .MuiFilledInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                  }
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person color="primary" />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <motion.div
                            animate={validationErrors.email ? { x: [-5, 5, -5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Email Address"
                              type="email"
                              value={guestInfo.email}
                              onChange={(e) => {
                                setGuestInfo({...guestInfo, email: e.target.value});
                                setValidationErrors(prev => ({ ...prev, email: null }));
                              }}
                              error={!!validationErrors.email}
                              helperText={validationErrors.email}
                              variant="filled"
                              sx={{
                                '& .MuiFilledInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                  }
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Email color="primary" />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <motion.div
                            animate={validationErrors.phone ? { x: [-5, 5, -5, 0] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={guestInfo.phone}
                              onChange={(e) => {
                                setGuestInfo({...guestInfo, phone: e.target.value});
                                setValidationErrors(prev => ({ ...prev, phone: null }));
                              }}
                              error={!!validationErrors.phone}
                              helperText={validationErrors.phone}
                              variant="filled"
                              sx={{
                                '& .MuiFilledInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                  }
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Phone color="primary" />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </motion.div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Payment */}
                {activeStep === 2 && (
                  <Card sx={{ 
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={700} mb={3}>
                        Complete Payment
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleBooking}
                          sx={{
                            py: 2,
                            px: 6,
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                            }
                          }}
                        >
                          Pay via Cashfree - ₹{totalPrice.toFixed(2)}
                        </Button>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Secure payment powered by Cashfree
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                          <Chip icon={<CheckCircle />} label="256-bit SSL Encrypted" size="small" />
                          <Chip icon={<CheckCircle />} label="PCI DSS Compliant" size="small" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{
                    minWidth: 140,
                    height: 48,
                    color: 'text.primary',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                >
                  {activeStep === 0 ? 'Back to Details' : 'Previous'}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  onClick={activeStep === steps.length - 1 ? handleBooking : handleNext}
                  sx={{ 
                    minWidth: 140,
                    height: 48,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Continue'}
                </Button>
              </motion.div>
            </Box>
          </Grid>

          {/* Right Column - Booking Summary */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{ 
                position: 'sticky', 
                top: 120,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    Booking Summary
                  </Typography>

                  {/* Experience Info */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box
                      component="img"
                      src={experience.images[0]}
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: 2,
                        objectFit: 'cover'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} lineHeight={1.2}>
                        {experience.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {experience.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 14, color: '#ffd700' }} />
                        <Typography variant="caption">
                          {experience.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Booking Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={2}>
                      Booking Details
                    </Typography>
                    
                    {selectedDate && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(selectedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Participants:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {participants} {participants === 1 ? 'Person' : 'People'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Duration:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {experience.duration}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Price Breakdown */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={2}>
                      Price Breakdown
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Base Price ({participants} × ₹{experience.price})
                      </Typography>
                      <Typography variant="body2">₹{basePrice}</Typography>
                    </Box>
                    
                    {couponApplied && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Discount (10%)
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -₹{discount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        GST (18%)
                      </Typography>
                      <Typography variant="body2">₹{gst.toFixed(2)}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight={700}>
                        Total Amount
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        ₹{totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Mobile Stepper */}
                  {isMobile && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color="text.secondary" mb={1} display="block">
                        Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
                      </Typography>
                      <Box sx={{ 
                        height: 4, 
                        backgroundColor: 'divider', 
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Booking;