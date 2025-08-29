import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './SignInSlideshow.css';

const slides = [
  {
    title: 'Discover Amazing Experiences',
    subtitle: 'Connect with adventures that match your passion and create unforgettable memories',
    illustration: (
      <svg viewBox="0 0 400 300" className="slide-illustration">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="150" r="80" fill="url(#grad1)" opacity="0.2" />
        <rect x="160" y="110" width="80" height="80" rx="10" fill="url(#grad1)" />
        <circle cx="180" cy="130" r="8" fill="white" />
        <circle cx="220" cy="130" r="8" fill="white" />
        <path d="M170 160 Q200 180 230 160" stroke="white" strokeWidth="3" fill="none" />
      </svg>
    )
  },
  {
    title: 'Join Our Community',
    subtitle: 'Be part of a vibrant community of explorers and adventure seekers from around the world',
    illustration: (
      <svg viewBox="0 0 400 300" className="slide-illustration">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="120" r="30" fill="url(#grad2)" />
        <circle cx="200" cy="100" r="35" fill="url(#grad1)" />
        <circle cx="250" cy="120" r="30" fill="url(#grad2)" />
        <path d="M120 180 Q200 160 280 180 Q200 200 120 180" fill="url(#grad1)" opacity="0.3" />
      </svg>
    )
  },
  {
    title: 'Start Your Journey',
    subtitle: 'Take the first step towards incredible adventures and life-changing experiences',
    illustration: (
      <svg viewBox="0 0 400 300" className="slide-illustration">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>
        <path d="M100 200 Q200 100 300 200" stroke="url(#grad3)" strokeWidth="8" fill="none" />
        <circle cx="300" cy="200" r="12" fill="url(#grad3)" />
        <polygon points="290,190 310,200 290,210" fill="white" />
      </svg>
    )
  }
];

const SignInSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box className="signin-slideshow-container">
      <div className="slideshow-background" />
      
      <Box className="slideshow-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="slide-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="slide-illustration-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {slides[currentSlide].illustration}
            </motion.div>
            
            <motion.div
              className="slide-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography variant="h4" className="slide-title">
                {slides[currentSlide].title}
              </Typography>
              <Typography variant="body1" className="slide-subtitle">
                {slides[currentSlide].subtitle}
              </Typography>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <Box className="slide-indicators">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
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

export default SignInSlideshow;