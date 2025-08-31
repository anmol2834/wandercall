import { useState, useEffect } from 'react';
import { Box, Typography, Button, Toolbar, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Logout } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Slideshow.css';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
    title: 'Mountain Experiences',
    subtitle: 'Discover breathtaking peaks and valleys that will leave you speechless',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&q=80',
    title: 'Ocean Experiences',
    subtitle: 'Dive into crystal clear waters and explore underwater wonders',
  },
  {
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80',
    title: 'Forest Experiences',
    subtitle: 'Find peace in nature\'s embrace and reconnect with yourself',
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&q=80',
    title: 'Desert Experiences',
    subtitle: 'Experience the magic of endless horizons and starlit nights',
  },
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToExperiences = () => {
    document.getElementById('experiences-section').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box className="modern-slideshow">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="slide-background"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
          }}
        />
      </AnimatePresence>

      <div className="slide-overlay" />
      
      <Toolbar className="top-nav">
        <Typography variant="h6" className="logo">
          WanderCall
        </Typography>
        
        <Box className="nav-links">
          <Button color="inherit" className="nav-button" onClick={() => navigate('/about')}>About Us</Button>
          <Button color="inherit" className="nav-button" onClick={() => navigate('/terms-and-conditions')}>Terms</Button>
          <Button color="inherit" className="nav-button" onClick={() => navigate('/privacy')}>Privacy</Button>
          <Button color="inherit" className="nav-button" onClick={() => navigate('/contact')}>Contact</Button>
        </Box>
        
        <Box className="auth-buttons">
          {isAuthenticated ? (
            <Button 
              variant="outlined" 
              className="auth-btn logout-btn"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ 
                borderColor: '#ef4444',
                color: 'white',
                '&:hover': {
                  borderColor: '#dc2626',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button 
                variant="outlined" 
                className="auth-btn signin-btn"
                onClick={() => navigate('/signin')}
                sx={{ 
                  borderColor: '#ffffffff',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(104, 107, 244, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained"
                className="auth-btn signup-btn"
                onClick={() => navigate('/signup')}
                sx={{
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)'
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      
      <Box className="hero-content">
        <motion.div
          key={`title-${currentSlide}`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography variant="h1" className="hero-title">
            {slides[currentSlide].title}
          </Typography>
        </motion.div>
        
        <motion.div
          key={`subtitle-${currentSlide}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Typography variant="h6" className="hero-subtitle">
            {slides[currentSlide].subtitle}
          </Typography>
        </motion.div>
        
        <motion.div
          key={`button-${currentSlide}`}
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 2, sm: 3 }, 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              onClick={scrollToExperiences}
              className="explore-btn"
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Explore Experiences
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/waitlist')}
              sx={{
                borderColor: 'white',
                color: 'white',
                borderWidth: 2,
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 2
                }
              }}
            >
              Join Waitlist
            </Button>
          </Box>
        </motion.div>
      </Box>
      
      <IconButton 
        className="nav-arrow nav-arrow-left"
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        <ArrowBackIos />
      </IconButton>
      
      <IconButton 
        className="nav-arrow nav-arrow-right"
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        <ArrowForwardIos />
      </IconButton>
      
      <Box className="progress-indicators">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`progress-bar ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            initial={false}
            animate={{
              width: index === currentSlide ? '40px' : '12px',
              backgroundColor: index === currentSlide ? '#6366f1' : 'rgba(255, 255, 255, 0.5)'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Slideshow;