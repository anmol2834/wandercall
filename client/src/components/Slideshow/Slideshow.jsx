import { useState, useEffect } from 'react';
import { Box, Typography, Button, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Logout } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Slideshow.css';

// Import images
import wandercallLogo1 from '../../assets/wandercall-logo1.svg';

const slides = [
  {
    imageH: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748481/fpv_drone_H_vjzfyw.png",
    imageV: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748504/fpv_drone_V_xskhhb.png",
    title: 'FPV Drone Adventures',
    subtitle: 'Experience breathtaking aerial photography and videography like never before',
  },
  {
    imageH: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748542/gamer_bash_H_obg8qk.png",
    imageV: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748541/gamer_bash_V_b9pwli.png",
    title: 'Gamer Bash Events',
    subtitle: 'Join epic gaming tournaments and connect with fellow gamers',
  },
  {
    imageH: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748528/late_night_party_H_wvp8bn.png",
    imageV: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748522/late_night_party_V_elqssc.png",
    title: 'Late Night Parties',
    subtitle: 'Dance the night away with unforgettable party experiences',
  },
  {
    imageH: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748538/movie_nights_H_jxkvna.png",
    imageV: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748503/movie_nights_V_tcwf32.png",
    title: 'Movie Nights',
    subtitle: 'Enjoy cinematic experiences under the stars with friends',
  },
  {
    imageH: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748528/story_session_H_svu6lm.png",
    imageV: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748537/story_session_V_jtat6l.png",
    title: 'Story Sessions',
    subtitle: 'Share and listen to captivating stories in intimate settings',
  },
  {
    imageH: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748628/wisdom_hours_H_od9a29.png",
    imageV: "https://res.cloudinary.com/drfndqoql/image/upload/v1756748588/wisdom_hours_V_yfufkb.png",
    title: 'Wisdom Hours',
    subtitle: 'Learn from experts and expand your knowledge horizons',
  },
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const preloadImage = (src, index) => {
    const img = new Image();
    img.onload = () => setImageLoaded(prev => ({ ...prev, [index]: true }));
    img.src = src;
  };

  useEffect(() => {
    slides.forEach((slide, index) => {
      preloadImage(isMobile ? slide.imageV : slide.imageH, index);
    });
  }, [isMobile]);

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
        {imageLoaded[currentSlide] ? (
          <motion.div
            key={currentSlide}
            className="slide-background"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              backgroundImage: `url(${isMobile ? slides[currentSlide].imageV : slides[currentSlide].imageH})`,
            }}
          />
        ) : (
          <motion.div
            key={`skeleton-${currentSlide}`}
            className="slide-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.8), transparent)',
                  }}
                />
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="slide-overlay" />
      
      <Toolbar className="top-nav">
        <Box 
          component="img"
          src={wandercallLogo1}
          alt="WanderCall"
          sx={{
            height: { xs: 32, sm: 40 },
            width: 'auto',
            cursor: 'pointer',
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)',
            transform: 'scale(3)',
            transformOrigin: 'center',
            ml: { xs: 3, sm: 3 }
          }}
          onClick={() => navigate('/')}
        />
        
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