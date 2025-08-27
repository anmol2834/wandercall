import { Box, Grid, Typography, IconButton, Container, Divider } from '@mui/material';
import { 
  Instagram, 
  Twitter, 
  LinkedIn, 
  YouTube,
  Email,
  Phone,
  LocationOn 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Instagram />, label: 'Instagram', color: '#E4405F' },
    { icon: <Twitter />, label: 'Twitter', color: '#1DA1F2' },
    { icon: <LinkedIn />, label: 'LinkedIn', color: '#0077B5' },
    { icon: <YouTube />, label: 'YouTube', color: '#FF0000' },
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Support', path: '/support' },
    { name: 'Terms of Service', path: '/terms-and-conditions' },
    { name: 'Privacy Policy', path: '/privacy' }
  ];

  return (
    <Box className="footer-container">
      <Container maxWidth="lg">
        <Grid container spacing={4} className="footer-content">
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" className="footer-brand">
              WanderCall
            </Typography>
            <Typography variant="body1" className="footer-description">
              Discover unique experiences and create unforgettable memories with our curated collection of adventures worldwide.
            </Typography>
            <Box className="contact-info">
              <Box className="contact-item">
                <Email className="contact-icon" />
                <Typography variant="body2">hello@experiencehub.com</Typography>
              </Box>
              <Box className="contact-item">
                <Phone className="contact-icon" />
                <Typography variant="body2">+91 98765 43210</Typography>
              </Box>
              <Box className="contact-item">
                <LocationOn className="contact-icon" />
                <Typography variant="body2">Mumbai, India</Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-section-title">
              Quick Links
            </Typography>
            <Box className="footer-links">
              {quickLinks.map((link) => (
                <Typography 
                  key={link.name}
                  variant="body2" 
                  className="footer-link"
                  onClick={() => navigate(link.path)}
                  style={{ cursor: 'pointer' }}
                >
                  {link.name}
                </Typography>
              ))}
            </Box>
          </Grid>
          
          {/* Social & Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-section-title">
              Stay Connected
            </Typography>
            <Typography variant="body2" className="social-description">
              Follow us for the latest experiences and travel inspiration
            </Typography>
            <Box className="social-links">
              {socialLinks.map((social) => (
                <IconButton 
                  key={social.label}
                  className="social-icon"
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: social.color + '20',
                      color: social.color 
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        <Divider className="footer-divider" />
        
        <Box className="footer-bottom">
          <Typography variant="body2" className="copyright">
            © {currentYear} WanderCall. All rights reserved.
          </Typography>
          <Typography variant="body2" className="made-with-love">
            Made with ❤️ for experience seekers worldwide
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;