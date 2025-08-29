import { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment, Divider, Alert } from '@mui/material';
import { Visibility, VisibilityOff, Google, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
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

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
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
              <Typography variant="body2" className="forgot-password">
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
          © 2024 WanderCall. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;