import {
  Box, Container, Typography, Avatar, Button, Card, CardContent, Grid,
  List, ListItem, ListItemIcon, ListItemText, Drawer, useTheme, IconButton,
  Chip, Paper, Divider, useMediaQuery, Badge, Fab, TextField
} from '@mui/material';
import {
  Person, BookmarkBorder, FavoriteBorder, EmojiEvents, HelpOutline,
  Groups, MenuBook, QuestionAnswer, Receipt, Logout, Edit, LocationOn,
  Add, Settings, Notifications, KeyboardArrowUp, Close, Menu, ArrowBack
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, addressAPI } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRewards } from '../../redux/slices/rewardsSlice';
import EditProfileModal from '../../components/EditProfileModal';
import ProfilePageLoader from '../../components/loaders/ProfilePageLoader';
import './Profile.css';
import RewardsPage from './components/RewardsPage';
import BookingsPage from './components/BookingsPage';
import WishlistPage from './components/WishlistPage';
import SettingsPage from './components/SettingsPage';
import AddressPage from './components/AddressPage';
import HelpCenterPage from './components/HelpCenterPage';
import TransactionHistoryPage from './components/TransactionHistoryPage';
import ExperienceJournalPage from './components/ExperienceJournalPage';
import CommunityPage from './components/CommunityPage';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout: authLogout, updateUser, loading, fetchUserProfile } = useAuth();
  const dispatch = useDispatch();
  const xpBalance = useSelector(state => state.rewards?.xpBalance || 0);
  const [editing, setEditing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem('selectedAvatar');
    return saved ? parseInt(saved) : user?.selectedAvatar || 0;
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(null);

  const avatarSeeds = [
    'adventurer-1', 'adventurer-2', 'adventurer-3', 'adventurer-4', 'adventurer-5',
    'adventurer-6', 'adventurer-7', 'adventurer-8', 'adventurer-9', 'adventurer-10',
    'personas-1', 'personas-2', 'personas-3', 'personas-4', 'personas-5',
    'personas-6', 'personas-7', 'personas-8', 'personas-9', 'personas-10',
    'bottts-1', 'bottts-2', 'bottts-3', 'bottts-4', 'bottts-5',
    'fun-emoji-1', 'fun-emoji-2', 'fun-emoji-3', 'fun-emoji-4', 'fun-emoji-5'
  ];

  const getAvatarUrl = (seed, style = 'adventurer') => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,fecaca,fed7aa&radius=50`;
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/profile') setActiveSection('profile');
    else if (path.includes('/booked')) setActiveSection('booked');
    else if (path.includes('/wishlist')) setActiveSection('wishlist');
    else if (path.includes('/rewards')) setActiveSection('rewards');
    else if (path.includes('/help')) setActiveSection('help');
    else if (path.includes('/community')) setActiveSection('community');
    else if (path.includes('/journal')) setActiveSection('journal');
    else if (path.includes('/qa')) setActiveSection('qa');
    else if (path.includes('/transactions')) setActiveSection('transactions');
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      if (user.id) {
        dispatch(fetchUserRewards(user.id));
      }
      if (user.addresses) {
        setAddresses(user.addresses);
      } else if (user.id) {
        // If addresses not loaded, fetch fresh user profile
        fetchUserProfile();
      }
      // Set avatar from localStorage or user data
      const saved = localStorage.getItem('selectedAvatar');
      if (saved) {
        setUserAvatar(parseInt(saved));
      } else if (user.selectedAvatar !== undefined) {
        setUserAvatar(user.selectedAvatar);
        localStorage.setItem('selectedAvatar', user.selectedAvatar.toString());
      }
    }
  }, [user, dispatch, fetchUserProfile]);

  // Get XP from waitlist rewards if available
  const displayXP = xpBalance || (user?.waitlistRewards?.find(r => r.rewardType === 'WELCOME_XP')?.rewardValue) || '0';

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <Person />, route: '/profile' },
    { id: 'booked', label: 'My Bookings', icon: <BookmarkBorder />, route: '/profile/booked' },
    { id: 'wishlist', label: 'Wishlist', icon: <FavoriteBorder />, route: '/profile/wishlist' },
    { id: 'rewards', label: 'Rewards', icon: <EmojiEvents />, route: '/profile/rewards' },
    { id: 'help', label: 'Help Center', icon: <HelpOutline />, route: '/profile/help' },
    { id: 'community', label: 'Community', icon: <Groups />, route: '/profile/community' },
    { id: 'journal', label: 'Experience Journal', icon: <MenuBook />, route: '/profile/journal' },
    { id: 'addresses', label: 'Addresses', icon: <LocationOn />, route: '/profile/addresses' },
    { id: 'transactions', label: 'Transaction History', icon: <Receipt />, route: '/profile/transactions' }
    // { id: 'settings', label: 'Settings', icon: <Settings />, route: '/profile/settings' }
  ];

  const handleMenuClick = (item) => {
    setActiveSection(item.id);
    navigate(item.route);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleAvatarChange = () => {
    setShowAvatarModal(true);
  };

  const selectAvatar = async (index) => {
    try {
      setUserAvatar(index);
      // Save to localStorage
      localStorage.setItem('selectedAvatar', index.toString());
      // Save to backend
      const response = await userAPI.updateProfile({ selectedAvatar: index });
      // Update user context to sync with navbar
      updateUser(response.data.user);
      setShowAvatarModal(false);
    } catch (error) {
      console.error('Failed to update avatar:', error);
      // Keep localStorage but revert state on backend error
      const saved = localStorage.getItem('selectedAvatar');
      setUserAvatar(saved ? parseInt(saved) : user?.selectedAvatar || 0);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setAddressLoading(addressId);
      const response = await addressAPI.setDefaultAddress(addressId);
      updateUser(response.data.user);
      setAddresses(response.data.user.addresses || []);
    } catch (error) {
      console.error('Failed to set default address:', error);
    } finally {
      setAddressLoading(null);
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate('/');
  };

  const handleUpdateProfile = async (updateData) => {
    try {
      const response = await userAPI.updateProfile(updateData);
      updateUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  if (loading) {
    return <ProfilePageLoader />;
  }

  const MenuContent = () => (
    <Box className="profile-menu-content" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box className="profile-menu-header" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          WanderCall
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List className="profile-menu-list" sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <ListItem
                button
                className={`profile-menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '20',
                    transform: 'translateX(8px)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === item.id ? theme.palette.primary.main : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: activeSection === item.id ? 600 : 400,
                      color: activeSection === item.id ? theme.palette.primary.main : 'inherit'
                    }
                  }}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: theme.palette.error.main + '10'
              }
            }}
          >
            Logout
          </Button>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Box className="profile-page-container" sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Back Button */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3]
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          className="profile-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          sx={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3]
          }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Paper className="profile-sidebar" sx={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: 280,
          zIndex: 999,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 0,
          borderRight: `1px solid ${theme.palette.divider}`
        }}>
          <MenuContent />
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.paper
          }
        }}
      >
        <MenuContent />
      </Drawer>

      {/* Main Content */}
      <Box className="profile-main-content" sx={{ ml: isMobile ? 0 : '280px', p: { xs: 2, md: 4 } }}>
        {/* Dynamic Content Based on Route */}
        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="profile-hero-card" sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  color: 'white',
                  mb: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    className="profile-hero-glow"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: 'absolute',
                      top: -100,
                      right: -100,
                      width: 200,
                      height: 200,
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                      borderRadius: '50%'
                    }}
                  />
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="profile-avatar-container"
                          style={{ textAlign: 'center' }}
                        >
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={handleAvatarChange}
                                  sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    color: theme.palette.primary.main,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    '&:hover': { 
                                      backgroundColor: 'white',
                                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                                    }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </motion.div>
                            }
                          >
                            <Box sx={{ 
                              width: 120, 
                              height: 120, 
                              border: '4px solid rgba(255, 255, 255, 0.4)', 
                              borderRadius: '50%', 
                              overflow: 'hidden',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                              position: 'relative',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                                animation: 'shimmer 3s infinite'
                              },
                              '@keyframes shimmer': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}>
                              <img 
                                src={getAvatarUrl(avatarSeeds[userAvatar], userAvatar < 10 ? 'adventurer' : userAvatar < 20 ? 'personas' : userAvatar < 25 ? 'bottts' : 'fun-emoji')} 
                                alt="Avatar" 
                                style={{ width: '100%', height: '100%' }}
                              />
                            </Box>
                          </Badge>
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.5rem' }}>
                            {user?.name || 'User'}
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.8, mb: 1.5, fontSize: '0.9rem' }}>
                            {user?.email || 'user@wandercall.com'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                          {user?.waitlistRewards && (
                            <Chip label="Premium Member" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                          )}
                          <Chip label="Travel Enthusiast" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Edit />}
                            onClick={() => setEditing(true)}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              backdropFilter: 'blur(10px)',
                              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                            }}
                          >
                            Edit Profile
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  { title: 'Expereince Booked', value: '0', icon: <BookmarkBorder />, color: '#6366f1' },
                  { title: 'Wishlist Items', value: '0', icon: <FavoriteBorder />, color: '#ec4899' },
                  { title: 'Reward XP', value: displayXP, icon: <EmojiEvents />, color: '#f59e0b' },
                  { title: 'Reviews Given', value: '0', icon: <QuestionAnswer />, color: '#10b981' }
                ].map((stat, index) => (
                  <Grid item xs={6} md={3} key={stat.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                        p: 2
                      }}>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          style={{
                            backgroundColor: stat.color,
                            color: 'white',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: `0 8px 25px ${stat.color}40`
                          }}
                        >
                          {stat.icon}
                        </motion.div>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {stat.title}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Address Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 4
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="primary" />
                        Address Management
                      </Typography>
                      {addresses.length < 2 && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/profile/addresses')}
                            sx={{ borderRadius: 2 }}
                          >
                            Add Address
                          </Button>
                        </motion.div>
                      )}
                    </Box>

                    <Grid container spacing={3}>
                      {addresses.length > 0 ? addresses.slice(0, 2).map((address) => (
                        <Grid item xs={12} md={6} key={address._id}>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Paper 
                              onClick={() => !address.isDefault && !addressLoading && handleSetDefaultAddress(address._id)}
                              sx={{
                                p: 3,
                                background: address.isDefault ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                border: address.isDefault ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 2,
                                cursor: address.isDefault || addressLoading ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                opacity: addressLoading === address._id ? 0.7 : 1,
                                '&:hover': {
                                  backgroundColor: address.isDefault ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.08)'
                                }
                              }}
                            >
                              {/* Loading overlay */}
                              {addressLoading === address._id && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  backdropFilter: 'blur(2px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 2,
                                  zIndex: 1
                                }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      style={{ display: 'inline-block', marginBottom: 8 }}
                                    >
                                      <Box sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        border: '2px solid rgba(99, 102, 241, 0.3)',
                                        borderTop: '2px solid #6366f1'
                                      }} />
                                    </motion.div>
                                    <Typography variant="caption" sx={{ display: 'block', color: 'white', fontWeight: 500 }}>
                                      Setting as default...
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Chip 
                                    label={address.type} 
                                    size="small" 
                                    color={address.type === 'Home' ? 'primary' : 'secondary'} 
                                  />
                                  {address.isDefault && <Chip label="Default" size="small" color="success" />}
                                </Box>
                              </Box>
                              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                {address.street}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {address.city}, {address.state} {address.zipCode}<br />
                                {address.country}
                              </Typography>
                            </Paper>
                          </motion.div>
                        </Grid>
                      )) : (
                        <Grid item xs={12}>
                          <Paper sx={{ 
                            p: 4, 
                            textAlign: 'center', 
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2
                          }}>
                            <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>No addresses added yet</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add your addresses to make booking easier
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                style={{ textAlign: 'center', marginTop: '2rem' }}
              >
                <svg viewBox="0 0 600 400" style={{ maxWidth: '500px', height: 'auto' }}>
                  <defs>
                    <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  {/* Person illustration */}
                  <motion.circle 
                    cx="300" cy="180" r="80" 
                    fill="url(#profileGrad)" opacity="0.2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.circle 
                    cx="300" cy="150" r="40" 
                    fill="url(#profileGrad)"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <circle cx="285" cy="140" r="5" fill="white" />
                  <circle cx="315" cy="140" r="5" fill="white" />
                  <path d="M280 165 Q300 180 320 165" stroke="white" strokeWidth="3" fill="none" />
                  <motion.rect 
                    x="260" y="220" width="80" height="100" rx="40" 
                    fill="url(#profileGrad)" opacity="0.8"
                    animate={{ y: [220, 215, 220] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {/* Floating elements */}
                  <motion.circle cx="150" cy="120" r="15" fill="url(#profileGrad)" opacity="0.6"
                    animate={{ y: [120, 110, 120] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.circle cx="450" cy="200" r="20" fill="url(#profileGrad)" opacity="0.4"
                    animate={{ y: [200, 190, 200] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </svg>
              </motion.div>
            </>
          } />
          <Route path="/booked" element={<BookingsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/addresses" element={<AddressPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/journal" element={<ExperienceJournalPage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 16,
                padding: 16,
                maxWidth: 320,
                width: '90%',
                maxHeight: '70vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
                Choose Your Avatar
              </Typography>
              <Box sx={{ overflowY: 'auto', flex: 1, pr: 1 }}>
                <Grid container spacing={1}>
                  {avatarSeeds.map((seed, index) => (
                    <Grid item xs={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectAvatar(index)}
                        style={{
                          width: 60,
                          height: 60,
                          cursor: 'pointer',
                          border: userAvatar === index ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: userAvatar === index ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                          boxShadow: userAvatar === index ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
                        }}
                      >
                        <img 
                          src={getAvatarUrl(seed, index < 10 ? 'adventurer' : index < 20 ? 'personas' : index < 25 ? 'bottts' : 'fun-emoji')} 
                          alt={`Avatar ${index + 1}`} 
                          style={{ width: '100%', height: '100%' }}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button onClick={() => setShowAvatarModal(false)} variant="outlined">
                  Cancel
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editing}
        onClose={() => setEditing(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
          >
            <Fab 
              color="primary" 
              onClick={scrollToTop}
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <KeyboardArrowUp />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Profile;