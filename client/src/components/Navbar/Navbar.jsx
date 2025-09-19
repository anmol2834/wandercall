import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Button,
  Avatar,
  Box,
  InputAdornment,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Search,
  FavoriteBorder,
  EmojiEvents,
  BookOnline,
  Groups,
  Menu as MenuIcon,
  Close,
  Logout,
  Info,
  Description,
  Security,
  ContactMail,
  Home
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

const getAvatarUrl = (seed, style = 'adventurer') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,fecaca,fed7aa&radius=50`;
};

const getSelectedAvatar = (user) => {
  const saved = localStorage.getItem('selectedAvatar');
  return saved ? parseInt(saved) : user?.selectedAvatar || 0;
};

const avatarSeeds = [
  'adventurer-1', 'adventurer-2', 'adventurer-3', 'adventurer-4', 'adventurer-5',
  'adventurer-6', 'adventurer-7', 'adventurer-8', 'adventurer-9', 'adventurer-10',
  'personas-1', 'personas-2', 'personas-3', 'personas-4', 'personas-5',
  'personas-6', 'personas-7', 'personas-8', 'personas-9', 'personas-20',
  'bottts-1', 'bottts-2', 'bottts-3', 'bottts-4', 'bottts-5'
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: <Home />, label: 'Home', route: '/' },
    { icon: <FavoriteBorder />, label: 'Wishlist', route: '/profile/wishlist' },
    { icon: <EmojiEvents />, label: 'Rewards', route: '/profile/rewards' },
    { icon: <BookOnline />, label: 'Bookings', route: '/profile/booked' },
    { icon: <Groups />, label: 'Community', route: '/profile/community' },
  ];

  const footerItems = [
    { icon: <Info />, label: 'About Us', route: '/about' },
    { icon: <Description />, label: 'Terms & Conditions', route: '/terms' },
    { icon: <Security />, label: 'Privacy Policy', route: '/privacy' },
    { icon: <ContactMail />, label: 'Contact Us', route: '/contact' },
  ];

  const handleNavItemClick = (route) => {
    navigate(route);
  };

  const handleJoinWaitlist = () => {
    navigate('/waitlist');
  };

  const handleBecomeProvider = () => {
    navigate('/become-provider');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const drawer = (
    <Box className="mobile-drawer" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box className="drawer-header" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            wandercall
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </Box>
      
      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600 }}>
          Navigation
        </Typography>
        <List sx={{ py: 0 }}>
          {navItems.map((item) => (
            <ListItem 
              button 
              key={item.label} 
              className="drawer-item" 
              onClick={() => {
                handleNavItemClick(item.route);
                setMobileOpen(false);
              }}
              sx={{ py: 1.5, mx: 1, borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        
        {/* Footer Links */}
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, mt: 2, color: 'text.secondary', fontWeight: 600 }}>
          Information
        </Typography>
        <List sx={{ py: 0 }}>
          {footerItems.map((item) => (
            <ListItem 
              button 
              key={item.label} 
              className="drawer-item" 
              onClick={() => {
                handleNavItemClick(item.route);
                setMobileOpen(false);
              }}
              sx={{ py: 1.5, mx: 1, borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Bottom Actions */}
      <Box className="drawer-buttons" sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Theme</Typography>
          <ThemeToggle />
        </Box>
        
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => { handleSignIn(); setMobileOpen(false); }}>
              Sign In
            </Button>
            <Button variant="contained" fullWidth onClick={() => { handleSignUp(); setMobileOpen(false); }}>
              Sign Up
            </Button>
          </Box>
        ) : (
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<Logout />} 
            onClick={() => { handleLogout(); setMobileOpen(false); }}
            sx={{ mb: 2 }}
          >
            Logout
          </Button>
        )}
        
        <Button variant="contained" color="primary" fullWidth className="drawer-btn" onClick={() => { handleJoinWaitlist(); setMobileOpen(false); }} sx={{ mb: 1 }}>
          Join Waitlist 
        </Button>
        <Button variant="contained" color="secondary" fullWidth className="drawer-btn" onClick={() => { handleBecomeProvider(); setMobileOpen(false); }}>
          Become a Provider
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        className={`navbar ${visible ? 'navbar-visible' : 'navbar-hidden'}`}
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar className="navbar-toolbar">
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => setMobileOpen(true)}
                className="mobile-menu-btn"
              >
                <MenuIcon />
              </IconButton>
              <Box className="mobile-center" sx={{ flex: 1, mx: 2 }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search experiences..."
                  className="search-field mobile-search"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className="mobile-right">
                {isAuthenticated ? (
                  <Avatar className="user-avatar" onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
                    <img 
                      src={getAvatarUrl(avatarSeeds[getSelectedAvatar(user)], getSelectedAvatar(user) < 10 ? 'adventurer' : getSelectedAvatar(user) < 20 ? 'personas' : 'bottts')} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Avatar>
                ) : (
                  <Button variant="outlined" size="small" onClick={handleSignIn}>
                    Sign In
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search experiences, locations, activities..."
                className="search-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box className="nav-center">
                {navItems.map((item) => (
                  <IconButton key={item.label} color="inherit" className="nav-icon-btn" onClick={() => handleNavItemClick(item.route)}>
                    {item.icon}
                  </IconButton>
                ))}
                
                <Button variant="contained" color="primary" className="cta-btn primary-cta" onClick={handleJoinWaitlist}>
                  Join Waitlist
                </Button>
                <Button variant="contained" color="secondary" className="cta-btn secondary-cta" onClick={handleBecomeProvider}>
                  Become a Provider
                </Button>
                
                {isAuthenticated && (
                  <Avatar className="user-avatar" onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
                    <img 
                      src={getAvatarUrl(avatarSeeds[getSelectedAvatar(user)], getSelectedAvatar(user) < 10 ? 'adventurer' : getSelectedAvatar(user) < 20 ? 'personas' : 'bottts')} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Avatar>
                )}
                
                <ThemeToggle />
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;