import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, Button, 
  LinearProgress, Chip, Avatar, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Tab, Tabs, Paper,
  List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import {
  EmojiEvents, Redeem, History, TrendingUp, Star, 
  CardGiftcard, LocalActivity, WorkspacePremium, Close,
  Timeline, AccountBalanceWallet, ShoppingCart
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRewards, redeemReward } from '../../../redux/slices/rewardsSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { useRewards } from '../../../contexts/RewardsContext';
import { useNavigate } from 'react-router-dom';
import RewardsPageLoader from '../../../components/loaders/RewardsPageLoader';

const RewardsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { waitlistRewards, xpBalance, loading } = useRewards();
  const rewards = useSelector(state => state.rewards?.rewards) || [];
  const history = useSelector(state => state.rewards?.history) || [];
  
  // Get XP from waitlist rewards
  const displayXP = xpBalance || '0';
  
  const [tabValue, setTabValue] = useState(0);
  const [redeemDialog, setRedeemDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardBucket, setRewardBucket] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserRewards(user.id));
    }
  }, [dispatch, user]);

  const rewardTiers = [
    { name: 'Bronze', min: 0, max: 2000, color: '#cd7f32', icon: '🥉' },
    { name: 'Silver', min: 2000, max: 6000, color: '#c0c0c0', icon: '🥈' },
    { name: 'Gold', min: 6000, max: 14000, color: '#ffd700', icon: '🥇' },
    { name: 'Platinum', min: 14000, max: 50000, color: '#e5e4e2', icon: '💎' },
    { name: 'Diamond', min: 50000, max: Infinity, color: '#b9f2ff', icon: '💠' }
  ];

  const getCurrentTier = () => {
    const xp = parseInt(displayXP) || 0;
    return rewardTiers.find(tier => xp >= tier.min && xp <= tier.max) || rewardTiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = rewardTiers.indexOf(currentTier);
    return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null;
  };

  const availableRewards = [
    { id: 1, name: '10% Discount Coupon', cost: 1000, type: 'discount', icon: <CardGiftcard /> },
    { id: 2, name: '20% Discount Coupon', cost: 3000, type: 'discount', icon: <CardGiftcard /> },
    { id: 3, name: '₹10 Cash Reward', cost: 1000, type: 'cash', icon: <AccountBalanceWallet /> },
    { id: 4, name: '1 Free Experience', cost: 10000, type: 'free', icon: <LocalActivity /> }
  ];

  const earnMoreOptions = [
    { title: 'Book an Experience', xp: '+100-500 XP', icon: <LocalActivity />, color: '#6366f1' },
    { title: 'Write a Review', xp: '+50 XP', icon: <Star />, color: '#f59e0b' },
    { title: 'Refer a Friend', xp: '+200 XP', icon: <TrendingUp />, color: '#10b981' },
    { title: 'Complete Profile', xp: '+100 XP', icon: <AccountBalanceWallet />, color: '#ec4899' }
  ];

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setRedeemDialog(true);
  };

  const confirmRedeem = () => {
    if (selectedReward && xpBalance >= selectedReward.cost) {
      dispatch(redeemReward({ rewardId: selectedReward.id, userId: user.id }));
      setRedeemDialog(false);
      setSelectedReward(null);
    }
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const xp = parseInt(displayXP) || 0;
  const progressToNext = nextTier ? ((xp - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  if (loading) {
    return <RewardsPageLoader />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card sx={{
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 3,
          borderRadius: 2
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Rewards Center
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1.5, fontSize: '0.85rem' }}>
                  Earn XP and unlock exclusive rewards
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${currentTier.icon} ${currentTier.name}`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                  {/* Desktop: Show XP here */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', display: { xs: 'none', sm: 'block' } }}>
                      {displayXP} XP
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setRewardBucket(true)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '0.7rem',
                        px: 1.5,
                        py: 0.5
                      }}
                    >
                      🎁 Bucket
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'space-between', sm: 'center' },
                  alignItems: 'center',
                  mt: { xs: 1, sm: 0 }
                }}>
                  {/* Mobile: Show XP on left, icon on right */}
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {displayXP} XP
                    </Typography>
                  </Box>
                  
                  <Avatar
                    sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      backgroundColor: currentTier.color,
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    {currentTier.icon}
                  </Avatar>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compact Progress */}
      {nextTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card sx={{ mb: 2, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                  Next: {nextTier.name} {nextTier.icon}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {nextTier.min - xp} XP left
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressToNext}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Compact Tabs */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              minHeight: { xs: 40, sm: 48 },
              py: { xs: 0.5, sm: 1 },
              px: { xs: 0.5, sm: 1 }
            },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }
          }}
        >
          <Tab label="Redeem" icon={<Redeem fontSize="small" />} iconPosition="start" />
          <Tab label="Earn XP" icon={<TrendingUp fontSize="small" />} iconPosition="start" />
          <Tab label="History" icon={<History fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tabValue === 0 && (
          <motion.div
            key="redeem"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Grid container spacing={2}>
              {availableRewards.map((reward, index) => (
                <Grid item xs={12} sm={6} key={reward.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{
                            backgroundColor: '#667eea',
                            width: 40,
                            height: 40
                          }}>
                            {reward.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                              {reward.name}
                            </Typography>
                            <Chip
                              label={`${reward.cost} XP`}
                              size="small"
                              sx={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={parseInt(displayXP) < reward.cost || loading}
                            onClick={() => handleRedeem(reward)}
                            sx={{
                              minWidth: 80,
                              fontSize: '0.75rem',
                              background: parseInt(displayXP) >= reward.cost 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            {parseInt(displayXP) >= reward.cost ? 'Redeem' : 'Need XP'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {tabValue === 1 && (
          <motion.div
            key="earn"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Grid container spacing={3}>
              {earnMoreOptions.map((option, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ backgroundColor: option.color, color: 'white' }}>
                            {option.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {option.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.xp}
                            </Typography>
                          </Box>
                          <Button variant="outlined" size="small">
                            Start
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {tabValue === 2 && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Achievements Section */}
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 2
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                  🏆 Achievements
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { name: 'First Steps', desc: 'Join wandercall', earned: true },
                    { name: 'Explorer', desc: 'Book first experience', earned: false },
                    { name: 'Reviewer', desc: 'Write 5 reviews', earned: false },
                    { name: 'Adventurer', desc: 'Complete 10 experiences', earned: false }
                  ].map((achievement, idx) => (
                    <Grid item xs={6} sm={3} key={idx}>
                      <Box sx={{
                        textAlign: 'center',
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: achievement.earned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: achievement.earned ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>
                          {achievement.earned ? '🏆' : '🔒'}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          {achievement.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* XP History */}
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CardContent sx={{ p: 0 }}>
                <List>
                  {/* Waitlist XP History */}
                  {waitlistRewards?.filter(reward => reward.rewardType === 'WELCOME_XP').map((reward, index) => (
                    <React.Fragment key={`waitlist-xp-${index}`}>
                      <ListItem sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            backgroundColor: '#10b981',
                            width: 32,
                            height: 32
                          }}>
                            <TrendingUp fontSize="small" />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Welcome XP from Waitlist</Typography>}
                          secondary={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Joined waitlist</Typography>}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#10b981',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          +{reward.rewardValue} XP
                        </Typography>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {(history || []).map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 1.5 }}>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            backgroundColor: item.type === 'earned' ? '#10b981' : '#ef4444',
                            width: 32,
                            height: 32
                          }}>
                            {item.type === 'earned' ? <TrendingUp fontSize="small" /> : <Redeem fontSize="small" />}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{item.description}</Typography>}
                          secondary={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{new Date(item.date).toLocaleDateString()}</Typography>}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: item.type === 'earned' ? '#10b981' : '#ef4444',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          {item.type === 'earned' ? '+' : '-'}{item.amount} XP
                        </Typography>
                      </ListItem>
                      {index < history.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  {(!history || history.length === 0) && (!waitlistRewards?.filter(r => r.rewardType === 'WELCOME_XP').length) && (
                    <ListItem sx={{ textAlign: 'center', py: 3 }}>
                      <ListItemText
                        primary={<Typography variant="body2">No XP history yet</Typography>}
                        secondary={<Typography variant="caption">Start booking experiences to earn XP!</Typography>}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redeem Dialog */}
      <Dialog open={redeemDialog} onClose={() => setRedeemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Confirm Redemption
          <IconButton onClick={() => setRedeemDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: '#667eea', 
                margin: '0 auto 16px' 
              }}>
                {selectedReward.icon}
              </Avatar>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedReward.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                This will cost {selectedReward.cost} XP from your balance.
              </Typography>
              <Typography variant="body2">
                Remaining balance: {xpBalance - selectedReward.cost} XP
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRedeemDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={confirmRedeem}
            disabled={loading}
          >
            Confirm Redeem
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reward Bucket Overlay */}
      <Dialog 
        open={rewardBucket} 
        onClose={() => setRewardBucket(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            m: { xs: 1, sm: 2 }
          }
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              🎁 My Reward Bucket
            </Typography>
            <IconButton onClick={() => setRewardBucket(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          
          <Grid container spacing={2}>
            {/* Non-XP Waitlist Rewards */}
            {waitlistRewards?.filter(reward => reward.rewardType !== 'WELCOME_XP').map((reward, index) => (
              <Grid item xs={12} sm={6} md={4} key={`waitlist-${index}`}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        🎁
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                        {reward.rewardType.replace('_', ' ')}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {reward.rewardValue.replace('_', ' ')}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      From Waitlist
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {/* Empty state */}
            {(!waitlistRewards?.filter(r => r.rewardType !== 'WELCOME_XP').length) && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: { xs: '2rem', sm: '3rem' }, mb: 2 }}>🎁</Typography>
                  <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                    No rewards yet
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Redeem rewards to see them here!
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Dialog>

      {/* Attractive Bottom Section with Animations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Card sx={{
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          color: 'white',
          mt: 4,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Animated Background Elements */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
                style={{
                  position: 'absolute',
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
            ))}
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    🚀 Level Up Your Adventures!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Complete experiences, earn XP, and unlock amazing rewards. Your next adventure awaits!
                  </Typography>
                  
                  {/* Feature Highlights */}
                  <Grid container spacing={2}>
                    {[
                      { icon: '🎯', text: 'Earn XP from every booking' },
                      { icon: '🏆', text: 'Unlock exclusive rewards' },
                      { icon: '⭐', text: 'Climb the tier system' },
                      { icon: '🎁', text: 'Get special discounts' }
                    ].map((feature, idx) => (
                      <Grid item xs={6} sm={3} key={idx}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 0.5 }}>
                              {feature.icon}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                              {feature.text}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  style={{ textAlign: 'center' }}
                >
                  {/* Animated Illustration */}
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <svg width="120" height="120" viewBox="0 0 120 120" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                        <circle cx="60" cy="60" r="50" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                        <circle cx="60" cy="60" r="35" fill="rgba(255,255,255,0.1)" />
                        <text x="60" y="70" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">🎯</text>
                      </svg>
                    </motion.div>
                    
                    {/* Floating Elements */}
                    {['💎', '🏆', '⭐', '🎁'].map((emoji, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 2 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                        style={{
                          position: 'absolute',
                          left: `${20 + i * 20}%`,
                          top: `${10 + (i % 2) * 70}%`,
                          fontSize: '1.5rem'
                        }}
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
            
            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{ textAlign: 'center', marginTop: '2rem' }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 25,
                  px: 4,
                  py: 1.5,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const experiencesSection = document.getElementById('experiences-section');
                    if (experiencesSection) {
                      experiencesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                🌟 Start Your Journey
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default RewardsPage;