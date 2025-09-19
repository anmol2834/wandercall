import { Box, Grid, Typography, IconButton, Container, Divider, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Instagram />, label: 'Instagram', color: '#E4405F', url: 'https://www.instagram.com/wandercallofficial/' },
    { icon: <Twitter />, label: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com/wandercall' },
    { icon: <LinkedIn />, label: 'LinkedIn', color: '#0077B5', url: 'https://linkedin.com/company/wandercall' },
    { icon: <YouTube />, label: 'YouTube', color: '#FF0000', url: 'https://youtube.com/@wandercall' },
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
              wandercall
            </Typography>
            <Typography variant="body1" className="footer-description">
              Discover unique experiences and create unforgettable memories with our curated collection of adventures worldwide.
            </Typography>
            <Box className="contact-info">
              <Box className="contact-item">
                <Email className="contact-icon" sx={{ color: 'white' }} />
                <Typography variant="body2">teamwandercall@gmail.com</Typography>
              </Box>
              <Box className="contact-item">
                <Phone className="contact-icon" sx={{ color: 'white' }} />
                <Typography variant="body2">+91 9919668028</Typography>
              </Box>
              <Box className="contact-item">
                <LocationOn className="contact-icon" sx={{ color: 'white' }} />
                <Typography variant="body2">Surat, India</Typography>
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
              Follow us for the latest experiences and adventures
            </Typography>
            <Box className="social-links">
              {socialLinks.map((social) => (
                <IconButton 
                  key={social.label}
                  className="social-icon"
                  onClick={() => window.open(social.url, '_blank')}
                  sx={{ 
                    color: 'white',
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
            © {currentYear} wandercall. All rights reserved.
          </Typography>
          <Typography variant="body2" className="made-with-love">
            Where every call feels like a wonder!!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;