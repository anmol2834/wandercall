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
import wandercallLogo from '../../assets/wandercall-logo1.svg';
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
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
        height: 80,
        minHeight: 80,
        maxHeight: 80
      }}>
        <Box
          component="img"
          src={wandercallLogo}
          alt="wandercall"
          sx={{
            height: 60,
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'
          }}
        />
        <IconButton 
          onClick={() => setMobileOpen(false)}
          size="small"
          sx={{ 
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Scrollable Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Main Navigation */}
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="overline" sx={{ 
            px: 1,
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.7rem',
            letterSpacing: '0.5px'
          }}>
            Navigation
          </Typography>
          <List sx={{ py: 0.5 }}>
            {navItems.map((item) => (
              <ListItem 
                key={item.label}
                onClick={() => {
                  handleNavItemClick(item.route);
                  setMobileOpen(false);
                }}
                sx={{ 
                  py: 1.2,
                  px: 1.5,
                  borderRadius: 2,
                  mb: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 32,
                  color: 'text.secondary'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Information Links */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="overline" sx={{ 
            px: 1,
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.7rem',
            letterSpacing: '0.5px'
          }}>
            Information
          </Typography>
          <List sx={{ py: 0.5 }}>
            {footerItems.map((item) => (
              <ListItem 
                key={item.label}
                onClick={() => {
                  handleNavItemClick(item.route);
                  setMobileOpen(false);
                }}
                sx={{ 
                  py: 1,
                  px: 1.5,
                  borderRadius: 2,
                  mb: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 32,
                  color: 'text.secondary'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Spacer to push bottom section down */}
        <Box sx={{ flex: 1, minHeight: 20 }} />
      </Box>
      
      {/* Bottom Action Section - Always at bottom */}
      <Box sx={{
        flexShrink: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.02)' 
          : 'rgba(0, 0, 0, 0.02)'
      }}>
        {/* Theme Toggle */}
        <Box sx={{ 
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Theme
          </Typography>
          <ThemeToggle />
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Primary Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => { handleJoinWaitlist(); setMobileOpen(false); }}
              sx={{
                py: 1.4,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                boxShadow: '0 3px 10px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Join Waitlist
            </Button>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => { handleBecomeProvider(); setMobileOpen(false); }}
              sx={{
                py: 1.4,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #f59e0b, #f97316)',
                boxShadow: '0 3px 10px rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(245, 158, 11, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Become a Provider
            </Button>
          </Box>
          
          {/* Secondary Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => { navigate('/provider-login'); setMobileOpen(false); }}
              sx={{
                py: 1.2,
                borderRadius: 3,
                fontWeight: 500,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              Provider Login
            </Button>
            
            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="text" 
                  fullWidth
                  onClick={() => { handleSignIn(); setMobileOpen(false); }}
                  sx={{
                    py: 1.2,
                    borderRadius: 3,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="text" 
                  fullWidth
                  onClick={() => { handleSignUp(); setMobileOpen(false); }}
                  sx={{
                    py: 1.2,
                    borderRadius: 3,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            ) : (
              <Button 
                variant="text" 
                fullWidth
                startIcon={<Logout fontSize="small" />}
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                sx={{
                  py: 1.2,
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const oldDrawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 72
      }}>
        <Box
          component="img"
          src={wandercallLogo}
          alt="wandercall"
          sx={{
            height: 80,
            width: 80,
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'
          }}
        />
        <IconButton 
          onClick={() => setMobileOpen(false)}
          sx={{ 
            p: 1,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Main Navigation */}
      <Box sx={{ px: 2, py: 3 }}>
        <Typography variant="overline" sx={{ 
          px: 1, 
          color: 'text.secondary', 
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.5px'
        }}>
          Navigation
        </Typography>
        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <ListItem 
              key={item.label}
              onClick={() => {
                handleNavItemClick(item.route);
                setMobileOpen(false);
              }}
              sx={{ 
                py: 1.5, 
                px: 2,
                borderRadius: 2, 
                mb: 0.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 36,
                color: 'text.secondary'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Information Links */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="overline" sx={{ 
          px: 1, 
          color: 'text.secondary', 
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.5px'
        }}>
          Information
        </Typography>
        <List sx={{ py: 1 }}>
          {footerItems.map((item) => (
            <ListItem 
              key={item.label}
              onClick={() => {
                handleNavItemClick(item.route);
                setMobileOpen(false);
              }}
              sx={{ 
                py: 1, 
                px: 2,
                borderRadius: 2, 
                mb: 0.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 36,
                color: 'text.secondary'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Spacer */}
      <Box sx={{ flex: 1 }} />
      
      {/* Theme Toggle */}
      <Box sx={{ 
        px: 3, 
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Theme
        </Typography>
        <ThemeToggle />
      </Box>
      
      {/* Action Buttons */}
      <Box sx={{ p: 2, pt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Primary Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => { handleJoinWaitlist(); setMobileOpen(false); }}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Join Waitlist
          </Button>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => { handleBecomeProvider(); setMobileOpen(false); }}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #f59e0b, #f97316)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Become a Provider
          </Button>
        </Box>
        
        {/* Secondary Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => { navigate('/provider-login'); setMobileOpen(false); }}
            sx={{
              py: 1.25,
              borderRadius: 3,
              fontWeight: 500,
              fontSize: '0.9rem',
              textTransform: 'none',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            Provider Login
          </Button>
          
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="text" 
                fullWidth
                onClick={() => { handleSignIn(); setMobileOpen(false); }}
                sx={{
                  py: 1.25,
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="text" 
                fullWidth
                onClick={() => { handleSignUp(); setMobileOpen(false); }}
                sx={{
                  py: 1.25,
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <Button 
              variant="text" 
              fullWidth
              startIcon={<Logout fontSize="small" />}
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              sx={{
                py: 1.25,
                borderRadius: 3,
                fontWeight: 500,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Logout
            </Button>
          )}
        </Box>
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
              <Box
                onClick={() => navigate('/search')}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  mr: 1,
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : '#ffffff',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.2)' 
                    : 'none',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? 'none' 
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.15)'
                      : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? 'none' 
                      : '0 4px 12px rgba(0, 0, 0, 0.12)',
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Search sx={{ 
                  color: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'rgba(0, 0, 0, 0.6)'
                }} />
                <Typography sx={{ 
                  color: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.6)', 
                  fontSize: '1rem',
                  flex: 1
                }}>
                  Search experiences...
                </Typography>
              </Box>
              <Box>
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
              <Box
                onClick={() => navigate('/search')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  minWidth: 300,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : '#ffffff',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.2)' 
                    : 'none',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? 'none' 
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.15)'
                      : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? 'none' 
                      : '0 4px 12px rgba(0, 0, 0, 0.12)',
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Search sx={{ 
                  color: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'rgba(0, 0, 0, 0.6)'
                }} />
                <Typography sx={{ 
                  color: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.7)'
                    : 'rgba(0, 0, 0, 0.6)', 
                  fontSize: '0.875rem'
                }}>
                  Search experiences...
                </Typography>
              </Box>
              
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
                <Button 
                  variant="outlined" 
                  className="provider-login-btn"
                  onClick={() => navigate('/provider-login')}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }
                  }}
                >
                  Provider Login
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
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;