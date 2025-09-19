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
          wandercall
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
        <Typography variant="h2" sx={{ mb: 2, textAlign: 'center', color: 'white' }}>
          {slides[currentSlide].title}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={scrollToExplore}
          sx={{ fontSize: '1.2rem', px: 4, py: 1.5 }}
        >
          Explore
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSlideshow;