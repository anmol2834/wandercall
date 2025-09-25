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
import { fetchReviews, clearReviews, selectAverageRating, selectReviewCount } from '../../redux/slices/reviewsSlice';
import { toggleReviewLike } from '../../redux/slices/reviewLikesSlice';
import { wishlistService } from '../../services/wishlistService';
import ManualReviewForm from '../../components/ManualReviewForm/ManualReviewForm';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress } from '@mui/material';
import wandercallLogo2 from '../../assets/wandercall-logo2.svg';
import ImageLoader from '../../components/ImageLoader/ImageLoader';

const ExperienceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, productLoading, error } = useSelector(state => state.products);
  const { reviews: dbReviews, loading: reviewsLoading } = useSelector(state => state.reviews);
  
  // Get calculated average rating and review count from reviews
  const averageRating = useSelector(state => selectAverageRating(state, id));
  const reviewCount = useSelector(state => selectReviewCount(state, id));
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Get wishlist status from global state
  const isWishlisted = useSelector(state => 
    state.wishlist.status[id] || false
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const { likes: reviewLikes, loading: likesLoading } = useSelector(state => state.reviewLikes);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchReviews(id));
    }
    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

  const checkWishlistStatus = async () => {
    if (!user || !product?._id) return;
    try {
      await wishlistService.initializeWishlist();
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };



  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading state - show wireframe while fetching
  if (productLoading || (!product && !error)) {
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
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              {/* Title skeleton */}
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Box sx={{ 
                  width: '80%', 
                  height: 32, 
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  borderRadius: 2, 
                  mb: 2 
                }} />
              </motion.div>
              
              {/* Image skeleton */}
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>
                <Box sx={{ 
                  width: '100%', 
                  height: { xs: 250, md: 400 }, 
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  borderRadius: 3, 
                  mb: 3 
                }} />
              </motion.div>
              
              {/* Content skeletons */}
              {[1,2,3].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
                  <Box sx={{ 
                    width: i === 1 ? '90%' : i === 2 ? '70%' : '85%', 
                    height: 20, 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                    borderRadius: 2, 
                    mb: 1.5 
                  }} />
                </motion.div>
              ))}
            </Grid>
            
            <Grid item xs={12} lg={4}>
              {/* Sidebar skeleton */}
              <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                <Box sx={{ 
                  width: '100%', 
                  height: 300, 
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
                  borderRadius: 3 
                }} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Only show error after loading is complete and no product found
  if (error || (!productLoading && !product)) {
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
    rating: averageRating, // Only use calculated rating from reviews
    reviewCount: reviewCount, // Only use actual review count from reviews collection
    duration: (() => {
      const start = new Date(`1970-01-01 ${product.openTime}`);
      const end = new Date(`1970-01-01 ${product.closeTime}`);
      const diff = (end - start) / (1000 * 60 * 60);
      return `${diff} hours`;
    })(),
    groupSize: "2-15 people", // Static for now
    language: "English, Hindi", // Static for now
    images: [product.img1, product.img2, product.img3, product.img4, product.img5, product.img6].filter(Boolean),
    badges: ['Best Seller', 'Trending'], // Static for now
    description: product.description,
    fullDescription: product.description,
    timings: { start: product.openTime, end: product.closeTime, days: "Daily" },
    highlights: product.whatsIncluded,
    reviews: dbReviews.map(review => ({
      id: review._id,
      name: review.name,
      avatar: review.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      rating: review.rating,
      date: new Date(review.createdAt).toLocaleDateString(),
      comment: review.comment,
      likes: review.likes || 0,
      likedBy: review.likedBy || []
    }))
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
    
    if (!id || !product?._id) {
      console.error('Product ID not available');
      return;
    }
    
    setWishlistLoading(true);
    
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product._id);
      } else {
        await wishlistService.addToWishlist(product._id, product);
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

  const handleReviewLike = async (reviewId) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    
    dispatch(toggleReviewLike({ reviewId, token }));
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
                alt="wandercall"
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
      <Container maxWidth="lg" sx={{ 
        py: 3, 
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 12, md: 3 } // Extra bottom padding on mobile for fixed bottom bar
      }}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {!product.active && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Chip label="SOON" sx={{ backgroundColor: '#667eea', color: 'white' }} size="small" />
                </motion.div>
              )}
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
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : '#ffffff',
                  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                  <Box sx={{ position: 'relative', height: { xs: 250, md: 450 } }}>
                    <AnimatePresence mode="wait">
                      <ImageLoader
                        key={currentImageIndex}
                        src={experience.images[currentImageIndex]}
                        alt={experience.title}
                        sx={{ width: '100%', height: '100%', borderRadius: 0 }}
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
                            <ImageLoader
                              src={image}
                              alt={`View ${index + 1}`}
                              sx={{ width: '100%', height: '100%', borderRadius: 1 }}
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
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : '#ffffff',
                  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.12)'
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
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : '#ffffff',
                  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.12)'
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
                                <CheckCircle color="success" sx={{ fontSize: 16, color: theme.palette.mode === 'light' ? '#4f46e5' : 'currentColor' }} />
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
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid rgba(99, 102, 241, 0.3)' 
                      : '1px solid rgba(99, 102, 241, 0.2)'
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
                          per person • Save ₹{experience.originalPrice - experience.price}!
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleBookNow}
                          disabled={!product.active}
                          sx={{ py: 1.5, fontWeight: 600 }}
                        >
                          {product.active ? `Book Now - ₹${experience.price}` : 'Coming Soon'}
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
              {(['anmolsinha4321@gmail.com', 'rishi.sinha0101@gmail.com', 'sp9094065@gmail.com'].includes(user?.email)) && (
                <Card>
                  <CardContent>
                    <ManualReviewForm productId={id} />
                  </CardContent>
                </Card>
              )}
              
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
                                disabled={likesLoading[review.id]}
                                sx={{
                                  color: (reviewLikes[review.id] ? reviewLikes[review.id].liked : review.likedBy?.includes(user?._id)) ? '#ffffff' : 'inherit',
                                  backgroundColor: (reviewLikes[review.id] ? reviewLikes[review.id].liked : review.likedBy?.includes(user?._id)) ? '#10b981' : 'transparent',
                                  border: (reviewLikes[review.id] ? reviewLikes[review.id].liked : review.likedBy?.includes(user?._id)) ? '1px solid #10b981' : '1px solid rgba(0, 0, 0, 0.12)',
                                  opacity: likesLoading[review.id] ? 0.6 : 1,
                                  '&:hover': {
                                    backgroundColor: (reviewLikes[review.id] ? reviewLikes[review.id].liked : review.likedBy?.includes(user?._id)) ? '#059669' : 'rgba(16, 185, 129, 0.1)',
                                    color: (reviewLikes[review.id] ? reviewLikes[review.id].liked : review.likedBy?.includes(user?._id)) ? '#ffffff' : '#10b981'
                                  }
                                }}
                              >
                                {reviewLikes[review.id]?.count ?? review.likes ?? 0}
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
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    border: theme.palette.mode === 'dark' 
                      ? '1px solid rgba(99, 102, 241, 0.3)' 
                      : '1px solid rgba(99, 102, 241, 0.2)'
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
                          per person • Save ₹{experience.originalPrice - experience.price}!
                        </Typography>
                      </Box>

                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                            <AccessTime color="primary" sx={{ fontSize: 16, mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                              Experience Starts
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {experience.timings.start}
                            </Typography>
                          </Paper>
                        </Grid>
                        {experience.timings.end && experience.timings.end.trim() && (
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
                        )}
                      </Grid>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handleBookNow}
                            disabled={!product.active}
                            sx={{ py: 1, fontWeight: 600 }}
                          >
                            {product.active ? `Book Now - ₹${experience.price}` : 'Coming Soon'}
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
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : '#ffffff',
                  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.12)'
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
                      <Typography variant="body2" color="text.secondary">Starts At</Typography>
                      <Typography variant="body2" fontWeight={600}>{experience.timings.start}</Typography>
                    </Box>
                    
                    {experience.timings.end && experience.timings.end.trim() && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Ends At</Typography>
                        <Typography variant="body2" fontWeight={600}>{experience.timings.end}</Typography>
                      </Box>
                    )}
                    
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
                    startIcon={wishlistLoading ? <CircularProgress size={16} sx={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }} /> : (isWishlisted ? <Favorite /> : <FavoriteBorder />)}
                    onClick={handleWishlistToggle}
                    color={isWishlisted ? "primary" : "inherit"}
                    size="small"
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading ? 'Saving...' : 'Save'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={handleBookNow}
                    disabled={!product.active}
                    sx={{ fontWeight: 600 }}
                  >
                    {product.active ? 'Book Now' : 'Coming Soon'}
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