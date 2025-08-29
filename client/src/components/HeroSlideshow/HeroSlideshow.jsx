import { useState, useEffect } from 'react';
import { Box, Typography, Button, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './HeroSlideshow.css';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    title: 'Mountain Adventures',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop',
    title: 'Beach Escapes',
  },
  {
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
    title: 'Forest Retreats',
  },
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToExplore = () => {
    document.getElementById('experiences').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box className="hero-container">
      {slides.map((slide, index) => (
        <Box
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          sx={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
          }}
        />
      ))}
      
      <Toolbar sx={{ position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          WanderCall
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button color="inherit" onClick={() => navigate('/about')} sx={{ '&:hover': { textDecoration: 'underline' } }}>
            About Us
          </Button>
          <Button color="inherit" onClick={() => navigate('/terms-and-conditions')} sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Terms
          </Button>
          <Button color="inherit" onClick={() => navigate('/privacy')} sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Privacy
          </Button>
          <Button color="inherit" onClick={() => navigate('/contact')} sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Contact
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Box>
      </Toolbar>
      
      <Box className="hero-content">
        <Typography variant="h2" sx={{ mb: 4, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          {slides[currentSlide].title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={scrollToExplore}
            sx={{ 
              fontSize: '1.2rem', 
              px: 4, 
              py: 1.5,
              minWidth: 160,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Explore
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/waitlist')}
            sx={{ 
              fontSize: '1.2rem', 
              px: 4, 
              py: 1.5,
              minWidth: 160,
              borderColor: 'white',
              color: 'white',
              borderWidth: 2,
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
      </Box>
    </Box>
  );
};

export default HeroSlideshow;