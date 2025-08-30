import { IconButton, CircularProgress } from '@mui/material';
import { FavoriteBorder, Favorite, Star, LocationOn } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && experience._id) {
      checkWishlistStatus();
    }
  }, [user, experience._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistAPI.checkWishlistStatus(experience._id);
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleCardClick = () => {
    navigate(`/experience/${experience._id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/signin');
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(experience._id);
        setIsWishlisted(false);
      } else {
        await wishlistAPI.addToWishlist(experience._id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="experience-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-section">
        {!imageLoaded && <div className="image-placeholder" />}
        <img 
          src={experience.img1} 
          alt={experience.title}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="category-badge">SOON</div>
        <IconButton 
          className="wishlist-button"
          onClick={handleWishlistClick}
          size="small"
        >
          {wishlistLoading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            isWishlisted ? <Favorite sx={{ color: 'white' }} /> : <FavoriteBorder sx={{ color: 'white' }} />
          )}
        </IconButton>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{experience.title}</h3>
        <div className="location">
          <LocationOn className="location-icon" />
          <span className="location-text">{experience.location?.city}, {experience.location?.state}</span>
        </div>
        <p className="card-description">{experience.description?.substring(0, 100)}...</p>
        
        <div className="card-footer">
          <div className="card-details">
            <div className="rating">
              <Star className="star-icon" />
              <span className="rating-value">{experience.rating}</span>
            </div>
            <div className="price">
              <span className="current-price">₹{experience.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;