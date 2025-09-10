import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { nextPage, prevPage } from '../../redux/slices/experiencesSlice';
import { fetchProducts } from '../../redux/slices/productsSlice';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import SEO from '../../components/SEO/SEO';
import { getPageSEO } from '../../utils/seoData';
import Slideshow from '../../components/Slideshow/Slideshow';
import ExperienceCard from '../../components/ExperienceCard/ExperienceCard';
import CardSkeleton from '../../components/CardSkeleton/CardSkeleton';

import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { experiences, currentPage, itemsPerPage } = useSelector((state) => state.experiences);
  const { products, loading } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useAuth();
  
  usePageTitle('Home');
  const seoData = getPageSEO('home');

  useEffect(() => {
    dispatch(fetchProducts()); 
  }, [dispatch]);

  // Use products data instead of experiences
  const currentExperiences = products.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <>
      <SEO {...seoData} />
      <Box className="home-container">
      {/* Modern Background Elements */}
      <div className="homepage-bg-elements">
        <div className="homepage-bg-camera" />
        <div className="homepage-bg-mountain" />
        <div className="homepage-bg-compass" />
        <div className="homepage-bg-plane" />
        <div className="homepage-bg-star" />
        <div className="homepage-bg-heart" />
        <div className="homepage-bg-location" />
        <div className="homepage-bg-ticket" />
        <div className="homepage-bg-backpack" />
        <div className="homepage-bg-tent" />
        <div className="homepage-bg-binoculars" />
        <div className="homepage-bg-map" />
        <div className="homepage-bg-trophy" />
        <div className="homepage-bg-calendar" />
        <div className="homepage-bg-sun" />
        <div className="homepage-bg-moon" />
        <div className="homepage-bg-wave" />
        <div className="homepage-bg-tree" />
        <div className="homepage-bg-fire" />
        <div className="homepage-bg-balloon" />
        <div className="homepage-bg-gradient-1" />
        <div className="homepage-bg-gradient-2" />
        <div className="homepage-bg-gradient-3" />
        <div className="homepage-bg-dots" />
        <div className="homepage-bg-mesh" />
      </div>
      
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
                key={experience._id}
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
    </>
  );
};

export default Home;