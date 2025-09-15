import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { AccountBalance, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

const RefundModal = ({ open, onClose, onConfirm, ticketData, loading }) => {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { user } = useAuth();
  const hasStoredUpiId = user?.upiId;

  // Auto-fill UPI ID when modal opens
  useEffect(() => {
    if (open && hasStoredUpiId) {
      setUpiId(user.upiId);
    } else if (open && !hasStoredUpiId) {
      setUpiId('');
    }
  }, [open, hasStoredUpiId, user?.upiId]);

  const validateUpiId = (value) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(value);
  };

  const handleSubmit = () => {
    if (!upiId.trim()) {
      setError('UPI ID is required');
      return;
    }
    
    if (!validateUpiId(upiId)) {
      setError('Please enter a valid UPI ID (e.g., user@paytm)');
      return;
    }

    setError('');
    onConfirm(upiId);
  };

  const handleClose = () => {
    setUpiId('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: isDark 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
          backdropFilter: 'blur(10px)',
          border: isDark 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          color: isDark ? 'white' : 'black',
          margin: { xs: '10px', sm: '32px' },
          width: { xs: '100%', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance sx={{ color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? 'white' : 'black' }}>
            Request Refund
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: '10px 10px', pb: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
              border: isDark ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.2)',
              color: isDark ? 'white' : 'black',
              '& .MuiAlert-icon': {
                color: '#6366f1'
              }
            }}
            icon={<Warning />}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: isDark ? 'white' : 'black' }}>
              Refund Process
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}>
              • Processing time: 5-7 business days<br/>
              • Amount: ₹{ticketData?.totalPrice || 0}<br/>
              • Your booking will be cancelled immediately
            </Typography>
          </Alert>

          <TextField
            fullWidth
            label="UPI ID"
            placeholder={hasStoredUpiId ? "Saved UPI ID" : "Enter your UPI ID (e.g., user@paytm)"}
            value={upiId}
            onChange={(e) => {
              if (!hasStoredUpiId) {
                setUpiId(e.target.value);
                if (error) setError('');
              }
            }}
            error={!!error}
            helperText={hasStoredUpiId 
              ? 'Using your saved UPI ID for refund' 
              : (error || 'Enter the UPI ID where you want to receive the refund')
            }
            InputProps={{
              readOnly: Boolean(hasStoredUpiId),
              startAdornment: (
                <Box sx={{ mr: 1, color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}>
                  @
                </Box>
              )
            }}
            sx={{ 
              mb: 2,
              '& .MuiInputLabel-root': {
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                '&.Mui-focused': {
                  color: '#6366f1'
                }
              },
              '& .MuiOutlinedInput-root': {
                color: isDark ? 'white' : 'black',
                backgroundColor: hasStoredUpiId 
                  ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                  : (isDark ? 'transparent' : 'rgba(255, 255, 255, 0.8)'),
                '& fieldset': {
                  borderColor: hasStoredUpiId 
                    ? (isDark ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)')
                    : (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)')
                },
                '&:hover fieldset': {
                  borderColor: hasStoredUpiId 
                    ? (isDark ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.5)')
                    : (isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)')
                },
                '&.Mui-focused fieldset': {
                  borderColor: hasStoredUpiId ? '#22c55e' : '#6366f1'
                }
              },
              '& .MuiFormHelperText-root': {
                color: error ? '#ef4444' : (isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)')
              }
            }}

          />

          <Box sx={{ 
            p: 2, 
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', 
            borderRadius: 2,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: isDark ? 'white' : 'black' }}>
              Booking Details:
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}>
              Ticket: {ticketData?.ticketNumber}<br/>
              Experience: {ticketData?.productTitle}<br/>
              Amount: ₹{ticketData?.totalPrice}
            </Typography>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ 
            borderRadius: 2,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
            }
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !upiId.trim()}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
          sx={{ 
            borderRadius: 2,
            minWidth: 120,
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #4f46e5, #7c3aed)'
            },
            '&:disabled': {
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
              color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)'
            }
          }}
        >
          {loading ? 'Processing...' : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundModal;