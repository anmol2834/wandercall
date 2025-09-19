import { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment, Divider, Alert, Dialog, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Google, ArrowBack, Lock, Email, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SignInSlideshow from '../../components/SignInSlideshow/SignInSlideshow';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordTab, setForgotPasswordTab] = useState(0);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleForgotPasswordInputChange = (field) => (event) => {
    setForgotPasswordData({ ...forgotPasswordData, [field]: event.target.value });
  };

  const handleForgotPasswordTabChange = (event, newValue) => {
    setForgotPasswordTab(newValue);
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    setOtpSent(false);
  };

  const handleSendOTP = async () => {
    if (!forgotPasswordData.email) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    
    try {
      await authAPI.sendPasswordResetOTP({ email: forgotPasswordData.email });
      setOtpSent(true);
      setForgotPasswordSuccess('OTP sent to your email successfully!');
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPasswordWithOldPassword = async () => {
    if (!forgotPasswordData.email || !forgotPasswordData.oldPassword || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      setForgotPasswordError('Please fill all fields');
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotPasswordError('New passwords do not match');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    
    try {
      await authAPI.forgotPassword({
        email: forgotPasswordData.email,
        oldPassword: forgotPasswordData.oldPassword,
        newPassword: forgotPasswordData.newPassword
      });
      setForgotPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        setForgotPasswordOpen(false);
        resetForgotPasswordForm();
      }, 2000);
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPasswordWithOTP = async () => {
    if (!forgotPasswordData.email || !forgotPasswordData.otp || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      setForgotPasswordError('Please fill all fields');
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotPasswordError('New passwords do not match');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    
    try {
      await authAPI.resetPassword({
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp,
        newPassword: forgotPasswordData.newPassword
      });
      setForgotPasswordSuccess('Password reset successfully!');
      setTimeout(() => {
        setForgotPasswordOpen(false);
        resetForgotPasswordForm();
      }, 2000);
    } catch (error) {
      setForgotPasswordError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForgotPasswordForm = () => {
    setForgotPasswordData({
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: ''
    });
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    setOtpSent(false);
    setForgotPasswordTab(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="signin-page-container">
      {/* Left Side - Slideshow */}
      <Box className="signin-slideshow">
        <SignInSlideshow />
      </Box>

      {/* Right Side - Form */}
      <Box className="signin-form-section">
        <motion.div
          className="signin-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Back Button */}
          <IconButton 
            className="signin-back-button"
            onClick={() => navigate('/')}
          >
            <ArrowBack />
          </IconButton>
          
          {/* Header */}
          <motion.div
            className="signin-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography variant="h3" className="signin-title">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="signin-subtitle">
              Sign in to continue your adventure
            </Typography>
          </motion.div>

          {/* Social Login */}
          <motion.div
            className="social-login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button className="social-btn google-btn" startIcon={<Google />}>
              Continue with Google
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Divider className="signin-divider">
              <Typography variant="body2" className="divider-text">
                or continue with email
              </Typography>
            </Divider>
          </motion.div>

          {/* Form */}
          <motion.form
            className="signin-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className="signin-input"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              className="signin-input"
              variant="outlined"
              InputProps={{
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
            />

            <Box className="form-options">
              <Typography 
                variant="body2" 
                className="forgot-password"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="signin-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="signin-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Typography variant="body2" className="signup-link">
              Don't have an account? 
              <span className="link-text" onClick={() => navigate('/signup')}>
                Sign Up
              </span>
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
      
      {/* Mobile Footer */}
      <Box className="mobile-footer">
        <Typography variant="body2" className="copyright-text">
          © 2024 wandercall. All rights reserved.
        </Typography>
      </Box>

      {/* Forgot Password Modal */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={() => {
          setForgotPasswordOpen(false);
          resetForgotPasswordForm();
        }}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: '95vw', sm: '500px', md: '550px' },
            maxWidth: 'none',
            borderRadius: { xs: 2, sm: 4 },
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: 'none',
            overflow: 'hidden'
          }
        }}
      >
        {/* Header with gradient */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: { xs: 2, sm: 3 },
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Lock sx={{ fontSize: { xs: 20, sm: 24 } }} />
              <Typography variant="h6" sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
                fontWeight: 600 
              }}>
                Reset Password
              </Typography>
            </Box>
            <IconButton 
              onClick={() => {
                setForgotPasswordOpen(false);
                resetForgotPasswordForm();
              }}
              sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }}
            >
              <Close sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ 
            opacity: 0.9, 
            mt: 0.5,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Choose your preferred method to reset your password
          </Typography>
        </Box>
        
        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Method Selection Tabs */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: { xs: 2, sm: 3 },
            p: 0.5,
            backgroundColor: '#f1f5f9',
            borderRadius: 2
          }}>
            <Button
              fullWidth
              variant={forgotPasswordTab === 0 ? 'contained' : 'text'}
              onClick={() => handleForgotPasswordTabChange(null, 0)}
              startIcon={<Lock sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: 'none',
                ...(forgotPasswordTab === 0 ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(102, 110, 234, 0.4)'
                } : {
                  color: '#64748b',
                  '&:hover': { backgroundColor: 'rgba(100, 116, 139, 0.1)' }
                })
              }}
            >
              Current Password
            </Button>
            <Button
              fullWidth
              variant={forgotPasswordTab === 1 ? 'contained' : 'text'}
              onClick={() => handleForgotPasswordTabChange(null, 1)}
              startIcon={<Email sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: 'none',
                ...(forgotPasswordTab === 1 ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(102, 110, 234, 0.4)'
                } : {
                  color: '#64748b',
                  '&:hover': { backgroundColor: 'rgba(100, 116, 139, 0.1)' }
                })
              }}
            >
              Email OTP
            </Button>
          </Box>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {forgotPasswordError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {forgotPasswordError}
                </Alert>
              </motion.div>
            )}
            
            {forgotPasswordSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {forgotPasswordSuccess}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {forgotPasswordTab === 0 && (
              <motion.div
                key="old-password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  border: '1px solid #e2e8f0'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    color: '#475569',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    fontWeight: 600
                  }}>
                    Reset using current password
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordInputChange('email')}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: '#64748b',
                          '&.Mui-focused': { color: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={forgotPasswordData.oldPassword}
                      onChange={handleForgotPasswordInputChange('oldPassword')}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: '#64748b',
                          '&.Mui-focused': { color: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={forgotPasswordData.newPassword}
                      onChange={handleForgotPasswordInputChange('newPassword')}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: '#64748b',
                          '&.Mui-focused': { color: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={forgotPasswordData.confirmPassword}
                      onChange={handleForgotPasswordInputChange('confirmPassword')}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: '#64748b',
                          '&.Mui-focused': { color: '#667eea' }
                        }
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleResetPasswordWithOldPassword}
                      disabled={forgotPasswordLoading}
                      startIcon={forgotPasswordLoading ? <CircularProgress size={16} /> : <Lock />}
                      sx={{ 
                        py: { xs: 1.2, sm: 1.5 },
                        mt: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                        }
                      }}
                    >
                      {forgotPasswordLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}

            {forgotPasswordTab === 1 && (
              <motion.div
                key="otp-method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  border: '1px solid #e2e8f0'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    color: '#475569',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    fontWeight: 600
                  }}>
                    Reset using email verification
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordInputChange('email')}
                      variant="outlined"
                      disabled={otpSent}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          '& fieldset': { borderColor: '#cbd5e1' },
                          '&:hover fieldset': { borderColor: '#94a3b8' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: '#64748b',
                          '&.Mui-focused': { color: '#667eea' }
                        }
                      }}
                    />
                    
                    {!otpSent ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleSendOTP}
                        disabled={forgotPasswordLoading}
                        startIcon={forgotPasswordLoading ? <CircularProgress size={16} /> : <Email />}
                        sx={{ 
                          py: { xs: 1.2, sm: 1.5 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          borderRadius: 2,
                          textTransform: 'none',
                          borderColor: '#667eea',
                          color: '#667eea',
                          '&:hover': {
                            borderColor: '#5a6fd8',
                            backgroundColor: 'rgba(102, 110, 234, 0.04)'
                          }
                        }}
                      >
                        {forgotPasswordLoading ? 'Sending...' : 'Send OTP'}
                      </Button>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          label="Enter OTP"
                          value={forgotPasswordData.otp}
                          onChange={handleForgotPasswordInputChange('otp')}
                          variant="outlined"
                          inputProps={{ maxLength: 6 }}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              borderRadius: 2,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '& fieldset': { borderColor: '#cbd5e1' },
                              '&:hover fieldset': { borderColor: '#94a3b8' },
                              '&.Mui-focused fieldset': { borderColor: '#667eea' }
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              color: '#64748b',
                              '&.Mui-focused': { color: '#667eea' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="New Password"
                          type="password"
                          value={forgotPasswordData.newPassword}
                          onChange={handleForgotPasswordInputChange('newPassword')}
                          variant="outlined"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              borderRadius: 2,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '& fieldset': { borderColor: '#cbd5e1' },
                              '&:hover fieldset': { borderColor: '#94a3b8' },
                              '&.Mui-focused fieldset': { borderColor: '#667eea' }
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              color: '#64748b',
                              '&.Mui-focused': { color: '#667eea' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type="password"
                          value={forgotPasswordData.confirmPassword}
                          onChange={handleForgotPasswordInputChange('confirmPassword')}
                          variant="outlined"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              borderRadius: 2,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '& fieldset': { borderColor: '#cbd5e1' },
                              '&:hover fieldset': { borderColor: '#94a3b8' },
                              '&.Mui-focused fieldset': { borderColor: '#667eea' }
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              color: '#64748b',
                              '&.Mui-focused': { color: '#667eea' }
                            }
                          }}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleResetPasswordWithOTP}
                          disabled={forgotPasswordLoading}
                          startIcon={forgotPasswordLoading ? <CircularProgress size={16} /> : <Lock />}
                          sx={{ 
                            py: { xs: 1.2, sm: 1.5 },
                            mt: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                            }
                          }}
                        >
                          {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                        <Button
                          fullWidth
                          variant="text"
                          onClick={() => {
                            setOtpSent(false);
                            setForgotPasswordData({ ...forgotPasswordData, otp: '' });
                          }}
                          sx={{ 
                            mt: 1, 
                            textTransform: 'none', 
                            color: '#667eea',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                          Resend OTP
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Dialog>
    </Box>
  );
};

export default SignIn;