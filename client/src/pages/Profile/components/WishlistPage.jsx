import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  IconButton, Button, Rating, Chip, Paper, Fab
} from '@mui/material';
import {
  FavoriteBorder, LocationOn, Star, 
  BookmarkBorder, Share, FilterList, DeleteOutline
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const WishlistPage = () => {
  const theme = useTheme();
  const [removedItems, setRemovedItems] = useState(new Set());

  const wishlistItems = [
    {
      id: 1,
      title: 'Northern Lights Adventure',
      location: 'Iceland, Reykjavik',
      rating: 4.8,
      reviews: 124,
      price: '$2,199',
      originalPrice: '$2,599',
      image: '/api/placeholder/350/220',
      category: 'Nature',
      duration: '5 days',
      difficulty: 'Easy',
      discount: 15
    },
    {
      id: 2,
      title: 'Desert Safari Experience',
      location: 'Dubai, UAE',
      rating: 4.6,
      reviews: 89,
      price: '$599',
      originalPrice: '$799',
      image: '/api/placeholder/350/220',
      category: 'Adventure',
      duration: '3 days',
      difficulty: 'Medium',
      discount: 25
    },
    {
      id: 3,
      title: 'Tropical Paradise Getaway',
      location: 'Maldives',
      rating: 4.9,
      reviews: 256,
      price: '$3,299',
      originalPrice: '$3,899',
      image: '/api/placeholder/350/220',
      category: 'Luxury',
      duration: '7 days',
      difficulty: 'Easy',
      discount: 15
    },
    {
      id: 4,
      title: 'Mountain Hiking Expedition',
      location: 'Nepal, Himalayas',
      rating: 4.7,
      reviews: 78,
      price: '$1,899',
      originalPrice: '$2,299',
      image: '/api/placeholder/350/220',
      category: 'Adventure',
      duration: '10 days',
      difficulty: 'Hard',
      discount: 17
    }
  ];

  const removeItem = (itemId) => {
    const newRemovedItems = new Set(removedItems);
    newRemovedItems.add(itemId);
    setRemovedItems(newRemovedItems);
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
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  💖 My Wishlist
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Your saved experiences and dream destinations
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`${wishlistItems.length} Saved Items`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  <Chip label="Ready to Book" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
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

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {wishlistItems.filter(item => !removedItems.has(item.id)).length} Dream Destinations
        </Typography>
      </Box>

      {/* Wishlist Items */}
      <Grid container spacing={3}>
        {wishlistItems.filter(item => !removedItems.has(item.id)).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                    background: `linear-gradient(45deg, ${getCategoryColor(item.category)}40, ${getCategoryColor(item.category)}20)`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Typography sx={{ fontSize: '3rem' }}>
                        {getCategoryEmoji(item.category)}
                      </Typography>
                    </motion.div>

                    {/* Action Buttons */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1.5 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            width: 32,
                            height: 32,
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                          }}
                        >
                          <DeleteOutline sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                          size="small"
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
                          {item.title}
                        </Typography>
                        <Chip 
                          label={item.category}
                          size="small"
                          sx={{ 
                            backgroundColor: getCategoryColor(item.category),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {item.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={item.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                            {item.rating} ({item.reviews})
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
                          <Typography variant="h6" sx={{ fontWeight: 700, color: getCategoryColor(item.category), fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {item.price}
                          </Typography>
                          {item.originalPrice && (
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              {item.originalPrice}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          background: `linear-gradient(45deg, ${getCategoryColor(item.category)}, ${getCategoryColor(item.category)}80)`,
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

      {wishlistItems.filter(item => !removedItems.has(item.id)).length === 0 && (
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
          <Button variant="contained" size="large" sx={{ borderRadius: 3 }}>
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