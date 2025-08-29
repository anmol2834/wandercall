import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close, Email, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../services/api';

const OTPModal = ({ open, onClose, email, name, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.verifyOTP({ email, otp });
      setSuccess('Email verified successfully! Logging you in...');
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');

    try {
      await authAPI.sendOTP({ email, name });
      setSuccess('OTP sent successfully!');
      setResendTimer(60);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 0,
          width: { xs: '95%', sm: '100%' },
          maxWidth: { xs: '400px', sm: '600px' }
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', background: 'white', borderRadius: 3 }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            borderRadius: '12px 12px 0 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <IconButton
              onClick={onClose}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                color: 'white',
                zIndex: 10,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <Close />
            </IconButton>

            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: 'white', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Email sx={{ fontSize: 40, color: '#667eea' }} />
              </Box>
              
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                Verify Your Email
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                We've sent a 6-digit code to {email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <AnimatePresence>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}
            </AnimatePresence>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 3, color: '#374151', fontWeight: 500 }}>
                Enter the 6-digit verification code
              </Typography>
              
              <TextField
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                inputProps={{ 
                  maxLength: 6,
                  style: { 
                    textAlign: 'center', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    letterSpacing: '8px',
                    color: '#333333',
                    backgroundColor: '#ffffff'
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#d1d5db',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#9ca3af',
                    opacity: 1
                  }
                }}
                fullWidth
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '16px',
                fontWeight: 600,
                mb: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>
                Didn't receive the code?
              </Typography>
              
              <Button
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || resending}
                startIcon={resending ? <CircularProgress size={16} /> : <Refresh />}
                sx={{ 
                  color: resendTimer > 0 ? '#9ca3af' : '#667eea', 
                  fontWeight: 600,
                  '&:disabled': {
                    color: '#9ca3af'
                  }
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OTPModal;