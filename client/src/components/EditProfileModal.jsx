import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Box, Typography, IconButton, InputAdornment, Alert, Paper, CircularProgress,
  Grid, useMediaQuery, Tabs, Tab, Divider
} from '@mui/material';
import {
  Close, Phone, Lock, Visibility, VisibilityOff, Send, CheckCircle,
  Person, Email, Security, AlternateEmail
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { userAPI } from '../services/api';

const EditProfileModal = ({ open, onClose, user, onUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Phone State
  const [phoneData, setPhoneData] = useState({
    phone: user?.phone || ''
  });

  // Password Update State
  const [passwordData, setPasswordData] = useState({
    method: 'current', // 'current' or 'email'
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailOtp: '',
    emailOtpSent: false,
    showCurrent: false,
    showNew: false,
    showConfirm: false
  });

  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    return /^[+]?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleUpdatePhone = async () => {
    if (!validatePhone(phoneData.phone)) {
      setErrors({ phone: 'Please enter a valid phone number' });
      return;
    }

    setLoading(true);
    try {
      const updateData = { phone: phoneData.phone };
      await onUpdate(updateData);
      setErrors({});
      alert('Phone number updated successfully!');
    } catch (error) {
      setErrors({ phone: error.response?.data?.message || 'Failed to update phone number' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOTP = async () => {
    setLoading(true);
    try {
      await userAPI.sendEmailOTP();
      setPasswordData(prev => ({ ...prev, emailOtpSent: true }));
      setErrors({});
    } catch (error) {
      setErrors({ emailOtp: error.response?.data?.message || 'Failed to send email OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updateData = { ...basicInfo };
      if (phoneData.isVerified && phoneData.phone) {
        updateData.phone = phoneData.phone;
      }
      
      await onUpdate(updateData);
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword(passwordData.newPassword)) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (passwordData.method === 'current') {
      if (!passwordData.currentPassword) {
        setErrors({ currentPassword: 'Current password is required' });
        return;
      }
    } else {
      if (!passwordData.emailOtp) {
        setErrors({ emailOtp: 'Email OTP is required' });
        return;
      }
    }

    setLoading(true);
    try {
      if (passwordData.method === 'current') {
        await userAPI.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      } else {
        await userAPI.updatePasswordWithEmail(passwordData.emailOtp, passwordData.newPassword);
      }
      
      setPasswordData({
        method: 'current',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailOtp: '',
        emailOtpSent: false,
        showCurrent: false,
        showNew: false,
        showConfirm: false
      });
      setErrors({});
      alert('Password updated successfully!');
    } catch (error) {
      const errorField = passwordData.method === 'current' ? 'currentPassword' : 'emailOtp';
      setErrors({ [errorField]: error.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: isMobile ? '1rem' : '1.1rem' }}>
        <Person color="primary" />
        Basic Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={basicInfo.name}
            onChange={(e) => setBasicInfo(prev => ({ ...prev, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            value={basicInfo.email}
            disabled
            variant="outlined"
            helperText="Email cannot be changed for security reasons"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPhoneUpdate = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: isMobile ? '1rem' : '1.1rem' }}>
        <Phone color="primary" />
        Phone Number
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneData.phone}
            onChange={(e) => setPhoneData(prev => ({ ...prev, phone: e.target.value }))}
            error={!!errors.phone}
            helperText={errors.phone || 'Enter your phone number with country code'}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdatePhone}
            disabled={loading || !phoneData.phone}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Updating...' : 'Save Phone Number'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPasswordUpdate = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: isMobile ? '1rem' : '1.1rem' }}>
        <Security color="primary" />
        Update Password
      </Typography>

      {/* Method Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>Choose verification method:</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={passwordData.method === 'current' ? 'contained' : 'outlined'}
            onClick={() => setPasswordData(prev => ({ ...prev, method: 'current' }))}
            startIcon={<Lock />}
            sx={{ flex: 1, fontSize: isMobile ? '0.7rem' : '0.8rem' }}
          >
            Current Password
          </Button>
          <Button
            variant={passwordData.method === 'email' ? 'contained' : 'outlined'}
            onClick={() => setPasswordData(prev => ({ ...prev, method: 'email' }))}
            startIcon={<AlternateEmail />}
            sx={{ flex: 1, fontSize: isMobile ? '0.7rem' : '0.8rem' }}
          >
            Email OTP
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Current Password Method */}
        {passwordData.method === 'current' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type={passwordData.showCurrent ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setPasswordData(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                      edge="end"
                    >
                      {passwordData.showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        )}

        {/* Email OTP Method */}
        {passwordData.method === 'email' && (
          <Grid item xs={12}>
            {!passwordData.emailOtpSent ? (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSendEmailOTP}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Sending...' : 'Send Email OTP'}
              </Button>
            ) : (
              <TextField
                fullWidth
                label="Email OTP"
                value={passwordData.emailOtp}
                onChange={(e) => setPasswordData(prev => ({ ...prev, emailOtp: e.target.value }))}
                error={!!errors.emailOtp}
                helperText={errors.emailOtp || 'Check your email for OTP'}
                variant="outlined"
                inputProps={{ maxLength: 6 }}
              />
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            type={passwordData.showNew ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            error={!!errors.newPassword}
            helperText={errors.newPassword || 'At least 6 characters'}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordData(prev => ({ ...prev, showNew: !prev.showNew }))}
                    edge="end"
                  >
                    {passwordData.showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            type={passwordData.showConfirm ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordData(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                    edge="end"
                  >
                    {passwordData.showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdatePassword}
            disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
            startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth={isMobile}
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: isMobile ? '95vw' : '450px',
          maxWidth: isMobile ? '95vw' : '450px',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.9) 100%)'
            : '#ffffff',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
            Edit Profile
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: isMobile ? '0.65rem' : '0.8rem',
              minHeight: isMobile ? 44 : 52,
              py: isMobile ? 0.8 : 1.2
            }
          }}
        >
          <Tab icon={<Person />} label="Basic Info" />
          <Tab icon={<Phone />} label="Phone" />
          <Tab icon={<Lock />} label="Password" />
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && renderBasicInfo()}
            {activeTab === 1 && renderPhoneUpdate()}
            {activeTab === 2 && renderPasswordUpdate()}
          </motion.div>
        </AnimatePresence>

        {errors.general && (
          <Alert severity="error" sx={{ m: 3 }}>
            {errors.general}
          </Alert>
        )}
      </DialogContent>

      {activeTab === 0 && (
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={loading || !basicInfo.name.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EditProfileModal;