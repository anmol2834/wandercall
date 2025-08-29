import React from 'react';
import {
  Box, Container, Typography, Paper, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const CommunityPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 1, sm: 2, md: 4 },
      overflow: 'hidden'
    }}>
      {/* Coming Soon Section */}
      <Paper sx={{ 
        p: { xs: 3, sm: 6, md: 8 }, 
        textAlign: 'center', 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 800,
        height: 'fit-content'
      }}>
        <motion.div
          animate={{ 
            background: [
              'radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(255, 119, 198, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.4) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none'
          }}
        />
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Typography sx={{ fontSize: '5rem', mb: 2 }}>👥</Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Typography variant="h1" sx={{ 
            fontWeight: 800, 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            Coming Soon
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: { xs: 3, sm: 4 }, 
            opacity: 0.9,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}>
            Community Hub
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: { xs: 4, sm: 5 }, 
            maxWidth: { xs: '100%', sm: 600 }, 
            mx: 'auto',
            opacity: 0.85,
            lineHeight: 1.7,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            fontWeight: 400
          }}>
            Connect with fellow experiencers, share your adventures, discover hidden gems, and build meaningful connections. 
            Our community platform will unite passionate experiencers from around the globe.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap', mb: { xs: 3, sm: 4 } }}>
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
            >
              <Chip 
                label="🌍 Global Network" 
                sx={{ 
                  backgroundColor: 'rgba(102, 126, 234, 0.15)',
                  color: '#667eea',
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1, sm: 1.5 },
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }} 
              />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
            >
              <Chip 
                label="💬 Experience Stories" 
                sx={{ 
                  backgroundColor: 'rgba(240, 147, 251, 0.15)',
                  color: '#f093fb',
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1, sm: 1.5 },
                  border: '1px solid rgba(240, 147, 251, 0.2)'
                }} 
              />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.6 }}
            >
              <Chip 
                label="🤝 Meet Experiencers" 
                sx={{ 
                  backgroundColor: 'rgba(118, 75, 162, 0.15)',
                  color: '#764ba2',
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1, sm: 1.5 },
                  border: '1px solid rgba(118, 75, 162, 0.2)'
                }} 
              />
            </motion.div>
          </Box>
          
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Chip 
              label="🚀 Building Amazing Connections" 
              sx={{ 
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: '1px solid rgba(102, 126, 234, 0.3)'
              }} 
            />
          </motion.div>
        </motion.div>
      </Paper>
    </Box>
  );
};

export default CommunityPage;