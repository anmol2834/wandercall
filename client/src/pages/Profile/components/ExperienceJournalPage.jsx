import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  Button, Chip, Avatar, Rating, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Fab, Paper,
  Tab, Tabs, IconButton, Divider
} from '@mui/material';
import {
  MenuBook, Add, LocationOn, CalendarToday, Star,
  Photo, Edit, Delete, FilterList, Search, Close,
  Favorite, Share, Visibility, Camera
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const ExperienceJournalPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const journalEntries = [
    {
      id: 1,
      title: 'Himalayan Trek Adventure',
      location: 'Nepal, Everest Base Camp',
      date: '2024-01-15',
      rating: 0,
      photos: 0,
      content: 'An absolutely breathtaking experience! The journey to Everest Base Camp was challenging but incredibly rewarding. The views of the snow-capped peaks were beyond words.',
      tags: ['Adventure', 'Mountains', 'Trekking'],
      mood: '🏔️',
      weather: 'Sunny',
      companions: 'Solo',
      highlights: ['Reached Base Camp', 'Met amazing people', 'Stunning sunrise views'],
      category: 'Adventure'
    },
    {
      id: 2,
      title: 'Safari Experience',
      location: 'Kenya, Maasai Mara',
      date: '2024-01-08',
      rating: 0,
      photos: 0,
      content: 'Witnessed the Great Migration! Saw thousands of wildebeest crossing the river. The wildlife photography opportunities were endless.',
      tags: ['Wildlife', 'Photography', 'Nature'],
      mood: '🦁',
      weather: 'Partly Cloudy',
      companions: 'Family',
      highlights: ['Great Migration', 'Lion sighting', 'Cultural village visit'],
      category: 'Wildlife'
    },
    {
      id: 3,
      title: 'Northern Lights Tour',
      location: 'Iceland, Reykjavik',
      date: '2024-01-01',
      rating: 0,
      photos: 0,
      content: 'New Year\'s Eve under the Aurora Borealis! The dancing lights in the sky were magical. Perfect way to start the new year.',
      tags: ['Nature', 'Aurora', 'Winter'],
      mood: '🌌',
      weather: 'Clear',
      companions: 'Partner',
      highlights: ['Aurora Borealis', 'New Year celebration', 'Hot springs'],
      category: 'Nature'
    }
  ];

  const stats = {
    totalEntries: journalEntries.length,
    totalPhotos: journalEntries.reduce((sum, entry) => sum + entry.photos, 0),
    countriesVisited: [...new Set(journalEntries.map(entry => entry.location.split(',')[0]))].length,
    averageRating: (journalEntries.reduce((sum, entry) => sum + entry.rating, 0) / journalEntries.length).toFixed(1)
  };

  const handleAddEntry = () => {
    setSelectedEntry(null);
    setDialogOpen(true);
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Adventure': return '#f59e0b';
      case 'Wildlife': return '#10b981';
      case 'Nature': return '#6366f1';
      case 'Culture': return '#ec4899';
      default: return '#8b5cf6';
    }
  };

  const filteredEntries = journalEntries.filter(entry => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return entry.category === 'Adventure';
    if (tabValue === 2) return entry.category === 'Wildlife';
    if (tabValue === 3) return entry.category === 'Nature';
    return true;
  });

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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 140,
              height: 140,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  📖 Experience Journal
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Capture and relive your amazing memories
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`${stats.totalEntries} Entries`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  <Chip label={`${stats.countriesVisited} Countries`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                  <Chip label={`${stats.totalPhotos} Photos`} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ textAlign: 'center' }}
                >
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)" />
                    <text x="50" y="60" textAnchor="middle" fill="white" fontSize="30">📖</text>
                  </svg>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Entries', value: stats.totalEntries, icon: <MenuBook />, color: '#6366f1' },
            { title: 'Photos Captured', value: stats.totalPhotos, icon: <Photo />, color: '#10b981' },
            { title: 'Countries Visited', value: stats.countriesVisited, icon: <LocationOn />, color: '#f59e0b' },
            { title: 'Average Rating', value: stats.averageRating, icon: <Star />, color: '#ec4899' }
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  p: 2
                }}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Avatar sx={{
                      backgroundColor: stat.color,
                      width: 50,
                      height: 50,
                      margin: '0 auto 12px'
                    }}>
                      {stat.icon}
                    </Avatar>
                  </motion.div>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {stat.title}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Filter Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }
          }}
        >
          <Tab label="All Entries" />
          <Tab label="Adventure" />
          <Tab label="Wildlife" />
          <Tab label="Nature" />
        </Tabs>
      </Box>

      {/* Coming Soon Section */}
      <Paper sx={{ 
        p: 8, 
        textAlign: 'center', 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>📖</Typography>
        </motion.div>
        
        <Typography variant="h3" sx={{ 
          fontWeight: 800, 
          mb: 2,
          fontSize: { xs: '2rem', sm: '3rem' },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Coming Soon
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.8, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Experience Journal Feature
        </Typography>
        
        <Typography variant="body1" sx={{ 
          mb: 4, 
          maxWidth: 600, 
          mx: 'auto',
          opacity: 0.7,
          lineHeight: 1.6,
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}>
          We're working on an amazing feature that will let you document and relive your experiences.
        </Typography>
        
        <Chip 
          label="🚀 Feature in Development" 
          sx={{ 
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            color: '#667eea',
            fontWeight: 600,
            fontSize: '0.9rem',
            py: 2,
            px: 1
          }} 
        />
      </Paper>


      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={handleAddEntry}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }}
      >
        <Add />
      </Fab>

      {/* Add/Edit Entry Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
          <IconButton onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Experience Title" placeholder="Enter the title of your experience" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" placeholder="Where did this happen?" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Story"
                placeholder="Tell us about your experience..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Weather" placeholder="How was the weather?" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Companions" placeholder="Who was with you?" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">
            {selectedEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExperienceJournalPage;