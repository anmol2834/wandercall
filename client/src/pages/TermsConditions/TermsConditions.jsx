import { 
  Box, Container, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, 
  Chip, Card, CardContent, Divider, useTheme, Fab, Grid, List, ListItem, 
  ListItemIcon, ListItemText, Paper, Button, Link
} from '@mui/material';
import { 
  ArrowBack, ExpandMore, Security, Gavel, Shield, AccountBalance, Info, CheckCircle,
  KeyboardArrowUp, Store, Person, Business, Policy, ContactSupport, 
  FlightTakeoff, CameraAlt, School, SportsEsports, Handshake, Warning,
  HealthAndSafety, MoneyOff
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import './TermsConditions.css';

const TermsConditions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  usePageTitle('Terms & Conditions');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      // Update active section based on scroll position
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const navigationItems = [
    { id: 'introduction', label: 'Introduction', icon: <Info /> },
    { id: 'definitions', label: 'Definitions', icon: <Policy /> },
    { id: 'user-responsibilities', label: 'User Responsibilities', icon: <Person /> },
    { id: 'buyer-guidelines', label: 'Buyer Guidelines', icon: <Store /> },
    { id: 'seller-guidelines', label: 'Seller Guidelines', icon: <Business /> },
    { id: 'marketplace-policies', label: 'Marketplace Policies', icon: <Shield /> },
    { id: 'liability-waivers', label: 'Liability & Waivers', icon: <HealthAndSafety /> },
    { id: 'cancellations-refunds', label: 'Cancellations & Refunds', icon: <MoneyOff /> },
    { id: 'dispute-resolution', label: 'Dispute Resolution', icon: <Gavel /> },
    { id: 'changes', label: 'Changes to Terms', icon: <Warning /> },
    { id: 'contact', label: 'Contact Information', icon: <ContactSupport /> }
  ];

  const products = [
    { name: 'Drone Adventure', icon: <FlightTakeoff />, description: 'Aerial photography and videography experiences' },
    { name: 'Storytelling Session', icon: <CameraAlt />, description: 'Professional storytelling and content creation' },
    { name: 'Learn from Experts', icon: <School />, description: 'Educational workshops and masterclasses' },
    { name: 'Gamer Bash', icon: <SportsEsports />, description: 'Gaming tournaments and community events' }
  ];

  const termsData = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Info />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            Welcome to wandercall, a comprehensive marketplace platform that connects experiencers with unique experiences and service providers. 
            By accessing or using our services at <Link href="https://wandercall.com" target="_blank" rel="noopener">https://wandercall.com</Link>, 
            you agree to be bound by these Terms and Conditions.
          </Typography>
          <Typography variant="body1" paragraph>
            These terms constitute a legally binding agreement between you and wandercall. If you do not agree to these terms, 
            please do not use our platform or services.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 2 }}>
            Last Updated: December 15, 2024 | Effective Date: December 15, 2024
          </Typography>
        </div>
      )
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: <Policy />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            For the purposes of these Terms and Conditions:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Platform" 
                secondary="Refers to the wandercall website, mobile applications, and all related services"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="User" 
                secondary="Any individual or entity that accesses or uses our platform"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Buyer" 
                secondary="A user who book experiences or services through our platform"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Seller/Provider" 
                secondary="A user who offers experiences or services through our platform"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Experience" 
                secondary="Any service, activity, or product offered by sellers on our platform"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Content" 
                secondary="All text, images, videos, reviews, and other materials on our platform"
              />
            </ListItem>
          </List>
        </div>
      )
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: <Person />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>General Obligations</Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Provide accurate and complete information during registration" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Maintain the confidentiality of your account credentials" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Comply with all applicable laws and regulations" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Respect the rights and privacy of other users" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Use the platform only for lawful purposes" />
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Prohibited Activities</Typography>
          <Typography variant="body1">
            Users are strictly prohibited from engaging in fraudulent activities, harassment, spam, 
            intellectual property infringement, or any activities that may harm the platform or other users.
          </Typography>
        </div>
      )
    },
    {
      id: 'buyer-guidelines',
      title: 'Buyer Guidelines',
      icon: <Store />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Booking Process</Typography>
          <Typography variant="body1" paragraph>
            Buyers can browse, compare, and book experiences through our platform. All bookings are subject to 
            availability and seller confirmation. Payment is processed securely through our integrated payment system.
          </Typography>
          
          <Typography variant="h6" gutterBottom>Payment & Refunds</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Payments are processed at the time of booking confirmation" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Refund policies vary by experience and are clearly stated before booking" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cancellation terms are specified in each experience listing" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Disputes can be raised through our resolution center" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Communication</Typography>
          <Typography variant="body1">
            All communication with sellers should be conducted through our platform's messaging system. 
            Direct contact information should not be shared until after booking confirmation.
          </Typography>
        </div>
      )
    },
    {
      id: 'seller-guidelines',
      title: 'Seller Guidelines',
      icon: <Business />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Listing Requirements</Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Provide accurate and detailed descriptions of your experiences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Upload high-quality photos and videos" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Set fair and competitive pricing" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Maintain up-to-date availability calendars" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Service Standards</Typography>
          <Typography variant="body1" paragraph>
            Sellers must deliver experiences as described, maintain professional communication, 
            and provide excellent customer service. Failure to meet these standards may result in 
            account suspension or termination.
          </Typography>

          <Typography variant="h6" gutterBottom>Commission Structure</Typography>
          <Typography variant="body1">
            wandercall charges a service fee on each completed booking. Fee structures are transparent 
            and communicated during the seller onboarding process.
          </Typography>
        </div>
      )
    },
    {
      id: 'marketplace-policies',
      title: 'Marketplace Policies',
      icon: <Shield />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Quality Assurance</Typography>
          <Typography variant="body1" paragraph>
            We maintain strict quality standards for all experiences listed on our platform. 
            Regular reviews and monitoring ensure that our marketplace maintains high standards.
          </Typography>

          <Typography variant="h6" gutterBottom>Content Guidelines</Typography>
          <List>
            <ListItem>
              <ListItemText primary="All content must be original or properly licensed" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Inappropriate, offensive, or misleading content is prohibited" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Reviews and ratings must be honest and based on actual experiences" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Safety & Security</Typography>
          <Typography variant="body1">
            We implement comprehensive security measures to protect user data and ensure safe transactions. 
            All sellers undergo verification processes, and we provide 24/7 customer support.
          </Typography>
        </div>
      )
    },
    {
      id: 'liability-waivers',
      title: 'Liability & Waivers',
      icon: <HealthAndSafety />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Risk Acknowledgment</Typography>
          <Typography variant="body1" paragraph>
            Participation in wandercall Experiences involves inherent risks. By booking an Experience, you acknowledge 
            and voluntarily assume all risks associated with participation, including risk of injury, disability, death, 
            or property damage.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Limitation of Liability</Typography>
          <Typography variant="body1" paragraph>
            To the maximum extent permitted by law, wandercall, its affiliates, employees, and partners shall not be 
            liable for any direct, indirect, incidental, special, or consequential damages resulting from your 
            participation in any Experience.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Indemnification</Typography>
          <Typography variant="body1" paragraph>
            You agree to indemnify and hold harmless wandercall from any claims, damages, liabilities, costs, and 
            expenses (including legal fees) arising from your participation in any Experience or violation of these Terms.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Additional Waivers</Typography>
          <Typography variant="body1" paragraph>
            For certain Experiences, you may be required to sign additional liability waivers before participation. 
            These waivers will be provided electronically before the Experience or in person at the venue.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Prohibited Behaviors</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Harassment of staff or other participants" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Damage to equipment or venues" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use of illegal substances" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Excessive intoxication" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Violation of safety instructions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Unauthorized photography/videography" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Safety Compliance</Typography>
          <Typography variant="body1">
            For risky experiences specifically, participants must follow all safety instructions provided by our 
            certified operators. Any reckless operation or violation of safety protocols will result in immediate 
            termination of the session without refund.
          </Typography>
        </div>
      )
    },
    {
      id: 'cancellations-refunds',
      title: 'Cancellations & Refunds',
      icon: <MoneyOff />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Cancellation Policy</Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Service bookings can only be canceled within 48 hours of booking" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Once event preparation has begun or less than 72 hours remain before the event, no cancellation will be entertained" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Return Policy</Typography>
          <Typography variant="body1" paragraph>
            Since our services include unique in-person experiences, we do not offer physical products that can be returned.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Refund Policy</Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Once cancellation is successful, wandercall will instantly initiate the refund to your source account or chosen method of refund" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText primary="Refunds will be processed within 7–10 business days from the cancellation date" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Company-Initiated Cancellations</Typography>
          <Typography variant="body1" paragraph>
            wandercall reserves the right to cancel any Experience due to weather conditions, safety concerns, 
            insufficient bookings, or other unforeseen circumstances. In such cases, we will provide a full refund 
            or offer to reschedule your booking.
          </Typography>
          
          <Paper sx={{ p: 3, mt: 3, backgroundColor: theme.palette.action.hover }}>
            <Typography variant="h6" gutterBottom>Important Notice</Typography>
            <Typography variant="body2">
              All refund policies are subject to the specific terms and conditions of individual experience providers. 
              Please review the cancellation policy for each experience before booking.
            </Typography>
          </Paper>
        </div>
      )
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution',
      icon: <Gavel />,
      content: (
        <div>
          <Typography variant="h6" gutterBottom>Resolution Process</Typography>
          <Typography variant="body1" paragraph>
            In case of disputes between buyers and sellers, wandercall provides a structured resolution process:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Step 1: Direct Communication" 
                secondary="Parties are encouraged to resolve issues through direct communication"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Step 2: Mediation" 
                secondary="wandercall mediates to find a mutually acceptable solution"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Step 3: Final Decision" 
                secondary="If mediation fails, wandercall makes a final binding decision"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Refund Policy</Typography>
          <Typography variant="body1">
            Refunds are processed according to the specific terms of each experience and the circumstances 
            of the dispute. Our customer support team reviews each case individually.
          </Typography>
        </div>
      )
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: <Warning />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            wandercall reserves the right to modify these Terms and Conditions at any time. 
            We will notify users of significant changes through:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><Info color="primary" /></ListItemIcon>
              <ListItemText primary="Email notifications to registered users" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="primary" /></ListItemIcon>
              <ListItemText primary="Platform notifications and announcements" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="primary" /></ListItemIcon>
              <ListItemText primary="Updates to this Terms and Conditions page" />
            </ListItem>
          </List>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Continued use of the platform after changes constitutes acceptance of the new terms. 
            Users who do not agree to the changes should discontinue use of the platform.
          </Typography>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <ContactSupport />,
      content: (
        <div>
          <Typography variant="body1" paragraph>
            For questions, concerns, or support regarding these Terms and Conditions, please contact us:
          </Typography>
          
          <Paper sx={{ p: 3, mt: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" gutterBottom>wandercall Support</Typography>
            <Typography variant="body1">Email: teamwandercall@gmail.com</Typography>
            <Typography variant="body1">Phone: +91 9919668028</Typography>
            <Typography variant="body1">Website: <Link href="https://wandercall.com" target="_blank" rel="noopener">https://wandercall.com</Link></Typography>
            <Typography variant="body1">Business Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</Typography>
          </Paper>

          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            We strive to respond to all inquiries within 24-48 hours during business days.
          </Typography>
        </div>
      )
    }
  ];

  return (
    <Box className="terms-page-container" sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {/* Back Button */}
      <IconButton 
        className="terms-back-button"
        onClick={() => navigate('/')}
        sx={{ position: 'fixed', top: 20, left: 20, zIndex: 1000, backgroundColor: theme.palette.background.paper }}
      >
        <ArrowBack />
      </IconButton>

      {/* Sticky Navigation */}
      <Paper 
        className="terms-sticky-nav"
        sx={{ 
          position: 'fixed', 
          top: 80, 
          right: 20, 
          width: 280, 
          maxHeight: '70vh', 
          overflow: 'auto',
          zIndex: 999,
          display: { xs: 'none', lg: 'block' },
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Quick Navigation
        </Typography>
        <List dense>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.id}
              button
              onClick={() => scrollToSection(item.id)}
              sx={{ 
                backgroundColor: activeSection === item.id ? theme.palette.action.selected : 'transparent',
                '&:hover': { backgroundColor: theme.palette.action.hover }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Hero Section */}
      <Box className="terms-hero-section" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 0 } }}>
        <div className="terms-floating-elements">
          <motion.div className="terms-floating-shape shape-1" animate={{ y: [-20, 20, -20] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.div className="terms-floating-shape shape-2" animate={{ y: [20, -20, 20] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.div className="terms-floating-shape shape-3" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </div>
        
        <Container maxWidth="lg">
          <motion.div
            className="terms-hero-content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Chip label="📋 Marketplace Declaration" className="terms-hero-chip" sx={{ mb: 3 }} />
            <Typography variant="h1" className="terms-hero-title" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2 }}>
              Terms & <span className="terms-gradient-text">Conditions</span>
            </Typography>
            <p style={{textAlign: "center"}}>
              Your comprehensive guide to using wandercall marketplace safely and effectively
            </p>
            
            {/* Hero Illustration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="terms-hero-illustration"
            >
              <svg viewBox="0 0 600 400" className="terms-main-illustration" style={{ maxWidth: '100%', height: 'auto' }}>
                <defs>
                  <linearGradient id="termsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {/* Marketplace illustration */}
                <motion.rect 
                  x="150" y="80" width="300" height="240" rx="20" 
                  fill="white" stroke="url(#termsGrad)" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                {/* Buyers and Sellers */}
                <motion.circle cx="100" cy="180" r="30" fill="url(#termsGrad)" opacity="0.8" />
                <motion.circle cx="500" cy="180" r="30" fill="url(#termsGrad)" opacity="0.8" />
                {/* Handshake in center */}
                <motion.path 
                  d="M250 200 Q300 180 350 200" 
                  stroke="url(#termsGrad)" strokeWidth="4" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 2 }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Products Section */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
            Our Marketplace Products
          </Typography>
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.name}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                    <CardContent>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {product.icon}
                      </motion.div>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Terms Content */}
      <Container maxWidth="lg" className="terms-content-section" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terms-content-header"
          sx={{ mb: 6 }}
        >
          <Typography variant="h3" className="terms-section-title" align="center" gutterBottom>
            Marketplace Declaration
          </Typography>
          <Typography variant="body1" className="terms-section-subtitle" align="center" sx={{ maxWidth: 600, mx: 'auto' }}>
            Please read these terms carefully to understand your rights and responsibilities when using our marketplace
          </Typography>
        </motion.div>

        <div className="terms-accordion-container">
          {termsData.map((term, index) => (
            <motion.div
              key={term.id}
              id={term.id}
              data-section={term.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{ marginBottom: '16px' }}
            >
              <Accordion 
                expanded={expandedSection === term.id}
                onChange={handleAccordionChange(term.id)}
                className="terms-accordion"
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
                  className="terms-accordion-summary"
                  sx={{ 
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    minHeight: 64
                  }}
                >
                  <motion.div 
                    className="terms-accordion-icon"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}
                  >
                    {term.icon}
                  </motion.div>
                  <Typography variant="h6" className="terms-accordion-title">
                    {term.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="terms-accordion-details" sx={{ p: 3 }}>
                  {term.content}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Contact CTA Section */}
      <Container maxWidth="lg" className="terms-contact-section" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terms-contact-content"
          
        >
          <Card className="terms-contact-card" sx={{ backgroundColor: theme.palette.background.paper, p: 4 }}>
            <CardContent className="contact-card-content" sx={{ textAlign: 'center' }}>
              <motion.div
                className="contact-illustration"
                whileHover={{ scale: 1.05 }}
                style={{ marginBottom: 24 }}
              >
                <Handshake sx={{ fontSize: 80, color: theme.palette.primary.main }} />
              </motion.div>
              <Typography variant="h4" className="contact-title" gutterBottom>
                Need Help or Have Questions?
              </Typography>
              <Typography variant="body1" className="contact-description" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
                Our legal and support teams are here to help you understand these terms and resolve any concerns you may have.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{ minWidth: 160 }}
                  >
                    Contact Support
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/signin')}
                    sx={{ minWidth: 160 }}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Additional Terms Section */}
      <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, md: 3 } }}>
        <Accordion sx={{ backgroundColor: theme.palette.background.paper, boxShadow: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666' }}>
              Additional Terms
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
              wandercall reserves the exclusive right to modify, update, or amend these Terms and Conditions at any time, with or without prior notice. Such changes may take effect immediately upon publication on the platform or from a date specified by wandercall. Your continued use of the platform after the effective date will constitute acceptance of the revised Terms and Conditions.
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, mt: 2 }}>
              By signing up as an Experience Provider, you confirm that:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              <Typography component="li" variant="body2" sx={{ fontSize: '0.85rem', color: '#666', mb: 0.5 }}>
                You have read and understood these Terms and Conditions.
              </Typography>
              <Typography component="li" variant="body2" sx={{ fontSize: '0.85rem', color: '#666', mb: 0.5 }}>
                You are legally eligible to host experiences.
              </Typography>
              <Typography component="li" variant="body2" sx={{ fontSize: '0.85rem', color: '#666', mb: 0.5 }}>
                You accept full responsibility for the experiences you provide and your conduct.
              </Typography>
              <Typography component="li" variant="body2" sx={{ fontSize: '0.85rem', color: '#666', mb: 0.5 }}>
                You acknowledge wandercall's role as a facilitator and agree to abide by these policies.
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, mt: 2 }}>
              Together, we create safe, authentic, and memorable experiences on wandercall.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Footer */}
      <Container maxWidth="lg" className="terms-footer-section" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
        <Divider className="terms-divider" sx={{ mb: 4 }} />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="terms-footer-content"
          sx={{ textAlign: 'center' }}
        >
          <Typography variant="body2" className="terms-footer-text" color="text.secondary">
            © 2024 wandercall. By continuing to use our platform, you acknowledge that you have read and agree to these Terms & Conditions.
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

export default TermsConditions;