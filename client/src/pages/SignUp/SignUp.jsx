import { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment, Divider, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { Visibility, VisibilityOff, Google, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SignUpSlideshow from '../../components/SignUpSlideshow/SignUpSlideshow';
import OTPModal from '../../components/OTPModal/OTPModal';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (field) => (event) => {
    const value = field === 'agreeToTerms' ? event.target.checked : event.target.value;
    setFormData({ ...formData, [field]: value });
  };



  const handleEmailVerified = async () => {
    setEmailVerified(true);
    setShowOTPModal(false);
    
    // Auto-login after email verification
    try {
      const response = await authAPI.register({ email: formData.email });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Auto-login failed:', error);
      navigate('/signin');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }
    
    if (!emailVerified) {
      // Send OTP and show modal
      try {
        await authAPI.sendOTP({ 
          email: formData.email, 
          name: `${formData.firstName} ${formData.lastName}`,
          password: formData.password,
          agreedToTerms: formData.agreeToTerms
        });
        setShowOTPModal(true);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to send OTP');
      }
      setLoading(false);
      return;
    }
    
    // Proceed with registration if email is verified
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        agreedToTerms: formData.agreeToTerms
      };
      
      const response = await authAPI.register(userData);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="signup-page-container">
      {/* Left Side - Slideshow */}
      <Box className="signup-slideshow">
        <SignUpSlideshow />
      </Box>

      {/* Right Side - Form */}
      <Box className="signup-form-section">
        <motion.div
          className="signup-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Back Button */}
          <IconButton 
            className="signup-back-button"
            onClick={() => navigate('/')}
          >
            <ArrowBack />
          </IconButton>
          
          {/* Header */}
          <motion.div
            className="signup-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography variant="h3" className="signup-title">
              Join WanderCall
            </Typography>
            <Typography variant="body1" className="signup-subtitle">
              Create your account and start exploring
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
            
            <Box className="signin-link-container">
              <Typography variant="body2" className="signin-link">
                Already have an account? 
                <span className="link-text" onClick={() => navigate('/signin')}>
                  Sign In
                </span>
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Divider className="signup-divider">
              <Typography variant="body2" className="divider-text">
                or create with email
              </Typography>
            </Divider>
          </motion.div>

          {/* Form */}
          <motion.form
            className="signup-form"
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
            <Box className="name-row">
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                className="signup-input name-input"
                variant="outlined"
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                className="signup-input name-input"
                variant="outlined"
              />
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className="signup-input"
              variant="outlined"
              InputProps={{
                endAdornment: emailVerified && (
                  <InputAdornment position="end">
                    <Typography variant="caption" sx={{ color: 'green', fontWeight: 600 }}>
                      ✓ Verified
                    </Typography>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              className="signup-input"
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

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              className="signup-input"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#666' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange('agreeToTerms')}
                  className="terms-checkbox"
                />
              }
              label={
                <Typography variant="body2" className="terms-text">
                  I agree to the{' '}
                  <span 
                    className="link-text" 
                    onClick={() => navigate('/terms-and-conditions')}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Terms of Service
                  </span>
                  {' '}and Privacy Policy
                </Typography>
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="signup-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.form>


        </motion.div>
      </Box>

      {/* Mobile Footer */}
      <Box className="mobile-footer">
        <Typography variant="body2" className="copyright-text">
          © 2024 WanderCall. All rights reserved.
        </Typography>
      </Box>

      {/* OTP Modal */}
      <OTPModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={formData.email}
        name={`${formData.firstName} ${formData.lastName}`}
        onVerified={handleEmailVerified}
      />
    </Box>
  );
};

export default SignUp;