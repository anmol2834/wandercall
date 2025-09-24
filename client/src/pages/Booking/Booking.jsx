import {
  Box, Container, Typography, Button, Card, CardContent, Grid, TextField,
  IconButton, useTheme, useMediaQuery, Divider, Alert,
  Paper, InputAdornment, Chip, FormControl, InputLabel, Select, MenuItem,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack, CalendarToday, Person, Email, Phone, LocalOffer,
  CreditCard, AccountBalanceWallet, QrCode, CheckCircle, LocationOn,
  AccessTime, Group, Star, EventAvailable, EventBusy, Payment,
  CenterFocusStrong
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProviderAvailability, selectProviderAvailability, selectAvailabilityLoading } from '../../redux/slices/productsSlice';
import { createPaymentSession, setBookingData } from '../../redux/slices/checkoutSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import usePageTitle from '../../hooks/usePageTitle';
import wandercallLogo2 from '../../assets/wandercall-logo2.svg';
import BookingWireframe from '../../components/BookingWireframe/BookingWireframe';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, productLoading, error } = useSelector(state => state.products);
  const providerAvailability = useSelector(state => {
    const availability = state.products.providerAvailability?.[id];
    return availability ? [...availability] : [];
  }, (left, right) => JSON.stringify(left) === JSON.stringify(right));
  const availabilityLoading = useSelector(selectAvailabilityLoading);
  const availabilityError = useSelector(state => state.products.availabilityError);
  const { loading: checkoutLoading, paymentSession, error: checkoutError } = useSelector(state => state.checkout);
  const { user, updateUser } = useAuth();
  const { hasActiveDiscount, waitlistRewards } = useRewards();
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  usePageTitle('Book Experience');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [participants, setParticipants] = useState(1);
  const [couponCode, setCouponCode] = useState('SAVE10');
  const [couponApplied, setCouponApplied] = useState(false);
  const [waitlistReward, setWaitlistReward] = useState(false);
  const [couponValid, setCouponValid] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (id && !product) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (id && product && (!providerAvailability || providerAvailability.length === 0) && !availabilityLoading) {
      dispatch(fetchProviderAvailability(id));
    }
  }, [dispatch, id, product, providerAvailability, availabilityLoading]);

  useEffect(() => {
    if (hasActiveDiscount) {
      setWaitlistReward(true);
    }
  }, [hasActiveDiscount]);

  useEffect(() => {
    if (user && !guestInfo.name) {
      fetchUserData();
    }
  }, [user]);

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.wandercall.com'}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const userData = data.user;
      setGuestInfo({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });

      // If phone is missing, stay on step 1 to collect it
      if (!userData.phone && activeStep === 2) {
        setActiveStep(1);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const updateUserData = async (userData) => {
    setIsUpdatingUser(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.wandercall.com'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        updateUser(data.user);
        setGuestInfo(prev => ({ ...prev, ...userData }));
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Loading and error states
  if (productLoading) {
    return <BookingWireframe />;
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Experience not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
      </Box>
    );
  }

  // Check if experience is active
  if (product && !product.active) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>Experience Coming Soon</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          This experience is not yet available for booking. Please check back later.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
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
    groupSize: "2-15 people", // Static for now
    images: [product.img1, product.img2, product.img3, product.img4].filter(Boolean)
  };

  const steps = [
    { label: 'Booking Details', icon: <CalendarToday /> },
    { label: 'User Information', icon: <Person /> },
    { label: 'Payment', icon: <Payment /> }
  ];
  const basePrice = experience.price * participants;
  const waitlistDiscountAmount = waitlistReward ? basePrice * 0.1 : 0;
  const couponDiscountAmount = couponApplied ? basePrice * (couponDiscount / 100) : 0;
  const discount = waitlistDiscountAmount + couponDiscountAmount;
  
  const totalPrice = basePrice - discount;

  const handleCouponApply = () => {
    const code = couponCode.toLowerCase();
    
    if (code === 'save10') {
      setCouponValid(true);
      setCouponApplied(true);
      setCouponDiscount(10);
    } else {
      setCouponValid(false);
      setCouponApplied(false);
      setCouponDiscount(0);
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
      if (!guestInfo.phone.trim()) errors.phone = 'Phone number is required';
      if (guestInfo.email && !/\S+@\S+\.\S+/.test(guestInfo.email)) {
        errors.email = 'Please enter a valid email';
      }
      if (guestInfo.phone && !/^[+]?[1-9]\d{1,14}$/.test(guestInfo.phone.replace(/\s/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(activeStep)) {
      if (activeStep === 1 && user) {
        const updateData = {};
        const currentName = guestInfo.name.trim();
        const currentPhone = guestInfo.phone.trim();

        if (currentName && currentName !== (user.name || '')) {
          updateData.name = currentName;
        }
        if (currentPhone && currentPhone !== (user.phone || '')) {
          updateData.phone = currentPhone;
        }

        if (Object.keys(updateData).length > 0) {
          await updateUserData(updateData);
        }
      }
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

  const handleBooking = async () => {
    if (!validateStep(activeStep) || isProcessing || paymentInitiated) {
      return;
    }

    if (!user) {
      navigate('/signin');
      return;
    }

    if (!guestInfo.phone.trim()) {
      setValidationErrors({ phone: 'Phone number is required' });
      setActiveStep(1);
      return;
    }

    setIsProcessing(true);
    setPaymentInitiated(true);

    try {
      // Step 1: Prepare Booking Data
      const bookingPayload = {
        productId: product._id,
        title: product.title,
        city: product.location?.city || '',
        state: product.location?.state || '',
        selectedDate: selectedDate.toISOString(),
        participants,
        guestInfo: {
          ...guestInfo,
          phone: guestInfo.phone || user.phone,
        },
        totalPrice: Math.round(totalPrice * 100) / 100, // Ensure proper decimal formatting
        gst: 0, // Set to 0 since GST is removed from frontend
        discount: Math.round(discount * 100) / 100,
      };
      


      // Step 2: Load Cashfree SDK
      const scriptLoaded = await loadCashfreeScript();
      if (!scriptLoaded) {
        throw new Error('SDK_LOAD_FAILED');
      }

      // Step 3: Create Payment Session via Backend
      const sessionResult = await dispatch(createPaymentSession({ bookingData: bookingPayload }));

      if (createPaymentSession.rejected.match(sessionResult)) {
        // This will now catch errors from your Redux thunk and log them

        throw new Error(`Backend Error: ${sessionResult.payload || 'Unknown error'}`);
      }
      
      const sessionData = sessionResult.payload;

      if (!sessionData || !sessionData.payment_session_id) {
        throw new Error('INVALID_SESSION_ID_FROM_BACKEND');
      }

      // Step 4: Initialize Cashfree SDK on Frontend
      const cfMode = import.meta.env.PROD ? 'production' : 'sandbox';
      const cashfree = window.Cashfree({ mode: cfMode });
      
      const checkoutOptions = {
        paymentSessionId: sessionData.payment_session_id,
        redirectTarget: '_self',
      };
      
      // Step 5: Redirect to Cashfree
      cashfree.checkout(checkoutOptions);

    } catch (error) {
      console.error('Payment initiation failed:', error.message);
      setIsProcessing(false);
      setPaymentInitiated(false);
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Day name mapping
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateStr = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < tomorrow;
      
      // Check if this day is in provider's available days
      const dayName = dayNames[date.getDay()];
      const currentDate = new Date();
      
      // Check if date is in current or next month based on availability
      const isInCurrentMonth = date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
      const isInNextMonth = date.getMonth() === (currentDate.getMonth() + 1) % 12 && 
        (currentDate.getMonth() === 11 ? date.getFullYear() === currentDate.getFullYear() + 1 : date.getFullYear() === currentDate.getFullYear());
      
      // If there's an error or no availability data, mark as unavailable for safety
      const isProviderAvailable = availabilityError 
        ? false 
        : (providerAvailability.length === 0 || providerAvailability.includes(dayName));
      
      // Check if current month has any available dates
      const currentMonthHasAvailableDates = (() => {
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        for (let d = new Date(Math.max(currentMonthStart, tomorrow)); d <= currentMonthEnd; d.setDate(d.getDate() + 1)) {
          const dayName = dayNames[d.getDay()];
          const isAvailable = isProviderAvailable && (providerAvailability.length === 0 || providerAvailability.includes(dayName));
          if (isAvailable) return true;
        }
        return false;
      })();
      
      // Allow current month dates if available, or next month dates if current month has no availability
      const isDateAvailable = !isPast && isProviderAvailable && 
        (isInCurrentMonth || (!currentMonthHasAvailableDates && isInNextMonth));
      
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push({
        date,
        dateStr,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isAvailable: isDateAvailable,
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleBack} size="small">
                  <ArrowBack />
                </IconButton>
              </motion.div>
              <Box
                component="img"
                src={wandercallLogo2}
                alt="wandercall"
                sx={{
                  height: { xs: 36, sm: 42 },
                  width: 'auto',
                  cursor: 'pointer',
                  filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'
                }}
                onClick={() => navigate('/')}
              />
            </Box>

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
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.12)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={700} mb={3} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, textAlign: 'center' }}>
                        Select Date & Participants
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12}>
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
                                width: '100%',
                                opacity: availabilityLoading ? 0.6 : 1,
                                pointerEvents: availabilityLoading ? 'none' : 'auto'
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

                              {/* Loading indicator */}
                              {availabilityLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                  <CircularProgress size={20} />
                                  <Typography variant="caption" sx={{ ml: 1 }}>Loading availability...</Typography>
                                </Box>
                              )}
                              
                              {/* Error indicator */}
                              {availabilityError && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                  Unable to load provider availability. All upcoming dates are marked as unavailable for safety.
                                </Alert>
                              )}
                              
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
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
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
                              label={`Coupon applied! ${couponDiscount}% discount`}
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
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.12)'
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
                                setGuestInfo({ ...guestInfo, name: e.target.value });
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
                                setGuestInfo({ ...guestInfo, email: e.target.value });
                                setValidationErrors(prev => ({ ...prev, email: null }));
                              }}
                              disabled={!!user}
                              error={!!validationErrors.email}
                              helperText={validationErrors.email || (user ? 'Email cannot be changed' : '')}
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
                                setGuestInfo({ ...guestInfo, phone: e.target.value });
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
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.12)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={700} mb={3}>
                        Complete Payment
                      </Typography>



                      {/* Payment Section */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 3,
                        py: 2
                      }}>
                        {/* Main Payment Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            onClick={handleBooking}
                            disabled={isProcessing || paymentInitiated}
                            startIcon={isProcessing ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <CreditCard />}
                            sx={{
                              py: { xs: 2, sm: 2.5 },
                              px: { xs: 4, sm: 8 },
                              fontSize: { xs: '1rem', sm: '1.3rem' },
                              fontWeight: 700,
                              borderRadius: 4,
                              minWidth: { xs: 280, sm: 360 },
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                              textTransform: 'none',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                                transform: 'translateY(-2px)'
                              },
                              '&:disabled': {
                                background: 'rgba(102, 126, 234, 0.6)',
                                color: 'white'
                              }
                            }}
                          >
                            {isProcessing ? 'Processing Payment...' : `Pay ₹${Math.round(totalPrice)} via Cashfree`}
                          </Button>
                        </motion.div>

                        {/* Security Features */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'center', 
                          gap: { xs: 1, sm: 2 },
                          justifyContent: 'center'
                        }}>
                          <Chip 
                            icon={<CheckCircle />} 
                            label="256-bit SSL Encrypted" 
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: 'success.main',
                              border: '1px solid rgba(76, 175, 80, 0.3)'
                            }}
                          />
                          <Chip 
                            icon={<CheckCircle />} 
                            label="PCI DSS Compliant" 
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: 'success.main',
                              border: '1px solid rgba(76, 175, 80, 0.3)'
                            }}
                          />
                        </Box>

                        {/* Powered by Cashfree */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            textAlign: 'center',
                            fontSize: { xs: '0.85rem', sm: '0.9rem' }
                          }}
                        >
                          🔒 Secure payment powered by Cashfree
                        </Typography>

                        {/* Cancellation Notice - Subtle */}
                        <Box sx={{
                          backgroundColor: 'rgba(158, 158, 158, 0.08)',
                          border: '1px solid rgba(158, 158, 158, 0.2)',
                          borderRadius: 2,
                          p: 2,
                          maxWidth: 400,
                          textAlign: 'center'
                        }}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.75rem',
                              lineHeight: 1.4
                            }}
                          >
                            Cancellation Policy: Bookings can be cancelled within 48 hours for a full refund.
                          </Typography>
                        </Box>

                        {/* Back Button */}
                        <Button
                          variant="text"
                          onClick={handleBack}
                          startIcon={<ArrowBack />}
                          sx={{
                            mt: 2,
                            color: 'text.secondary',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              color: 'text.primary'
                            }
                          }}
                        >
                          Back to User Information
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Only show for non-payment steps */}
            {activeStep < steps.length - 1 && (
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
                    onClick={handleNext}
                    disabled={isUpdatingUser}
                    startIcon={isUpdatingUser ? <CircularProgress size={20} /> : null}
                    sx={{
                      minWidth: 140,
                      height: 48,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                      }
                    }}
                  >
                    {isUpdatingUser ? 'Updating...' : 'Continue'}
                  </Button>
                </motion.div>
              </Box>
            )}
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
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : '#ffffff',
                backdropFilter: theme.palette.mode === 'dark' ? 'blur(20px)' : 'none',
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(99, 102, 241, 0.3)' 
                  : '1px solid rgba(99, 102, 241, 0.2)'
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

                    {/* Show waitlist reward */}
                    {(waitlistReward || hasActiveDiscount) && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Waitlist Reward (10%)
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -₹{(basePrice * 0.1).toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Show coupon discount */}
                    {couponApplied && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">
                          Coupon Discount ({couponDiscount}%)
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -₹{(basePrice * (couponDiscount / 100)).toFixed(2)}
                        </Typography>
                      </Box>
                    )}



                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight={700}>
                        Total Amount
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        ₹{Math.round(totalPrice)}
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