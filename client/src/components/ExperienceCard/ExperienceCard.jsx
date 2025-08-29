import { IconButton } from '@mui/material';
import { FavoriteBorder, Favorite, Star, LocationOn } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/experience/${experience.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="experience-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-section">
        {!imageLoaded && <div className="image-placeholder" />}
        <img 
          src={experience.image} 
          alt={experience.title}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="category-badge">Soon</div>
        <IconButton 
          className="wishlist-button"
          onClick={handleWishlistClick}
          size="small"
        >
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{experience.title}</h3>
        <div className="location">
          <LocationOn className="location-icon" />
          <span className="location-text">{experience.location || 'Surat, Gujarat'}</span>
        </div>
        <p className="card-description">{experience.description}</p>
        
        <div className="card-footer">
          <div className="card-details">
            <div className="rating">
              <Star className="star-icon" />
              <span className="rating-value">{experience.rating}</span>
            </div>
            <div className="price">₹{experience.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;