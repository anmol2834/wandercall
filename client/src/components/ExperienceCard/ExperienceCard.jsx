import { IconButton, CircularProgress } from '@mui/material';
import { FavoriteBorder, Favorite, Star, LocationOn } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAverageRating } from '../../redux/slices/reviewsSlice';
import { wishlistService } from '../../services/wishlistService';
import { useAuth } from '../../contexts/AuthContext';
import './ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get wishlist status from global state
  const isWishlisted = useSelector(state => 
    state.wishlist.status[experience._id] || false
  );
  
  // Get calculated average rating from reviews only (no fallback to product rating)
  const displayRating = useSelector(state => selectAverageRating(state, experience._id));



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
        await wishlistService.removeFromWishlist(experience._id);
      } else {
        await wishlistService.addToWishlist(experience._id, experience);
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
              <span className="rating-value">{displayRating}</span>
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