import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  IconButton, Button, Rating, Chip, Paper, Fab, CircularProgress
} from '@mui/material';
import {
  FavoriteBorder, LocationOn, Star, 
  BookmarkBorder, Share, FilterList, DeleteOutline
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { wishlistAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setRemovingItems(prev => new Set([...prev, productId]));
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Nature': return '#10b981';
      case 'Adventure': return '#f59e0b';
      case 'Luxury': return '#8b5cf6';
      default: return '#6366f1';
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'Nature': return '🌿';
      case 'Adventure': return '⛰️';
      case 'Luxury': return '✨';
      default: return '🎯';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    💖 My Wishlist
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Your saved experiences and dream destinations
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Chip label={`${wishlistItems.length} Saved Items`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                    <Chip label="Ready to Book" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ textAlign: 'center' }}
                >
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)" />
                    <text x="50" y="60" textAnchor="middle" fill="white" fontSize="30">💖</text>
                  </svg>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <Grid container spacing={3}>
          {[1,2,3,4,5,6].map(i => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  height: 480
                }}>
                  <Box sx={{ height: 220, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px 12px 0 0' }} />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ width: '80%', height: 20, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 1 }} />
                    <Box sx={{ width: '60%', height: 16, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 2 }} />
                    <Box sx={{ width: '90%', height: 14, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 1 }} />
                    <Box sx={{ width: '70%', height: 14, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ width: '40%', height: 24, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
                      <Box sx={{ width: 80, height: 32, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {wishlistItems.length} Dream Destinations
            </Typography>
          </Box>

          {/* Wishlist Items */}
          <Grid container spacing={3}>
            {wishlistItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -8 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                height: 480,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <>
                  {/* Image Section */}
                  <Box sx={{ 
                    height: 220,
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img
                      src={item.product.img1}
                      alt={item.product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* SOON Tag */}
                    <Chip
                      label="SOON"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: '#667eea',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />

                    {/* Action Buttons */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1.5 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.product._id)}
                          disabled={removingItems.has(item.product._id)}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            width: 32,
                            height: 32,
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                          }}
                        >
                          {removingItems.has(item.product._id) ? (
                            <CircularProgress size={16} sx={{ color: 'white' }} />
                          ) : (
                            <DeleteOutline sx={{ fontSize: '1.2rem' }} />
                          )}
                        </IconButton>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          size="small"
                          onClick={() => navigator.share?.({ title: item.product.title, url: `${window.location.origin}/experience/${item.product._id}` })}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            width: 32,
                            height: 32,
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                          }}
                        >
                          <Share sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                      </motion.div>
                    </Box>


                  </Box>

                  {/* Content Section */}
                  <CardContent sx={{ 
                    p: 3, 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 0
                  }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                          {item.product.title}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {item.product.location?.city}, {item.product.location?.state}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={item.product.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                            {item.product.rating} (247)
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label={item.duration} size="small" variant="outlined" />
                        <Chip label={item.difficulty} size="small" variant="outlined" />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: getCategoryColor(item.product.company_Name), fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            ₹{item.product.price}
                          </Typography>
                          {item.product.mrp && (
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              ₹{item.product.mrp}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => navigate(`/booking/${item.product._id}`)}
                        sx={{ 
                          borderRadius: 2,
                          background: `linear-gradient(45deg, ${getCategoryColor(item.product.company_Name)}, ${getCategoryColor(item.product.company_Name)}80)`,
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          px: 2
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </>
              </Card>
            </motion.div>
          </Grid>
        ))}
          </Grid>
        </>
      )}

      {!loading && wishlistItems.length === 0 && (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center', 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FavoriteBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          </motion.div>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Your wishlist is empty</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start adding experiences you'd love to try!
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/')}
            sx={{ borderRadius: 3 }}
          >
            Explore Experiences
          </Button>
        </Paper>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }}
      >
        <FilterList />
      </Fab>
    </Container>
  );
};

export default WishlistPage;