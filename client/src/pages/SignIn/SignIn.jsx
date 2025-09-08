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
  const [resendTimer, setResendTimer] = useState(0);

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
    // Keep OTP sent state and timer when switching tabs
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
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
    setResendTimer(0);
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
      <Box className="signin-slideshow">
        <SignInSlideshow />
      </Box>

      <Box className="signin-form-section">
        <motion.div
          className="signin-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <IconButton 
            className="signin-back-button"
            onClick={() => navigate('/')}
          >
            <ArrowBack />
          </IconButton>
          
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
                      sx={{ color: '#666' }}
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
      
      <Box className="mobile-footer">
        <Typography variant="body2" className="copyright-text">
          © 2024 WanderCall. All rights reserved.
        </Typography>
      </Box>

      <Dialog 
        open={forgotPasswordOpen} 
        onClose={() => {
          setForgotPasswordOpen(false);
          resetForgotPasswordForm();
        }}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: '99vw', sm: '480px', md: '520px' },
            maxWidth: 'none',
            maxHeight: { xs: '95vh', sm: '90vh' },
            borderRadius: { xs: 3, sm: 4 },
            background: '#ffffff',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            border: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            margin: '10px'
          }
        }}
      >
        <Box sx={{
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          p: { xs: 3, sm: 3 },
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: { xs: 30, sm: 36 }, 
                height: { xs: 32, sm: 36 }, 
                borderRadius: 2, 
                background: '#f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Lock sx={{ fontSize: { xs: 16, sm: 18 }, color: '#64748b' }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontSize: { xs: '1rem', sm: '1.2rem' }, 
                fontWeight: 600,
                color: '#1e293b'
              }}>
                Reset Password
              </Typography>
            </Box>
            <IconButton 
              onClick={() => {
                setForgotPasswordOpen(false);
                resetForgotPasswordForm();
              }}
              sx={{ color: '#64748b', p: { xs: 0.5, sm: 1 }, '&:hover': { backgroundColor: '#f8fafc' } }}
            >
              <Close sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ 
            color: '#64748b',
            mt: 1,
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}>
            Choose your preferred method to reset your password
          </Typography>
        </Box>
        
        <Box sx={{ p: { xs: 2, sm: 3 }, overflow: 'auto', flex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 }, 
            mb: { xs: 2, sm: 3 },
            p: { xs: 0.3, sm: 0.5 },
            backgroundColor: '#f8fafc',
            borderRadius: { xs: 1.5, sm: 2 },
            border: '1px solid #e2e8f0'
          }}>
            <Button
              fullWidth
              variant={forgotPasswordTab === 0 ? 'contained' : 'text'}
              onClick={() => handleForgotPasswordTabChange(null, 0)}
              startIcon={<Lock sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              sx={{
                py: { xs: 0.8, sm: 1.2 },
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 500,
                borderRadius: { xs: 1, sm: 1.5 },
                textTransform: 'none',
                minHeight: { xs: 32, sm: 40 },
                ...(forgotPasswordTab === 0 ? {
                  background: '#1e293b',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(30, 41, 59, 0.15)',
                  '&:hover': { background: '#334155' }
                } : {
                  color: '#64748b',
                  background: 'transparent',
                  '&:hover': { backgroundColor: '#f1f5f9', color: '#475569' }
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
                py: { xs: 0.8, sm: 1.2 },
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 500,
                borderRadius: { xs: 1, sm: 1.5 },
                textTransform: 'none',
                minHeight: { xs: 32, sm: 40 },
                ...(forgotPasswordTab === 1 ? {
                  background: '#1e293b',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(30, 41, 59, 0.15)',
                  '&:hover': { background: '#334155' }
                } : {
                  color: '#64748b',
                  background: 'transparent',
                  '&:hover': { backgroundColor: '#f1f5f9', color: '#475569' }
                })
              }}
            >
              Email OTP
            </Button>
          </Box>

          <AnimatePresence mode="wait">
            {forgotPasswordError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {forgotPasswordSuccess}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {forgotPasswordTab === 0 && (
              <motion.div key="old-password" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Box sx={{ background: '#ffffff', borderRadius: { xs: 2, sm: 3 }, p: { xs: 2, sm: 3 }, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                  <Typography variant="subtitle2" sx={{ mb: { xs: 1.5, sm: 2 }, color: '#1e293b', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>Reset using current password</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.2, sm: 1.5 } }}>
                    <TextField fullWidth label="Email Address" type="email" value={forgotPasswordData.email} onChange={handleForgotPasswordInputChange('email')} variant="outlined" size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc', borderRadius: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.9rem' }, '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#1e293b', borderWidth: 2 } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#64748b', '&.Mui-focused': { color: '#1e293b' } }, '& input': { color: '#1e293b' } }} />
                    <TextField fullWidth label="Current Password" type="password" value={forgotPasswordData.oldPassword} onChange={handleForgotPasswordInputChange('oldPassword')} variant="outlined" size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', color: '#1a1a1a', fontSize: { xs: '0.875rem', sm: '1rem' } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' }, color: '#64748b' }, '& input': { color: '#1a1a1a' } }} />
                    <TextField fullWidth label="New Password" type="password" value={forgotPasswordData.newPassword} onChange={handleForgotPasswordInputChange('newPassword')} variant="outlined" size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', color: '#1a1a1a', fontSize: { xs: '0.875rem', sm: '1rem' } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' }, color: '#64748b' }, '& input': { color: '#1a1a1a' } }} />
                    <TextField fullWidth label="Confirm New Password" type="password" value={forgotPasswordData.confirmPassword} onChange={handleForgotPasswordInputChange('confirmPassword')} variant="outlined" size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', color: '#1a1a1a', fontSize: { xs: '0.875rem', sm: '1rem' } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.875rem', sm: '1rem' }, color: '#64748b' }, '& input': { color: '#1a1a1a' } }} />
                    <Button fullWidth variant="contained" onClick={handleResetPasswordWithOldPassword} disabled={forgotPasswordLoading} startIcon={forgotPasswordLoading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <Lock sx={{ fontSize: { xs: 14, sm: 16 } }} />} sx={{ py: { xs: 1, sm: 1.3 }, mt: { xs: 1.5, sm: 2 }, borderRadius: { xs: 1.5, sm: 2 }, textTransform: 'none', fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: 500, background: '#1e293b', '&:hover': { background: '#334155' }, '&:disabled': { background: '#94a3b8' } }}>
                      {forgotPasswordLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}

            {forgotPasswordTab === 1 && (
              <motion.div key="otp-method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Box sx={{ background: '#ffffff', borderRadius: { xs: 2, sm: 3 }, p: { xs: 2, sm: 3 }, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                  <Typography variant="subtitle2" sx={{ mb: { xs: 1.5, sm: 2 }, color: '#1e293b', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>Reset using email verification</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.2, sm: 1.5 } }}>
                    <TextField fullWidth label="Email Address" type="email" value={forgotPasswordData.email} onChange={handleForgotPasswordInputChange('email')} variant="outlined" disabled={otpSent} size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc', borderRadius: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.9rem' }, '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#1e293b', borderWidth: 2 }, '&.Mui-disabled': { backgroundColor: '#f1f5f9' } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#64748b', '&.Mui-focused': { color: '#1e293b' } }, '& input': { color: '#1e293b', '&.Mui-disabled': { color: '#999', '-webkit-text-fill-color': '#999' } } }} />
                    {!otpSent ? (
                      <Button fullWidth variant="outlined" onClick={handleSendOTP} disabled={forgotPasswordLoading} sx={{ py: { xs: 1, sm: 1.3 }, borderRadius: { xs: 1.5, sm: 2 }, textTransform: 'none', borderColor: '#1e293b', color: forgotPasswordLoading ? '#94a3b8' : '#1e293b', fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: 500, minHeight: { xs: 36, sm: 44 }, '&:hover': { borderColor: '#334155', backgroundColor: '#f8fafc' } }}>
                        {forgotPasswordLoading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={14} sx={{ color: '#1e293b' }} />
                            <span>Sending OTP...</span>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Email sx={{ fontSize: { xs: 16, sm: 18 } }} />
                            <span>Send OTP</span>
                          </Box>
                        )}
                      </Button>
                    ) : (
                      <>
                        <TextField fullWidth label="Enter OTP" value={forgotPasswordData.otp} onChange={handleForgotPasswordInputChange('otp')} variant="outlined" inputProps={{ maxLength: 6 }} size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc', borderRadius: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.9rem' }, '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#1e293b', borderWidth: 2 } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#64748b', '&.Mui-focused': { color: '#1e293b' } }, '& input': { color: '#1e293b' } }} />
                        <TextField fullWidth label="New Password" type="password" value={forgotPasswordData.newPassword} onChange={handleForgotPasswordInputChange('newPassword')} variant="outlined" size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc', borderRadius: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.9rem' }, '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#1e293b', borderWidth: 2 } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#64748b', '&.Mui-focused': { color: '#1e293b' } }, '& input': { color: '#1e293b' } }} />
                        <TextField fullWidth label="Confirm New Password" type="password" value={forgotPasswordData.confirmPassword} onChange={handleForgotPasswordInputChange('confirmPassword')} variant="outlined" size={window.innerWidth < 600 ? 'small' : 'medium'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc', borderRadius: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.9rem' }, '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#1e293b', borderWidth: 2 } }, '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#64748b', '&.Mui-focused': { color: '#1e293b' } }, '& input': { color: '#1e293b' } }} />
                        <Button fullWidth variant="contained" onClick={handleResetPasswordWithOTP} disabled={forgotPasswordLoading} startIcon={forgotPasswordLoading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <Lock sx={{ fontSize: { xs: 14, sm: 16 } }} />} sx={{ py: { xs: 1, sm: 1.3 }, mt: { xs: 1.5, sm: 2 }, borderRadius: { xs: 1.5, sm: 2 }, textTransform: 'none', fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: 500, background: '#1e293b', '&:hover': { background: '#334155' }, '&:disabled': { background: '#94a3b8' } }}>
                          {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                        <Button fullWidth variant="text" onClick={() => { setOtpSent(false); setForgotPasswordData({ ...forgotPasswordData, otp: '' }); setResendTimer(0); }} disabled={resendTimer > 0} sx={{ mt: { xs: 0.5, sm: 1 }, textTransform: 'none', color: resendTimer > 0 ? '#94a3b8' : '#64748b', fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: 500, '&:hover': { backgroundColor: '#f8fafc', color: '#1e293b' } }}>
                          {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
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