import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { nextPage, prevPage } from '../../redux/slices/experiencesSlice';
import { useAuth } from '../../contexts/AuthContext';
import Slideshow from '../../components/Slideshow/Slideshow';
import ExperienceCard from '../../components/ExperienceCard/ExperienceCard';
import CardSkeleton from '../../components/CardSkeleton/CardSkeleton';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import BackgroundAnimation from '../../components/BackgroundAnimation/BackgroundAnimation';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { experiences, currentPage, itemsPerPage, loading } = useSelector((state) => state.experiences);
  const { user, isAuthenticated } = useAuth();

  const currentExperiences = experiences.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(experiences.length / itemsPerPage);

  return (
    <Box className="home-container">
      {/* Animated Background */}
      <BackgroundAnimation />
      
      {/* Hero Slideshow */}
      <Slideshow />
      
      {/* Sticky Navigation */}
      <Navbar />
      
      {/* Experiences Section */}
      <Box id="experiences-section" className="experiences-section">
        <Box className="section-header">
          <Typography variant="h2" className="section-title">
            Explore Unique Experiences
          </Typography>
          <Typography variant="h6" className="section-subtitle">
            Discover extraordinary adventures curated just for you
          </Typography>
        </Box>
        
        <div className="cards-container">
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : (
            currentExperiences.map((experience, index) => (
              <div 
                key={experience.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ExperienceCard experience={experience} />
              </div>
            ))
          )}
        </div>
        
        <Box className="pagination-controls">
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => dispatch(prevPage())}
            disabled={currentPage === 0}
            className="pagination-btn prev-btn"
          >
            Previous
          </Button>
          
          <Box className="page-indicator">
            <Typography variant="body1" className="page-text">
              Page {currentPage + 1} of {totalPages}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => dispatch(nextPage())}
            disabled={currentPage >= totalPages - 1}
            className="pagination-btn next-btn"
          >
            Next
          </Button>
        </Box>
      </Box>
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;