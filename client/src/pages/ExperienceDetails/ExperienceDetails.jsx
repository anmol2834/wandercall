import {
  Box, Container, Typography, Button, Card, CardContent, Grid, Chip, Avatar,
  IconButton, Rating, useTheme, useMediaQuery, Fab, Stack, Paper, Divider
} from '@mui/material';
import {
  ArrowBack, Share, LocationOn, FavoriteBorder, Favorite, Schedule,
  KeyboardArrowUp, ExpandMore, ExpandLess, Star, NavigateNext, NavigateBefore,
  AccessTime, Group, Language, CheckCircle, ThumbUp, ThumbDown
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/slices/productsSlice';
import { wishlistAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress } from '@mui/material';
import wandercallLogo2 from '../../assets/wandercall-logo2.svg';

const ExperienceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, productLoading, error } = useSelector(state => state.products);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [reviewLikes, setReviewLikes] = useState({});
  const [reviewDislikes, setReviewDislikes] = useState({});
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      if (user) {
        checkWishlistStatus();
      }
    }
  }, [dispatch, id, user]);

  const checkWishlistStatus = async () => {
    if (!user || !id) return;
    try {
      const response = await wishlistAPI.checkWishlistStatus(id);
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading and error states
  if (productLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: theme.palette.background.default,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        p: 3
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                {[1,2,3].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>
                    <Box sx={{ width: 80, height: 24, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }} />
                  </motion.div>
                ))}
              </Box>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Box sx={{ width: '70%', height: 40, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 2 }} />
              </motion.div>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>
                <Box sx={{ width: { xs: '100%', md: '100%' }, height: { xs: 250, md: 450 }, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, mb: 3 }} />
              </motion.div>
              {[1,2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}>
                  <Box sx={{ width: '100%', height: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 2 }} />
                </motion.div>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>
                <Box sx={{ width: '100%', height: 300, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 2 }} />
              </motion.div>
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}>
                <Box sx={{ width: '100%', height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Experience not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
      </Box>
    );
  }

  // Map product data to experience format for UI compatibility
  const experience = {
    id: product._id,
    title: product.title,
    location: `${product.location.city}, ${product.location.state}`,
    category: product.company_Name,
    price: product.price,
    originalPrice: product.mrp,
    rating: product.rating,
    reviewCount: 247, // Static for now
    duration: (() => {
      const start = new Date(`1970-01-01 ${product.openTime}`);
      const end = new Date(`1970-01-01 ${product.closeTime}`);
      const diff = (end - start) / (1000 * 60 * 60);
      return `${diff} hours`;
    })(),
    groupSize: "2-15 people", // Static for now
    language: "English, Hindi", // Static for now
    images: [product.img1, product.img2, product.img3, product.img4].filter(Boolean),
    badges: ['Best Seller', 'Trending'], // Static for now
    description: product.description,
    fullDescription: product.description,
    timings: { start: product.openTime, end: product.closeTime, days: "Daily" },
    highlights: product.whatsIncluded,
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleImageChange = (index) => setCurrentImageIndex(index);
  const handlePrevImage = () => setCurrentImageIndex(prev => prev === 0 ? experience.images.length - 1 : prev - 1);
  const handleNextImage = () => setCurrentImageIndex(prev => prev === experience.images.length - 1 ? 0 : prev + 1);
  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(id);
        setIsWishlisted(false);
      } else {
        await wishlistAPI.addToWishlist(id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };
  const handleShare = () => navigator.share?.({ title: experience.title, url: window.location.href });
  const handleBookNow = () => navigate(`/booking/${id}`, { state: { experience } });
  const handleLocationClick = () => window.open(product.location.mapLink || `https://maps.google.com/?q=${encodeURIComponent(experience.location)}`, '_blank');

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
      backgroundColor: theme.palette.background.default,
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1e3c72 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Fixed Header */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1100,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        width: '100%'
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              <Box 
                component="img"
                src={wandercallLogo2}
                alt="WanderCall"
                sx={{
                  height: { xs: 36, sm: 42 },
                  width: 'auto',
                  cursor: 'pointer',
                  filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'
                }}
                onClick={() => navigate('/')}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleWishlistToggle} color={isWishlisted ? 'primary' : 'default'} size="small">
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {wishlistLoading ? (
                      <CircularProgress size={20} sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} />
                    ) : (
                      isWishlisted ? <Favorite sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} /> : <FavoriteBorder sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} />
                    )}
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
                <Chip label="SOON" sx={{ backgroundColor: '#667eea', color: 'white' }} size="small" />
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
                <Card sx={{ 
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Box sx={{ position: 'relative', height: { xs: 250, md: 450 } }}>
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
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
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
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
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
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
                        Book Your experience
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', justifyContent: 'center', mb: 0.5 }}>
                          <Typography variant="h4" fontWeight={700} color="primary.main">
                            ₹{experience.price}
                          </Typography>
                          <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                            ₹{experience.originalPrice}
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
                          Book Now - ₹{experience.price}
                        </Button>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={wishlistLoading ? <CircularProgress size={16} sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} /> : (isWishlisted ? <Favorite sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} /> : <FavoriteBorder sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} />)}
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
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
                        Book Your Adventure
                      </Typography>
                      
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <motion.div
                        >
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', justifyContent: 'center', mb: 0.5 }}>
                            <motion.div
                          
                            >
                              <Typography variant="h4" fontWeight={700} color="primary.main">
                                ₹{experience.price}
                              </Typography>
                            </motion.div>
                            <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                              ₹{experience.originalPrice}
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
                            Book Now - ₹{experience.price}
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
                                  {wishlistLoading ? (
                                    <CircularProgress size={16} sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} />
                                  ) : (
                                    isWishlisted ? <Favorite sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} /> : <FavoriteBorder sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} />
                                  )}
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
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
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
                    ₹{experience.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    per person
                  </Typography>
                </Box>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    startIcon={isWishlisted ? <Favorite /> : <FavoriteBorder />}
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