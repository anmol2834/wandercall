import {
  Box, Container, Typography, Button, Card, CardContent, TextField,
  InputAdornment, IconButton, Link, Divider, useTheme, useMediaQuery,
  Alert, CircularProgress, Fade, Zoom
} from '@mui/material';
import {
  Email, Lock, Visibility, VisibilityOff, ArrowBack, Login as LoginIcon,
  Business, Security, TrendingUp, CheckCircle, PersonAdd
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wandercallLogo from '../../../assets/wandercall-logo2.svg';

const ProviderLogin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Maintenance mode - set to false to enable login
  const [isMaintenanceMode] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/provider-dashboard');
      }, 1500);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Business />, title: 'Manage Experiences', desc: 'Create and manage your offerings' },
    { icon: <TrendingUp />, title: 'Track Performance', desc: 'Monitor bookings and earnings' },
    { icon: <Security />, title: 'Secure Platform', desc: 'Safe and reliable transactions' }
  ];

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none'
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
        '50%': { transform: 'scale(1.05) rotate(1deg)' }
      }
    }}>
      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 3 }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              color: theme.palette.mode === 'dark' ? 'white' : 'black',
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowBack />
          </IconButton>
        </motion.div>
      </Box>

      <Box sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4, lg: 8 },
        position: 'relative',
        zIndex: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          width: '100%',
          maxWidth: '1200px',
          height: { xs: 'auto', lg: '80vh' },
          alignItems: 'center',
          gap: { xs: 0, lg: 6 }
        }}>
          
          {/* Left Side - Login Form */}
          <Box sx={{ 
            flex: { xs: 1, lg: '0 0 45%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxHeight: { xs: 'none', lg: '100%' }
          }}>
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card sx={{
                background: theme.palette.mode === 'dark'
                  ? 'rgba(15, 15, 35, 0.8)'
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(30px)',
                borderRadius: 4,
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 25px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
                }
              }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <motion.img
                          src={wandercallLogo}
                          alt="wandercall"
                          style={{
                            height: 60,
                            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'
                          }}
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Box>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', sm: '2.125rem' },
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}>
                        Welcome Back
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        Sign in to your provider account
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Conditional Content */}
                  {isMaintenanceMode ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          color: 'warning.main'
                        }}>
                          🚧 Under Maintenance
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                          We're currently working on improving the provider portal. 
                          Please check back soon for access to your dashboard.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expected completion: Coming Soon
                        </Typography>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {/* Email Field */}
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : 'rgba(255, 255, 255, 1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)'
                            },
                            '&.Mui-focused': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(255, 255, 255, 1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)'
                            }
                          }
                        }}
                      />

                      {/* Password Field */}
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : 'rgba(255, 255, 255, 1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)'
                            },
                            '&.Mui-focused': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(255, 255, 255, 1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.25)'
                            }
                          }
                        }}
                      />

                      {/* Error/Success Messages */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                              {error}
                            </Alert>
                          </motion.div>
                        )}
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                              {success}
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Login Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={isLoading}
                          startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                          sx={{
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #7c3aed 100%)',
                              boxShadow: '0 12px 35px rgba(99, 102, 241, 0.6)',
                              transform: 'translateY(-2px)'
                            },
                            '&:disabled': {
                              background: 'rgba(99, 102, 241, 0.3)'
                            }
                          }}
                        >
                          {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                      </motion.div>

                      {/* Forgot Password */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Link
                          href="#"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          Forgot your password?
                        </Link>
                      </Box>

                      <Divider sx={{ my: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Don't have an account?
                        </Typography>
                      </Divider>

                      {/* Sign Up Link */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<PersonAdd />}
                          onClick={() => navigate('/become-provider')}
                          sx={{
                            py: 1.5,
                            borderRadius: 3,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                            }
                          }}
                        >
                          Create Provider Account
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Right Side - Features (Desktop Only) */}
          {!isMobile && (
            <Box sx={{ 
              flex: '0 0 55%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pl: 3,
              maxHeight: '100%',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Typography variant="h2" sx={{
                  fontWeight: 800,
                  fontSize: { lg: '2.5rem', xl: '3rem' },
                  mb: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Provider Portal
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.5, fontSize: '1rem' }}>
                  Access your dashboard to manage experiences, track performance, and grow your business with wandercall.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                    >
                      <Card sx={{
                        background: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: theme.palette.mode === 'dark'
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(99, 102, 241, 0.15)'
                        }
                      }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              p: 1.5,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              color: 'white'
                            }}>
                              {feature.icon}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.desc}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderLogin;