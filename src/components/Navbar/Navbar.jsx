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
} from '@mui/material';
import {
  Search,
  FavoriteBorder,
  EmojiEvents,
  BookOnline,
  Groups,
  Menu as MenuIcon,
  Close,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    { icon: <FavoriteBorder />, label: 'Wishlist', route: '/profile/wishlist' },
    { icon: <EmojiEvents />, label: 'Rewards', route: '/profile/rewards' },
    { icon: <BookOnline />, label: 'Bookings', route: '/profile/booked' },
    { icon: <Groups />, label: 'Community', route: '/profile/community' },
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

  const drawer = (
    <Box className="mobile-drawer">
      <Box className="drawer-header">
        <IconButton onClick={() => setMobileOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} className="drawer-item" onClick={() => handleNavItemClick(item.route)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box className="drawer-buttons">
        <Box className="theme-toggle-container">
          <ThemeToggle />
        </Box>
        <Button variant="contained" color="primary" fullWidth className="drawer-btn" onClick={handleJoinWaitlist}>
          Join Waitlist 
        </Button>
        <Button variant="contained" color="secondary" fullWidth className="drawer-btn" onClick={handleBecomeProvider}>
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
              <Box className="mobile-center">
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  className="search-field mobile-search"
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
                <Avatar className="user-avatar" onClick={handleProfileClick} sx={{ cursor: 'pointer' }} />
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
                
                <ThemeToggle />
                <Avatar className="user-avatar" onClick={handleProfileClick} sx={{ cursor: 'pointer' }} />
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