import { useState, useEffect, useRef } from 'react';
import {
  Box, Container, TextField, IconButton, Typography, Chip, Card, CardContent,
  InputAdornment, List, ListItem, ListItemIcon, ListItemText,
  useTheme, useMediaQuery, Grid, CardMedia, Rating, Avatar
} from '@mui/material';
import {
  ArrowBack, Search as SearchIcon, History, TrendingUp, LocationOn,
  Clear, Explore, Star, AccessTime, FavoriteBorder, Share
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';

const Search = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    'Adventure Sports', 'Food Tours', 'Cultural Experiences', 'Nature Walks',
    'Photography Tours', 'Nightlife', 'Art & Craft', 'Music Events'
  ]);
  
  const [recommendedExperiences] = useState([
    { id: 1, title: 'Sunset Photography', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop' },
    { id: 2, title: 'Street Food Tour', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=120&fit=crop' },
    { id: 3, title: 'Mountain Trekking', image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=200&h=120&fit=crop' },
    { id: 4, title: 'Heritage Walk', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&h=120&fit=crop' },
    { id: 5, title: 'Backwater Cruise', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=200&h=120&fit=crop' },
    { id: 6, title: 'Art Workshop', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=120&fit=crop' },
    { id: 7, title: 'Wildlife Safari', image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=200&h=120&fit=crop' },
    { id: 8, title: 'Beach Sports', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=120&fit=crop' },
    { id: 9, title: 'Cooking Class', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=120&fit=crop' },
    { id: 10, title: 'Yoga Retreat', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=120&fit=crop' },
    { id: 11, title: 'City Tour', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&h=120&fit=crop' },
    { id: 12, title: 'Scuba Diving', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=200&h=120&fit=crop' },
    { id: 13, title: 'Rock Climbing', image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=200&h=120&fit=crop' },
    { id: 14, title: 'Wine Tasting', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=120&fit=crop' },
    { id: 15, title: 'Pottery Making', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop' },
    { id: 16, title: 'Bird Watching', image: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=200&h=120&fit=crop' },
    { id: 17, title: 'Cycling Tour', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop' },
    { id: 18, title: 'Meditation', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop' }
  ]);
  
  usePageTitle('Search');

  useEffect(() => {
    // Load saved searches
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Focus after animation completes
    const focusInput = () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        // For mobile devices, also trigger click to ensure keyboard appears
        searchInputRef.current.click();
      }
    };
    
    // Wait for animation to complete before focusing
    const timer = setTimeout(focusInput, 600);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (searchToRemove) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };



  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative'
    }}>

      <Container maxWidth="lg" sx={{ 
        position: 'relative', 
        zIndex: 1,
        px: { xs: 2, md: 3 }
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            pt: { xs: 2, sm: 3 },
            pb: 2,
            gap: 2
          }}>

            
            <Box sx={{ flex: 1 }}>
              <form onSubmit={handleSearchSubmit}>
                <TextField
                  ref={searchInputRef}
                  autoFocus
                  fullWidth
                  variant="outlined"
                  placeholder="Search experiences, locations, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6,
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: `0 8px 32px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                      border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(20px)',
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover': {
                        boxShadow: `0 12px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'}`,
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-3px)'
                      },
                      '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${theme.palette.primary.main}20, 0 12px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'}`,
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-3px)'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      py: { xs: 1.5, sm: 2.5 },
                      px: 2
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={handleBack} size="small">
                          <ArrowBack color="action" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Box>
          </Box>
        </motion.div>



        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card sx={{
              mb: 4,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0,0,0,0.3)' 
                : '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 3,
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 12px 40px rgba(0,0,0,0.4)'
                  : '0 8px 30px rgba(0,0,0,0.12)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Recent Searches
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={search}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    >
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(0,0,0,0.04)',
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${theme.palette.primary.main}15`
                        }
                      }}>
                        <Box 
                          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}
                          onClick={() => handleSearch(search)}
                        >
                          <History sx={{ 
                            fontSize: 18, 
                            color: 'text.secondary',
                            minWidth: '18px'
                          }} />
                          <Typography sx={{ 
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            color: 'text.primary'
                          }}>
                            {search}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main',
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(244, 67, 54, 0.1)' 
                                : 'rgba(244, 67, 54, 0.05)'
                            }
                          }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Small Recommendation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              mb: 3,
              color: 'text.primary'
            }}>
              Recommended for you
            </Typography>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(120px, 1fr))',
                sm: 'repeat(auto-fill, minmax(140px, 1fr))',
                md: 'repeat(auto-fill, minmax(160px, 1fr))'
              },
              gap: 1.5,
              justifyContent: 'space-between'
            }}>
              {recommendedExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 2px 8px rgba(0,0,0,0.3)' 
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    height: { xs: 100, sm: 120 },
                    position: 'relative',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 20px rgba(0,0,0,0.4)'
                        : '0 8px 20px rgba(0,0,0,0.15)',
                      '& .experience-image': {
                        transform: 'scale(1.05)'
                      }
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={experience.image}
                      alt={experience.title}
                      className="experience-image"
                      sx={{
                        transition: 'transform 0.3s ease',
                        objectFit: 'cover',
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 1
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        lineHeight: 1.2,
                        color: 'white',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textAlign: 'center',
                        width: '100%',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                      }}>
                        {experience.title}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
        

      </Container>
    </Box>
  );
};

export default Search;