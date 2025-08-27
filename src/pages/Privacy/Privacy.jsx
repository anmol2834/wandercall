import { 
  Box, Container, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, 
  Chip, Card, CardContent, Divider, useTheme, Fab, Grid, List, ListItem, 
  ListItemIcon, ListItemText, Paper, Button, Alert
} from '@mui/material';
import { 
  ArrowBack, ExpandMore, Security, Shield, Visibility, Lock, 
  KeyboardArrowUp, Cookie, Storage, Share, Delete, Edit,
  CheckCircle, Info, Warning, ContactSupport, Policy,
  DataUsage, PersonalVideo, Fingerprint, VpnKey
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Privacy.css';

const Privacy = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      const sections = document.querySelectorAll('[data-section]');
      let current = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.getAttribute('data-section');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const privacyData = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <DataUsage />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Name, email address, and phone number when you register" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Payment information for booking transactions" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Profile photos and travel preferences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Location data when using our services" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Automatically Collected Data</Typography>
          <Typography variant="body1">
            We automatically collect device information, IP addresses, browser type, 
            and usage patterns to improve our services and ensure security.
          </Typography>
        </div>
      )
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Data',
      icon: <PersonalVideo />,
      content: (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Service Delivery</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Process bookings and payments" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Provide customer support" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Send booking confirmations" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Platform Improvement</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Analyze usage patterns" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Personalize recommendations" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Enhance security measures" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </div>
      )
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing & Disclosure',
      icon: <Share />,
      content: (
        <div>
          <Alert severity="info" sx={{ mb: 3 }}>
            We never sell your personal information to third parties.
          </Alert>
          
          <Typography variant="h6" gutterBottom>Limited Sharing Scenarios</Typography>
          <List>
            <ListItem>
              <ListItemIcon><Shield color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Service Providers" 
                secondary="Trusted partners who help us operate our platform (payment processors, hosting services)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Policy color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Legal Requirements" 
                secondary="When required by law or to protect our users' safety"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Security color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Business Transfers" 
                secondary="In case of merger or acquisition (with user notification)"
              />
            </ListItem>
          </List>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security Measures',
      icon: <Fingerprint />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            We implement industry-standard security measures to protect your personal information:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <VpnKey sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6">Encryption</Typography>
                <Typography variant="body2">End-to-end encryption for all data transmission</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Lock sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6">Secure Storage</Typography>
                <Typography variant="body2">Protected servers with regular security audits</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Shield sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6">Access Control</Typography>
                <Typography variant="body2">Limited access on need-to-know basis</Typography>
              </Card>
            </Grid>
          </Grid>
        </div>
      )
    },
    {
      id: 'user-rights',
      title: 'Your Privacy Rights',
      icon: <Edit />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            You have complete control over your personal information:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Visibility color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Access Your Data" 
                secondary="Request a copy of all personal information we have about you"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Edit color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Update Information" 
                secondary="Correct or update your personal information at any time"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Delete color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Delete Your Account" 
                secondary="Request complete deletion of your account and associated data"
              />
            </ListItem>
          </List>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: <Cookie />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            We use cookies and similar technologies to enhance your experience:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: theme.palette.success.light + '20' }}>
                <Typography variant="h6" color="success.main">Essential Cookies</Typography>
                <Typography variant="body2">Required for basic site functionality and security</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: theme.palette.info.light + '20' }}>
                <Typography variant="h6" color="info.main">Analytics Cookies</Typography>
                <Typography variant="body2">Help us understand how you use our platform</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: theme.palette.warning.light + '20' }}>
                <Typography variant="h6" color="warning.main">Marketing Cookies</Typography>
                <Typography variant="body2">Used to show relevant advertisements (optional)</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: theme.palette.secondary.light + '20' }}>
                <Typography variant="h6" color="secondary.main">Preference Cookies</Typography>
                <Typography variant="body2">Remember your settings and preferences</Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )
    },
    {
      id: 'data-retention',
      title: 'Data Retention Policy',
      icon: <Storage />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            We retain your personal information only as long as necessary:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><Info color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Active Accounts" 
                secondary="Data retained while your account is active and for 2 years after last activity"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Warning color="warning" /></ListItemIcon>
              <ListItemText 
                primary="Legal Requirements" 
                secondary="Some data may be retained longer to comply with legal obligations"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText 
                primary="Account Deletion" 
                secondary="Most data deleted within 30 days of account deletion request"
              />
            </ListItem>
          </List>
        </div>
      )
    },
    {
      id: 'policy-updates',
      title: 'Policy Updates',
      icon: <Warning />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. When we do:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="We'll notify you via email for significant changes" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Updates will be posted on this page with revision date" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Continued use constitutes acceptance of changes" />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Last Updated:</strong> December 15, 2024
            </Typography>
          </Alert>
        </div>
      )
    }
  ];

  return (
    <Box className="privacy-page-container" sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {/* Back Button */}
      <IconButton 
        className="privacy-back-button"
        onClick={() => navigate('/')}
        sx={{ position: 'fixed', top: 20, left: 20, zIndex: 1000, backgroundColor: theme.palette.background.paper }}
      >
        <ArrowBack />
      </IconButton>

      {/* Hero Section */}
      <Box className="privacy-hero-section" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 0 } }}>
        <div className="privacy-floating-elements">
          <motion.div className="privacy-floating-orb orb-1" animate={{ y: [-30, 30, -30], x: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div className="privacy-floating-orb orb-2" animate={{ y: [20, -20, 20], rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="privacy-floating-orb orb-3" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.div className="privacy-floating-orb orb-4" animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        </div>
        
        <Container maxWidth="lg">
          <motion.div
            className="privacy-hero-content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Chip label="🔒 Your Privacy Matters" className="privacy-hero-chip" sx={{ mb: 3 }} />
            </motion.div>
            <Typography variant="h1" className="privacy-hero-title" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2 }}>
              Privacy <span className="privacy-gradient-text">Policy</span>
            </Typography>
            <p style={{ textAlign: 'center', color: theme.palette.text.secondary, maxWidth: 600, margin: '0 auto' }}>
              Transparent practices for protecting your personal information and digital privacy
            </p>
            
            {/* Hero Illustration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="privacy-hero-illustration"
            >
              <svg viewBox="0 0 600 400" className="privacy-main-illustration" style={{ maxWidth: '100%', height: 'auto' }}>
                <defs>
                  <linearGradient id="privacyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {/* Shield */}
                <motion.path 
                  d="M300 80 L350 120 L350 220 Q350 260 300 280 Q250 260 250 220 L250 120 Z" 
                  fill="url(#privacyGrad)" opacity="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                {/* Lock */}
                <motion.rect 
                  x="280" y="160" width="40" height="60" rx="8" 
                  fill="white" opacity="0.9"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                />
                <motion.circle 
                  cx="300" cy="180" r="8" 
                  fill="url(#privacyGrad)"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                />
                {/* Data particles */}
                <motion.circle cx="200" cy="150" r="4" fill="url(#privacyGrad)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.circle cx="400" cy="180" r="4" fill="url(#privacyGrad)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                <motion.circle cx="180" cy="220" r="4" fill="url(#privacyGrad)" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
              </svg>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Privacy Commitment Section */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="privacy-commitment-card" sx={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            p: 4,
            mb: 4,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <motion.div
              className="commitment-glow"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                </motion.div>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Our Privacy Commitment
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                At WanderCall, we believe privacy is a fundamental right. We're committed to being transparent 
                about how we collect, use, and protect your personal information with industry-leading security measures.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Privacy Content */}
      <Container maxWidth="lg" className="privacy-content-section" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="privacy-content-header"
          sx={{ mb: 6 }}
        >
          <Typography variant="h3" className="privacy-section-title" align="center" gutterBottom>
            Privacy Policy Details
          </Typography>
          <Typography variant="body1" className="privacy-section-subtitle" align="center" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to know about how we handle your personal information
          </Typography>
        </motion.div>

        <div className="privacy-accordion-container">
          {privacyData.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              data-section={section.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{ marginBottom: '16px' }}
            >
              <Accordion 
                expanded={expandedSection === section.id}
                onChange={handleAccordionChange(section.id)}
                className="privacy-accordion"
                sx={{ 
                  backgroundColor: theme.palette.background.paper,
                  '&:before': { display: 'none' },
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  className="privacy-accordion-summary"
                  sx={{ 
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    minHeight: 64
                  }}
                >
                  <motion.div 
                    className="privacy-accordion-icon"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}
                  >
                    {section.icon}
                  </motion.div>
                  <Typography variant="h6" className="privacy-accordion-title">
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="privacy-accordion-details" sx={{ p: 3 }}>
                  {section.content}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Contact Section */}
      <Container maxWidth="lg" className="privacy-contact-section" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="privacy-contact-content"
        >
          <Card className="privacy-contact-card" sx={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            p: 4,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent className="contact-card-content" sx={{ textAlign: 'center' }}>
              <motion.div
                className="contact-illustration"
                whileHover={{ scale: 1.05 }}
                style={{ marginBottom: 24 }}
              >
                <ContactSupport sx={{ fontSize: 80, color: theme.palette.primary.main }} />
              </motion.div>
              <Typography variant="h4" className="contact-title" gutterBottom>
                Questions About Your Privacy?
              </Typography>
              <Typography variant="body1" className="contact-description" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
                Our privacy team is here to help you understand your rights and answer any questions about how we protect your data.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{ minWidth: 160 }}
                  >
                    Contact Privacy Team
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/terms-and-conditions')}
                    sx={{ minWidth: 160 }}
                  >
                    View Terms
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Footer */}
      <Container maxWidth="lg" className="privacy-footer-section" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
        <Divider className="privacy-divider" sx={{ mb: 4 }} />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="privacy-footer-content"
          sx={{ textAlign: 'center' }}
        >
          <Typography variant="body2" className="privacy-footer-text" color="text.secondary">
            © 2024 WanderCall. This Privacy Policy is effective as of December 15, 2024. Your privacy is our priority.
          </Typography>
        </motion.div>
      </Container>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
          >
            <Fab 
              color="primary" 
              onClick={scrollToTop}
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <KeyboardArrowUp />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Privacy;