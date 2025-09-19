import { Box, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 8 }}>
      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            wandercall
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discover unique experiences and create unforgettable memories.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => navigate('/about')}>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => navigate('/terms-and-conditions')}>
              Terms of Service
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>
              Contact
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton className="social-icon">
              <Facebook />
            </IconButton>
            <IconButton className="social-icon">
              <Twitter />
            </IconButton>
            <IconButton className="social-icon">
              <Instagram />
            </IconButton>
            <IconButton className="social-icon">
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;