import {
  Box, Container, Typography, Button, Card, CardContent, Grid, TextField,
  Stepper, Step, StepLabel, Select, MenuItem, FormControl, InputLabel,
  Checkbox, FormControlLabel, InputAdornment, IconButton, LinearProgress, Link, Divider
} from '@mui/material';
import {
  Business, Person, Email, Phone, Category, Visibility, VisibilityOff,
  CheckCircle, Login, ArrowBack, ArrowForward, Send, Security, Verified, RocketLaunch
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    businessEmail: '',
    phoneNumber: '',
    countryCode: '+91',
    serviceType: '',
    serviceDescription: '',
    verificationCode: '',
    password: '',
    agreeTerms: false
  });

  const steps = ['Business Info', 'Service Details', 'Verification', 'Confirmation'];
  
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

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field, value) => {
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12}>
              <motion.div
                whileHover={{ y: -2 }}
                whileFocus={{ y: -4 }}
              >
                <TextField
                  fullWidth
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: { xs: 18, md: 20 } }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      padding: { xs: '8px 14px', md: '12px 14px' }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      '&.Mui-focused': {
                        color: '#667eea'
                      }
                    },
                    '&:focus-within .MuiInputAdornment-root .MuiSvgIcon-root': {
                      color: '#667eea'
                    }
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                whileHover={{ y: -2 }}
                whileFocus={{ y: -4 }}
              >
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: { xs: 18, md: 20 } }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      padding: { xs: '8px 14px', md: '12px 14px' }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      '&.Mui-focused': {
                        color: '#667eea'
                      }
                    },
                    '&:focus-within .MuiInputAdornment-root .MuiSvgIcon-root': {
                      color: '#667eea'
                    }
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                whileHover={{ y: -2 }}
                whileFocus={{ y: -4 }}
              >
                <TextField
                  fullWidth
                  label="Business Email"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', fontSize: { xs: 18, md: 20 } }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      padding: { xs: '8px 14px', md: '12px 14px' }
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      '&.Mui-focused': {
                        color: '#667eea'
                      }
                    },
                    '&:focus-within .MuiInputAdornment-root .MuiSvgIcon-root': {
                      color: '#667eea'
                    }
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={formData.countryCode}
                      onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    >
                      <MenuItem value="+91">+91</MenuItem>
                      <MenuItem value="+1">+1</MenuItem>
                      <MenuItem value="+44">+44</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: theme.palette.mode === 'dark' ? 'white' : 'black'
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-focused': {
                          color: '#667eea'
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Category color="primary" />
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
                  label="Service Description"
                  multiline
                  rows={4}
                  value={formData.serviceDescription}
                  onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.mode === 'dark' ? 'white' : 'black'
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-focused': {
                        color: '#667eea'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We've sent a verification code to {formData.businessEmail}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label="Verification Code"
                    value={formData.verificationCode}
                    onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                    variant="outlined"
                    size="small"
                    inputProps={{ maxLength: 6 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Security sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputBase-input': {
                        color: theme.palette.mode === 'dark' ? 'white' : 'black'
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        '&.Mui-focused': {
                          color: '#667eea'
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Create Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.mode === 'dark' ? 'white' : 'black'
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      '&.Mui-focused': {
                        color: '#667eea'
                      }
                    }
                  }}
                />
                {formData.password && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: passwordStrength < 50 ? '#f44336' : passwordStrength < 75 ? '#ff9800' : '#4caf50'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Password strength: {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </motion.div>
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
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Contact Person: {formData.contactPerson}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Email: {formData.businessEmail}</Typography>
                
                <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' }} />
                
                <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>Service Details</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Phone: {formData.countryCode} {formData.phoneNumber}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Service Type: {formData.serviceType}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>Description: {formData.serviceDescription}</Typography>
              </CardContent>
            </Card>
            
            <FormControlLabel
              sx={{ mb: { xs: 6, sm: 3 } }}
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link href="#" underline="hover">Terms and Conditions</Link>
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
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : '#ffffff',
      '&::before': {
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
      },
      '@keyframes backgroundShift': {
        '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
        '50%': { transform: 'scale(1.1) rotate(2deg)' }
      }
    }}>
      {/* Back to Home Button */}
      <Box sx={{ position: 'relative', zIndex: 2, p: 2 }}>
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
                <CardContent sx={{ p: 4 }}>
                  {/* Modern Stepper */}
                  <Box sx={{ mb: { xs: 4, md: 6 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
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
                      
                      {[Business, Category, Security, CheckCircle].map((Icon, index) => (
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
                            <Icon sx={{ fontSize: { xs: 16, md: 20 } }} />
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
                            {steps[index]}
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
                        disabled={activeStep === 3 && !formData.agreeTerms}
                        endIcon={
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {activeStep === 3 ? <Send /> : <ArrowForward />}
                          </motion.div>
                        }
                        variant="contained"
                        sx={{
                          minHeight: 48,
                          minWidth: 120,
                          px: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
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
                      >
                        {activeStep === 3 ? 'Complete Registration' : 'Continue'}
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
                    variant={{ xs: 'h6', md: 'h5' }}
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
    </Box>
  );
};

export default ProviderRegistration;