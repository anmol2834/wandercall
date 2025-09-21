import { Box, Grid, Typography, IconButton, SvgIcon } from '@mui/material';
import { Facebook, Instagram, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  // Custom X (Twitter) Icon Component
  const XIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </SvgIcon>
  );
  
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
              <XIcon />
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