import {
  Box, Container, Typography, Button, Card, CardContent, Grid, TextField,
  Stepper, Step, StepLabel, Select, MenuItem, FormControl, InputLabel,
  Checkbox, FormControlLabel, InputAdornment, IconButton, LinearProgress, Link, Divider,
  useTheme, useMediaQuery, Chip, Paper
} from '@mui/material';
import {
  Business, Person, Email, Phone, Category, Visibility, VisibilityOff,
  CheckCircle, Login, ArrowBack, ArrowForward, Send, Security, Verified, RocketLaunch,
  LocationOn, Description, AccountCircle, Work, ContactMail
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wandercallLogo from '../../assets/wandercall-logo2.svg';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    description: '',
    
    // Contact Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Legacy fields for compatibility
    contactPerson: '',
    businessEmail: '',
    phoneNumber: '',
    countryCode: '+91',
    serviceType: '',
    serviceDescription: '',
    verificationCode: '',
    agreeTerms: false
  });

  const steps = [
    { label: 'Personal', icon: <AccountCircle /> },
    { label: 'Business', icon: <Work /> },
    { label: 'Contact', icon: <ContactMail /> },
    { label: 'Verification', icon: <Security /> }
  ];
  
  const serviceTypes = [
    'FPV Drone Experience',
    'Story Sessions', 
    'Movie Nights',
    'Late Night Party',
    'Gamer Bash',
    'Wisdom Hours',
    'Cultural & Local Vibes',
    'Other'
  ];

  const benefits = [
    'Access to thousands of Experience seekers',
    'Marketing and promotion support', 
    'Secure payment processing',
    'Real-time analytics and insights',
    '24/7 customer support',
    'Flexible pricing and scheduling'
  ];

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return formData.fullName && formData.email && formData.phone && 
               formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword;
      case 1:
        return formData.businessName && formData.businessType && formData.description;
      case 2:
        return formData.address && formData.city && formData.state && formData.pincode;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Special handling for phone number
    if (field === 'phone' || field === 'phoneNumber') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResendCode = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Enhanced text field styles
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      transition: 'all 0.3s ease',
      width: isMobile ? '100%' : 'auto',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 1)',
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 1)',
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`,
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      }
    },
    '& .MuiInputBase-input': {
      fontWeight: 500,
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>+91</Typography>
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                sx={textFieldStyles}
              />
            </Grid>
            
            {/* Email Verification Button */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowEmailVerification(true)}
                disabled={!formData.email}
                sx={{
                  py: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                Verify Email Address
              </Button>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessName"
                autoComplete="organization"
                value={formData.businessName}
                onChange={handleInputChange('businessName')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth sx={textFieldStyles}>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={formData.businessType}
                  onChange={(e) => handleSelectChange('businessType', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Category sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  }
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Description"
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Tell us about your business and the experiences you offer..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Description sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                name="address"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleInputChange('address')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleInputChange('city')}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                autoComplete="address-level1"
                value={formData.state}
                onChange={handleInputChange('state')}
                sx={textFieldStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                autoComplete="postal-code"
                value={formData.pincode}
                onChange={handleInputChange('pincode')}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>Registration Summary</Typography>
            <Card 
              variant="outlined" 
              sx={{ 
                mb: 3,
                mx: { xs: 2, sm: 0 },
                borderRadius: 3,
                background: theme.palette.mode === 'dark' ? 'rgba(15, 15, 35, 0.6)' : '#ffffff',
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.12)'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>Business Info</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Business Name: {formData.businessName}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Contact Person: {formData.fullName}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Email: {formData.email}</Typography>
                
                <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }} />
                
                <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>Service Details</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Phone: +91 {formData.phone}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Business Type: {formData.businessType}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Description: {formData.description}</Typography>
              </CardContent>
            </Card>
            
            <FormControlLabel
              sx={{ mb: { xs: 6, sm: 3 } }}
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => handleSelectChange('agreeTerms', e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link href="/provider-terms" target="_blank" underline="hover">Provider Terms and Conditions</Link>
                </Typography>
              }
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'white',
      '&::before': theme.palette.mode === 'dark' ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: [
          'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%)',
          'radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)'
        ].join(', '),
        animation: 'backgroundShift 20s ease-in-out infinite',
        pointerEvents: 'none'
      } : {},
      '@keyframes backgroundShift': {
        '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
        '50%': { transform: 'scale(1.1) rotate(2deg)' }
      }
    }}>
      {/* Header */}
      <Box sx={{ position: 'relative', zIndex: 2, p: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Box
              component="img"
              src={wandercallLogo}
              alt="WanderCall"
              sx={{
                height: 50,
                filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'
              }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Become a Provider
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our community and start offering amazing experiences
          </Typography>
        </motion.div>
      </Box>
      
      {/* Back to Home Button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 3 }}>
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
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Registration Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card sx={{
                background: theme.palette.mode === 'dark'
                  ? 'rgba(15, 15, 35, 0.7)'
                  : '#ffffff',
                backdropFilter: 'blur(30px)',
                borderRadius: 4,
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? [
                      '0 25px 50px rgba(0, 0, 0, 0.5)',
                      '0 0 0 1px rgba(255, 255, 255, 0.05)',
                      'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    ].join(', ')
                  : '0 4px 20px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                }
              }}>
                <CardContent sx={{ p: isMobile ? '30px 10px' : 4 }}>
                  {/* Modern Stepper */}
                  <Box sx={{ mb: { xs: 4, md: 6 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      position: 'relative',
                      px: { xs: 2, md: 0 }
                    }}>
                      {/* Progress Line */}
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: { xs: '15%', md: '10%' },
                        right: { xs: '15%', md: '10%' },
                        height: '2px',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 1,
                        zIndex: 0
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeInOut' }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            borderRadius: 1,
                            boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
                          }}
                        />
                      </Box>
                      
                      {steps.map((step, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          style={{ position: 'relative', zIndex: 10 }}
                        >
                          <Box sx={{
                            width: { xs: 36, md: 48 },
                            height: { xs: 36, md: 48 },
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: activeStep >= index 
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : theme.palette.mode === 'dark' ? 'rgba(15, 15, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            border: activeStep === index ? '2px solid #667eea' : theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                            boxShadow: activeStep === index 
                              ? '0 0 20px rgba(102, 126, 234, 0.6), 0 0 40px rgba(102, 126, 234, 0.3)'
                              : 'none',
                            color: activeStep >= index ? 'white' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            transition: 'all 0.3s ease'
                          }}>
                            {step.icon}
                          </Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              position: 'absolute',
                              top: { xs: 45, md: 60 },
                              left: '50%',
                              transform: 'translateX(-50%)',
                              color: activeStep >= index ? '#667eea' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                              fontWeight: activeStep === index ? 600 : 400,
                              whiteSpace: 'nowrap',
                              fontSize: { xs: '0.65rem', md: '0.75rem' }
                            }}
                          >
                            {step.label}
                          </Typography>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>

                  {/* Main Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 style={{
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      textAlign: 'center',
                      margin: '0 0 16px 0',
                      fontWeight: 700,
                      fontSize: window.innerWidth < 600 ? '1.25rem' : window.innerWidth < 900 ? '1.5rem' : '2.5rem'
                    }}>
                      Become a Provider
                    </h3>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: { xs: 0.5, sm: 1 }, 
                      mb: { xs: 4, md: 6 },
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
                        Already have a provider account?
                      </Typography>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          href="#" 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            color: '#667eea',
                            textDecoration: 'none',
                            '&:hover': {
                              color: '#764ba2',
                              textShadow: '0 0 8px rgba(102, 126, 234, 0.6)'
                            }
                          }}
                        >
                          <Login fontSize="small" />
                          Log In
                        </Link>
                      </motion.div>
                    </Box>
                  </motion.div>

                  {/* Form Content with Cinematic Transitions */}
                  <Box sx={{ position: 'relative', overflow: 'visible', pt: 2 }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ position: 'relative', width: '100%' }}
                      >
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>
                  </Box>

                  {/* Navigation Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 6,
                    gap: 2
                  }}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        sx={{
                          minHeight: 48,
                          minWidth: 120,
                          px: 3,
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                          '&:hover': {
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea'
                          },
                          '&:disabled': {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                          }
                        }}
                      >
                        Back
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleNext}
                        disabled={!validateCurrentStep() || (activeStep === steps.length - 1 && !formData.agreeTerms)}
                        endIcon={activeStep === steps.length - 1 ? <Send /> : <ArrowForward />}
                        sx={{
                          minHeight: 48,
                          minWidth: 120,
                          px: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& .MuiButton-endIcon': {
                            marginLeft: 1,
                            display: 'flex',
                            alignItems: 'center'
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                            transform: 'translateY(-2px)'
                          },
                          '&:disabled': {
                            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
                            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)'
                          }
                        }}
                        variant="contained"
                      >
                        {activeStep === steps.length - 1 ? 'Complete' : 'Continue'}
                      </Button>
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card sx={{
                background: theme.palette.mode === 'dark'
                  ? 'rgba(15, 15, 35, 0.6)'
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(25px)',
                borderRadius: 4,
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                boxShadow: theme.palette.mode === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                mb: 3,
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <RocketLaunch sx={{ 
                      fontSize: 80, 
                      color: '#667eea',
                      filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.6))'
                    }} />
                  </motion.div>
                  
                  <Typography 
                    variant="h5"
                    fontWeight={600} 
                    gutterBottom
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      mt: 2,
                      mb: 3,
                      fontSize: { xs: '1.1rem', md: '1.5rem' }
                    }}
                  >
                    Why Partner With Us?
                  </Typography>
                  
                  <Box sx={{ textAlign: 'left' }}>
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle sx={{ 
                              color: '#4ade80',
                              fontSize: 20,
                              filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.6))'
                            }} />
                          </motion.div>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                              fontWeight: 400
                            }}
                          >
                            {benefit}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                    : '#ffffff',
                  border: theme.palette.mode === 'dark' ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'transparent',
                    pointerEvents: 'none'
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <p style={{
                      textAlign: "center", 
                      fontSize: "1.2rem",
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      fontWeight: 600,
                      margin: '0 0 16px 0'
                    }}>
                      Ready to Grow Your Business?
                    </p>
               
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                        textAlign: 'center',
                        lineHeight: 1.6
                      }}
                    >
                      Join our network of premium providers and reach thousands of Experience seekers.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      {/* Email Verification Modal */}
      <AnimatePresence>
        {showEmailVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}
            onClick={() => setShowEmailVerification(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : 'white',
                borderRadius: 16,
                padding: 32,
                maxWidth: 400,
                width: '90%',
                textAlign: 'center'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ marginBottom: 16 }}
              >
                <Email sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </motion.div>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Verify Your Email
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We'll send a verification code to {formData.email}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowEmailVerification(false)}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setVerificationSent(true);
                    setShowEmailVerification(false);
                  }}
                  sx={{ flex: 1 }}
                >
                  Send Code
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ProviderRegistration;