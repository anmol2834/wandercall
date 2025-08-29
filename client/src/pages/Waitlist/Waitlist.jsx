import {
  Box, Container, Typography, Button, TextField, Card, CardContent, Grid,
  InputAdornment, IconButton, Chip, Alert
} from '@mui/material';
import {
  Person, Email, ArrowForward, CheckCircle, Star, EmojiEvents,
  Share, Instagram, WhatsApp, Celebration, LocalActivity, 
  CardGiftcard, WorkspacePremium, ArrowBack
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { waitlistAPI } from '../../services/api';
import './Waitlist.css';

const Waitlist = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [showRewards, setShowRewards] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [userRewards, setUserRewards] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({ name: user.name, email: user.email });
      checkWaitlistStatus();
    }
  }, [isAuthenticated, user]);

  const checkWaitlistStatus = async () => {
    try {
      const response = isAuthenticated 
        ? await waitlistAPI.checkStatusAuthenticated()
        : await waitlistAPI.checkStatus(formData.email);
      
      if (response.data.isOnWaitlist) {
        setIsOnWaitlist(true);
        setUserRewards(response.data.rewards);
        setShowRewards(true);
      }
    } catch (error) {
      console.error('Error checking waitlist status:', error);
    }
  };

  const getRewardIcon = (rewardType) => {
    switch (rewardType) {
      case 'EARLY_ACCESS':
        return <WorkspacePremium sx={{ fontSize: 40, color: '#667eea' }} />;
      case 'DISCOUNT':
        return <CardGiftcard sx={{ fontSize: 40, color: '#f093fb' }} />;
      case 'PREMIUM_SUPPORT':
        return <Star sx={{ fontSize: 40, color: '#4ade80' }} />;
      case 'WELCOME_XP':
        return <EmojiEvents sx={{ fontSize: 40, color: '#ffd700' }} />;
      default:
        return <EmojiEvents sx={{ fontSize: 40, color: '#ffd700' }} />;
    }
  };

  const getRewardColor = (rewardType) => {
    switch (rewardType) {
      case 'EARLY_ACCESS': return '#667eea';
      case 'DISCOUNT': return '#f093fb';
      case 'PREMIUM_SUPPORT': return '#4ade80';
      case 'WELCOME_XP': return '#ffd700';
      default: return '#ffd700';
    }
  };

  const displayRewards = userRewards.length > 0 ? userRewards : [
    {
      rewardType: 'EARLY_ACCESS',
      rewardValue: '30_DAYS',
      description: '30 days early access to new features'
    },
    {
      rewardType: 'DISCOUNT',
      rewardValue: '10_PERCENT_30_DAYS',
      description: '10% discount valid for 30 days'
    },
    {
      rewardType: 'PREMIUM_SUPPORT',
      rewardValue: 'PRIORITY',
      description: 'Priority customer support'
    },
    {
      rewardType: 'WELCOME_XP',
      rewardValue: '5000',
      description: '5000 Welcome XP points for future bookings'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isOnWaitlist) {
      setMessage('You are already on the waitlist!');
      setMessageType('info');
      return;
    }
    
    // Skip validation for authenticated users since form is pre-filled
    if (!isAuthenticated && !validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = isAuthenticated 
        ? await waitlistAPI.joinAuthenticated({ name: formData.name, email: formData.email })
        : await waitlistAPI.join(formData);
      
      setUserRewards(response.data.rewards);
      setIsOnWaitlist(true);
      setShowFireworks(true);
      
      setTimeout(() => {
        setShowFireworks(false);
        setShowRewards(true);
        setLoading(false);
      }, 3000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to join waitlist');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Back Button */}
      <IconButton 
        onClick={() => navigate('/')}
        sx={{ 
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          color: theme.palette.mode === 'dark' ? 'white' : 'black',
          '&:hover': { 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          }
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Enhanced Fireworks Animation */}
      <AnimatePresence>
        {showFireworks && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5, pointerEvents: 'none' }}>
            {/* Main Fireworks Bursts */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 0.5, 1.5, 0],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  left: `${15 + Math.random() * 70}%`,
                  top: `${10 + Math.random() * 50}%`
                }}
              >
                <Celebration sx={{ 
                  fontSize: 80, 
                  color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][i % 7],
                  filter: 'drop-shadow(0 0 20px currentColor)'
                }} />
              </motion.div>
            ))}
            
            {/* Sparkle Effects */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 400],
                  y: [0, (Math.random() - 0.5) * 400]
                }}
                transition={{ 
                  duration: 2,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`
                }}
              >
                <Star sx={{ 
                  fontSize: 20 + Math.random() * 20, 
                  color: ['#ffd700', '#ff69b4', '#00bfff', '#32cd32', '#ff4500'][i % 5],
                  filter: 'drop-shadow(0 0 8px currentColor)'
                }} />
              </motion.div>
            ))}
            
            {/* Trail Effects */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`trail-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 1,
                  delay: 1 + i * 0.1,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  width: 3,
                  height: 50 + Math.random() * 50,
                  background: `linear-gradient(to bottom, ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'][i % 4]}, transparent)`,
                  borderRadius: 2
                }}
              />
            ))}
          </Box>
        )}
      </AnimatePresence>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {!showRewards ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '100vh',
                px: { xs: 1, sm: 0 }
              }}>
                <Card sx={{
                  maxWidth: { xs: '100%', sm: 500 },
                  width: '100%',
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(15, 15, 35, 0.8)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
                }}>
                  <CardContent sx={{ p: { xs: 3, sm: 6 } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Typography 
                        variant="h3" 
                        fontWeight={700} 
                        textAlign="center" 
                        gutterBottom
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? 'white' : 'black',
                          mb: 3
                        }}
                      >
                        Join the Waitlist
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        textAlign="center" 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                          mb: 3
                        }}
                      >
                        Be the first to experience premium adventures and unlock exclusive rewards
                      </Typography>
                      
                      {!isAuthenticated && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                          Join the waitlist now! If you register later with the same email, you'll automatically get access to all exclusive rewards.
                        </Alert>
                      )}
                      
                      {message && (
                        <Alert severity={messageType} sx={{ mb: 3 }}>
                          {message}
                        </Alert>
                      )}

                      {/* Stats */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} sx={{ color: '#667eea' }}>
                            2,847
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                            Members Joined
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight={700} sx={{ color: '#f093fb' }}>
                            72
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                            Hours Remaining
                          </Typography>
                        </Box>
                      </Box>

                      <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={isAuthenticated}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                '& fieldset': {
                                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)'
                                }
                              },
                              '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? 'white' : 'black'
                              },
                              '& .MuiInputLabel-root': {
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                              }
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isAuthenticated}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                '& fieldset': {
                                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)'
                                }
                              },
                              '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? 'white' : 'black'
                              },
                              '& .MuiInputLabel-root': {
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                              }
                            }}
                          />
                        </Box>

                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            endIcon={isOnWaitlist ? <CheckCircle /> : <ArrowForward />}
                            disabled={loading || isOnWaitlist}
                            sx={{
                              py: 2,
                              background: isOnWaitlist 
                                ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                              '&:hover': {
                                background: isOnWaitlist
                                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                                  : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)'
                              },
                              '&:disabled': {
                                background: isOnWaitlist
                                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                                  : 'rgba(0,0,0,0.12)'
                              }
                            }}
                          >
                            {loading ? 'Joining...' : isOnWaitlist ? 'Already on Waitlist' : 'Join Waitlist'}
                          </Button>
                        </motion.div>
                      </form>
                    </motion.div>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="rewards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 0 } }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Typography 
                    variant="h2" 
                    fontWeight={800} 
                    textAlign="center" 
                    gutterBottom
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      mb: 2,
                      mt: 4,
                      fontSize: { xs: '1.8rem', sm: '3rem' }
                    }}
                  >
                    Welcome to the Club!
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    textAlign="center" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                      mb: 6,
                      fontSize: { xs: '1.1rem', sm: '1.5rem' }
                    }}
                  >
                    Your exclusive rewards are ready
                  </Typography>
                </motion.div>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                  {displayRewards.map((reward, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                      >
                        <Card sx={{
                          height: 280,
                          minHeight: 280,
                          background: theme.palette.mode === 'dark'
                            ? 'rgba(15, 15, 35, 0.8)'
                            : 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 3,
                          border: `2px solid ${getRewardColor(reward.rewardType)}30`,
                          boxShadow: `0 10px 30px ${getRewardColor(reward.rewardType)}20`,
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${getRewardColor(reward.rewardType)} 0%, ${getRewardColor(reward.rewardType)}80 100%)`
                          }} />
                          
                          <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                            >
                              {getRewardIcon(reward.rewardType)}
                            </motion.div>
                            
                            <Typography 
                              variant="h6" 
                              fontWeight={600} 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                                mt: 2, 
                                mb: 1 
                              }}
                            >
                              {reward.rewardType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                              }}
                            >
                              {reward.description}
                            </Typography>
                            
                            <Chip 
                              label="Unlocked" 
                              icon={<CheckCircle />}
                              sx={{ 
                                mt: 2,
                                backgroundColor: `${getRewardColor(reward.rewardType)}20`,
                                color: getRewardColor(reward.rewardType),
                                fontWeight: 600
                              }} 
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Share Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <Card sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(15, 15, 35, 0.8)'
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    textAlign: 'center',
                    p: 4
                  }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
                    >
                      Share With Friends
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                        mb: 3
                      }}
                    >
                      Invite friends and earn extra rewards for every successful referral
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          startIcon={<Instagram />}
                          sx={{
                            background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                            borderRadius: 25,
                            px: 3,
                            py: 1.5
                          }}
                        >
                          Instagram
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          startIcon={<WhatsApp />}
                          sx={{
                            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                            borderRadius: 25,
                            px: 3,
                            py: 1.5
                          }}
                        >
                          WhatsApp
                        </Button>
                      </motion.div>
                    </Box>
                  </Card>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Waitlist;