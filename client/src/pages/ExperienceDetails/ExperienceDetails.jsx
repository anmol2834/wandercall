import {
  Box, Container, Typography, Button, Card, CardContent, Grid, Chip, Avatar,
  IconButton, Rating, useTheme, useMediaQuery, Fab, Stack, Paper, Divider
} from '@mui/material';
import {
  ArrowBack, Share, LocationOn, BookmarkBorder, Bookmark, Schedule,
  KeyboardArrowUp, ExpandMore, ExpandLess, Star, NavigateNext, NavigateBefore,
  AccessTime, Group, Language, CheckCircle, ThumbUp, ThumbDown
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ExperienceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [reviewLikes, setReviewLikes] = useState({});
  const [reviewDislikes, setReviewDislikes] = useState({});
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const experience = {
    id: id,
    title: "Sunset Desert Safari experience",
    location: "Dubai, UAE",
    category: "experience",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 247,
    duration: "6 hours",
    groupSize: "2-15 people",
    language: "English, Arabic",
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop"
    ],
    badges: ['Best Seller', 'Trending'],
    description: "Experience the magic of the Arabian desert with our premium sunset safari experience. This unforgettable journey takes you through golden sand dunes where you'll witness breathtaking sunset views.",
    fullDescription: "Experience the magic of the Arabian desert with our premium sunset safari experience. This unforgettable journey takes you through golden sand dunes where you'll witness breathtaking sunset views, enjoy traditional Bedouin hospitality, and create memories that will last a lifetime. Our expert guides will ensure your safety while providing insights into the rich culture and history of the region.",
    timings: { start: "3:00 PM", end: "9:00 PM", days: "Daily" },
    highlights: [
      "Professional 4x4 dune bashing",
      "Camel riding experience", 
      "Traditional BBQ dinner",
      "Live entertainment shows",
      "Henna painting & Arabic coffee",
      "Hotel pickup & drop-off"
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "SJ",
        rating: 5,
        date: "2 days ago",
        comment: "Absolutely incredible experience! The sunset views were breathtaking and the guides were fantastic."
      },
      {
        id: 2,
        name: "Mike Chen", 
        avatar: "MC",
        rating: 5,
        date: "1 week ago",
        comment: "Perfect experience for families. Kids loved the camel riding and the food was delicious."
      },
      {
        id: 3,
        name: "Emma Wilson",
        avatar: "EW", 
        rating: 4,
        date: "2 weeks ago",
        comment: "Amazing desert safari! The dune bashing was thrilling and the cultural experience was authentic."
      }
    ]
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleImageChange = (index) => setCurrentImageIndex(index);
  const handlePrevImage = () => setCurrentImageIndex(prev => prev === 0 ? experience.images.length - 1 : prev - 1);
  const handleNextImage = () => setCurrentImageIndex(prev => prev === experience.images.length - 1 ? 0 : prev + 1);
  const handleWishlistToggle = () => setIsWishlisted(!isWishlisted);
  const handleShare = () => navigator.share?.({ title: experience.title, url: window.location.href });
  const handleBookNow = () => navigate(`/booking/${id}`, { state: { experience } });
  const handleLocationClick = () => window.open(`https://maps.google.com/?q=${encodeURIComponent(experience.location)}`, '_blank');

  const handleReviewLike = (reviewId) => {
    setReviewLikes(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
    if (reviewDislikes[reviewId]) {
      setReviewDislikes(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleReviewDislike = (reviewId) => {
    setReviewDislikes(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
    if (reviewLikes[reviewId]) {
      setReviewLikes(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Fixed Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1100,
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%'
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2
          }}>
            <motion.div 
              whileHover={{ scale: 1.1, x: -3 }} 
              whileTap={{ scale: 0.9 }}
              animate={{ x: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <IconButton onClick={() => navigate(-1)} size="small">
                <ArrowBack />
              </IconButton>
            </motion.div>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleWishlistToggle} color={isWishlisted ? 'primary' : 'default'} size="small">
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isWishlisted ? <Bookmark /> : <BookmarkBorder />}
                  </motion.div>
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleShare} size="small">
                  <Share />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleLocationClick} size="small">
                  <LocationOn />
                </IconButton>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Chip label={experience.category} color="primary" size="small" />
              </motion.div>
              {experience.badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Chip
                    label={badge}
                    size="small"
                    color={badge === 'Best Seller' ? 'success' : 'warning'}
                  />
                </motion.div>
              ))}
            </Box>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography variant="h4" fontWeight={700} mb={2}>
                {experience.title}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {experience.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    animate={{ 
                      filter: [
                        "drop-shadow(0px 0px 0px #ffd700)",
                        "drop-shadow(0px 0px 8px #ffd700)",
                        "drop-shadow(0px 0px 0px #ffd700)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rating value={experience.rating} precision={0.1} size="small" readOnly />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {experience.rating}
                    </Typography>
                  </motion.div>
                  <Typography variant="body2" color="text.secondary">
                    ({experience.reviewCount} reviews)
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Two Column Layout */}
        <Grid container spacing={3}>
          {/* Main Column */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card sx={{ overflow: 'hidden' }}>
                  <Box sx={{ position: 'relative', height: { xs: 250, md: 400 } }}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={experience.images[currentImageIndex]}
                        alt={experience.title}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </AnimatePresence>
                  
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <IconButton
                        onClick={handlePrevImage}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                        }}
                      >
                        <NavigateBefore />
                      </IconButton>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <IconButton
                        onClick={handleNextImage}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                        }}
                      >
                        <NavigateNext />
                      </IconButton>
                    </motion.div>
                  
                  <Chip
                    label={`${currentImageIndex + 1}/${experience.images.length}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white'
                    }}
                  />
                </Box>
                
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                      {experience.images.map((image, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Box
                            onClick={() => handleImageChange(index)}
                            sx={{
                              minWidth: 60,
                              height: 45,
                              borderRadius: 1,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: 1,
                              borderColor: currentImageIndex === index ? 'primary.main' : 'transparent',
                              '&:hover': { borderColor: 'primary.light' },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <img
                              src={image}
                              alt={`View ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Card>
              </motion.div>

              {/* About This Experience */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -2 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      About This Experience
                    </Typography>
                    <Typography variant="body2" lineHeight={1.6} mb={2}>
                      {expandedDescription ? experience.fullDescription : experience.description}
                    </Typography>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setExpandedDescription(!expandedDescription)}
                        endIcon={expandedDescription ? <ExpandLess /> : <ExpandMore />}
                        size="small"
                      >
                        {expandedDescription ? 'Show Less' : 'Show More'}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What's Included */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -2 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      What's Included
                    </Typography>
                    <Grid container spacing={1}>
                      {experience.highlights.map((highlight, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 0.5 }}>
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <CheckCircle color="success" sx={{ fontSize: 16 }} />
                              </motion.div>
                              <Typography variant="body2">{highlight}</Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mobile Booking Section */}
              {isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ y: -2 }}
                >
                  <Card sx={{ border: 1, borderColor: 'primary.main' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
                        Book Your experience
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', justifyContent: 'center', mb: 0.5 }}>
                          <Typography variant="h4" fontWeight={700} color="primary.main">
                            ${experience.price}
                          </Typography>
                          <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                            ${experience.originalPrice}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          per person • Save ${experience.originalPrice - experience.price}!
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleBookNow}
                          sx={{ py: 1.5, fontWeight: 600 }}
                        >
                          Book Now - ${experience.price}
                        </Button>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={isWishlisted ? <Bookmark /> : <BookmarkBorder />}
                            onClick={handleWishlistToggle}
                            color={isWishlisted ? "primary" : "inherit"}
                            size="small"
                            sx={{ 
                              '& .MuiButton-startIcon': { 
                                marginRight: 1,
                                marginLeft: 0
                              }
                            }}
                          >
                            {isWishlisted ? 'Saved' : 'Save'}
                          </Button>
                          
                          <IconButton onClick={handleShare} sx={{ border: 1, borderColor: 'divider' }}>
                            <Share fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Guest Reviews */}
              <Card>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 0 },
                    mb: 2 
                  }}>
                    <Typography variant="h6" fontWeight={600}>
                      Guest Reviews ({experience.reviewCount})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Rating value={experience.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" fontWeight={600}>
                        {experience.rating}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Review Navigation */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton 
                        onClick={() => setCurrentReviewIndex(prev => prev === 0 ? Math.max(0, experience.reviews.length - 3) : Math.max(0, prev - 3))}
                        size="small"
                        disabled={experience.reviews.length <= 1}
                      >
                        <NavigateBefore />
                      </IconButton>
                    </motion.div>
                    
                    <Typography variant="body2" color="text.secondary">
                      {Math.floor(currentReviewIndex / 3) + 1} of {Math.ceil(experience.reviews.length / 3)}
                    </Typography>
                    
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton 
                        onClick={() => setCurrentReviewIndex(prev => prev + 3 >= experience.reviews.length ? 0 : prev + 3)}
                        size="small"
                        disabled={experience.reviews.length <= 1}
                      >
                        <NavigateNext />
                      </IconButton>
                    </motion.div>
                  </Box>
                  
                  {/* Current Reviews (3 at a time) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={Math.floor(currentReviewIndex / 3)}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {experience.reviews.slice(currentReviewIndex, currentReviewIndex + 3).map((review) => (
                          <Paper key={review.id} variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {review.avatar}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {review.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Rating value={review.rating} size="small" readOnly />
                                  <Typography variant="caption" color="text.secondary">
                                    {review.date}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" lineHeight={1.5} mb={1}>
                              {review.comment}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                startIcon={<ThumbUp sx={{ fontSize: 14 }} />}
                                onClick={() => handleReviewLike(review.id)}
                                sx={{
                                  color: reviewLikes[review.id] ? '#ffffff' : 'inherit',
                                  backgroundColor: reviewLikes[review.id] ? '#10b981' : 'transparent',
                                  border: reviewLikes[review.id] ? '1px solid #10b981' : '1px solid rgba(0, 0, 0, 0.12)',
                                  '&:hover': {
                                    backgroundColor: reviewLikes[review.id] ? '#059669' : 'rgba(16, 185, 129, 0.1)',
                                    color: reviewLikes[review.id] ? '#ffffff' : '#10b981'
                                  }
                                }}
                              >
                                Helpful
                              </Button>
                              <Button
                                size="small"
                                startIcon={<ThumbDown sx={{ fontSize: 14 }} />}
                                onClick={() => handleReviewDislike(review.id)}
                                sx={{
                                  color: reviewDislikes[review.id] ? '#ffffff' : 'inherit',
                                  backgroundColor: reviewDislikes[review.id] ? '#ef4444' : 'transparent',
                                  border: reviewDislikes[review.id] ? '1px solid #ef4444' : '1px solid rgba(0, 0, 0, 0.12)',
                                  '&:hover': {
                                    backgroundColor: reviewDislikes[review.id] ? '#dc2626' : 'rgba(239, 68, 68, 0.1)',
                                    color: reviewDislikes[review.id] ? '#ffffff' : '#ef4444'
                                  }
                                }}
                              >
                                Not Helpful
                              </Button>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>

            </Box>
          </Grid>

          {/* Sidebar Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Book Your Adventure - Desktop */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card sx={{ 
                    position: 'sticky', 
                    top: 100,
                    border: 1, 
                    borderColor: 'primary.main' 
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
                        Book Your Adventure
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', justifyContent: 'center', mb: 0.5 }}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              animate={{ 
                                textShadow: [
                                  "0px 0px 0px rgba(99, 102, 241, 0)",
                                  "0px 0px 20px rgba(99, 102, 241, 0.5)",
                                  "0px 0px 0px rgba(99, 102, 241, 0)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Typography variant="h4" fontWeight={700} color="primary.main">
                                ${experience.price}
                              </Typography>
                            </motion.div>
                            <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                              ${experience.originalPrice}
                            </Typography>
                          </Box>
                        </motion.div>
                        <Typography variant="body2" color="text.secondary">
                          per person • Save ${experience.originalPrice - experience.price}!
                        </Typography>
                      </Box>

                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                            <AccessTime color="primary" sx={{ fontSize: 16, mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                              Opening Time
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {experience.timings.start}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                            <Schedule color="primary" sx={{ fontSize: 16, mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                              Closing Time
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {experience.timings.end}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handleBookNow}
                            sx={{ py: 1, fontWeight: 600 }}
                          >
                            Book Now - ${experience.price}
                          </Button>
                        </motion.div>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={
                                <motion.div
                                  animate={isWishlisted ? { scale: [1, 1.3, 1] } : {}}
                                  transition={{ duration: 0.3 }}
                                >
                                  {isWishlisted ? <Bookmark /> : <BookmarkBorder />}
                                </motion.div>
                              }
                              onClick={handleWishlistToggle}
                              color={isWishlisted ? "primary" : "inherit"}
                              size="small"
                              sx={{ 
                                '& .MuiButton-startIcon': { 
                                  marginRight: 1,
                                  marginLeft: 0
                                }
                              }}
                            >
                              {isWishlisted ? 'Saved' : 'Save'}
                            </Button>
                          </motion.div>
                          
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton onClick={handleShare} sx={{ border: 1, borderColor: 'divider' }}>
                              <Share fontSize="small" />
                            </IconButton>
                          </motion.div>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Quick Info
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Rating</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <Star sx={{ color: '#ffd700', fontSize: 14 }} />
                        <Typography variant="body2" fontWeight={600}>{experience.rating}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Reviews</Typography>
                      <Typography variant="body2" fontWeight={600}>{experience.reviewCount}+</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Opening</Typography>
                      <Typography variant="body2" fontWeight={600}>{experience.timings.start}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Closing</Typography>
                      <Typography variant="body2" fontWeight={600}>{experience.timings.end}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Language</Typography>
                      <Typography variant="body2" fontWeight={600}>{experience.language}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Safety Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {['Professional guides', 'Safety equipment', '24/7 support', 'Free cancellation'].map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle color="success" sx={{ fontSize: 14 }} />
                          </motion.div>
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
                </Card>
              </motion.div>

            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    ${experience.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    per person
                  </Typography>
                </Box>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    startIcon={isWishlisted ? <Bookmark /> : <BookmarkBorder />}
                    onClick={handleWishlistToggle}
                    color={isWishlisted ? "primary" : "inherit"}
                    size="small"
                  >
                    Save
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={handleBookNow}
                    sx={{ fontWeight: 600 }}
                  >
                    Book Now
                  </Button>
                </motion.div>
              </Box>
            </Container>
          </Box>
        </motion.div>
      )}

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: 'fixed', bottom: isMobile ? 80 : 20, right: 20, zIndex: 1000 }}
          >
            <Fab color="primary" onClick={scrollToTop} size="small">
              <KeyboardArrowUp />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ExperienceDetails;