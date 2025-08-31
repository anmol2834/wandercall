import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './SignUpSlideshow.css';

const slides = [
  {
    title: 'Create Your Adventure Profile',
    subtitle: 'Build a personalized profile that showcases your experiences and connects you with like-minded explorers',
    illustration: (
      <svg viewBox="0 0 400 300" className="slide-illustration">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="120" r="60" fill="url(#grad1)" opacity="0.3" />
        <circle cx="200" cy="120" r="40" fill="url(#grad1)" />
        <circle cx="185" cy="105" r="8" fill="white" />
        <circle cx="215" cy="105" r="8" fill="white" />
        <path d="M175 135 Q200 155 225 135" stroke="white" strokeWidth="3" fill="none" />
        <rect x="160" y="180" width="80" height="60" rx="8" fill="url(#grad2)" opacity="0.8" />
        <rect x="170" y="190" width="60" height="8" rx="4" fill="white" />
        <rect x="170" y="205" width="40" height="6" rx="3" fill="white" opacity="0.7" />
        <rect x="170" y="218" width="50" height="6" rx="3" fill="white" opacity="0.7" />
      </svg>
    )
  },
  {
    title: 'Unlock Exclusive Experiences',
    subtitle: 'Get access to curated adventures, hidden gems, and exclusive deals that are only available to our community members',
    illustration: (
      <svg viewBox="0 0 400 300" className="slide-illustration">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffecd2" />
            <stop offset="100%" stopColor="#fcb69f" />
          </linearGradient>
        </defs>
        <rect x="150" y="80" width="100" height="140" rx="12" fill="url(#grad3)" />
        <circle cx="200" cy="120" r="25" fill="white" opacity="0.9" />
        <polygon points="190,110 210,110 205,130 195,130" fill="url(#grad3)" />
        <rect x="170" y="160" width="60" height="8" rx="4" fill="white" opacity="0.8" />
        <rect x="170" y="175" width="40" height="6" rx="3" fill="white" opacity="0.6" />
        <rect x="170" y="188" width="50" height="6" rx="3" fill="white" opacity="0.6" />
        <circle cx="120" cy="100" r="15" fill="url(#grad4)" opacity="0.7" />
        <circle cx="280" cy="180" r="20" fill="url(#grad4)" opacity="0.5" />
      </svg>
    )
  },
  {
    title: 'Join a Global Community',
    subtitle: 'Connect with experiencers worldwide, share your experiences, and discover new destinations through our vibrant community',
    illustration: (
      <svg viewBox="0 0 400 300" className="slide-illustration">
        <defs>
          <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8edea" />
            <stop offset="100%" stopColor="#fed6e3" />
          </linearGradient>
          <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="150" r="80" fill="url(#grad5)" opacity="0.3" />
        <circle cx="160" cy="130" r="25" fill="url(#grad6)" />
        <circle cx="200" cy="110" r="30" fill="url(#grad6)" />
        <circle cx="240" cy="130" r="25" fill="url(#grad6)" />
        <circle cx="180" cy="180" r="20" fill="url(#grad6)" opacity="0.8" />
        <circle cx="220" cy="180" r="20" fill="url(#grad6)" opacity="0.8" />
        <path d="M120 200 Q200 180 280 200 Q200 220 120 200" fill="url(#grad5)" opacity="0.6" />
      </svg>
    )
  }
];

const SignUpSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box className="signup-slideshow-container">
      <div className="signup-slideshow-background" />
      
      <Box className="signup-slideshow-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="signup-slide-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="signup-slide-illustration-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {slides[currentSlide].illustration}
            </motion.div>
            
            <motion.div
              className="signup-slide-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography variant="h4" className="signup-slide-title">
                {slides[currentSlide].title}
              </Typography>
              <Typography variant="body1" className="signup-slide-subtitle">
                {slides[currentSlide].subtitle}
              </Typography>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <Box className="signup-slide-indicators">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`signup-slide-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpSlideshow;