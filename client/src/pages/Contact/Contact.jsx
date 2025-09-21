import { 
  Box, Container, Typography, IconButton, Card, CardContent, Grid, 
  TextField, Button, Chip, useTheme, Fab, List, ListItem, ListItemIcon, 
  ListItemText, Avatar, Paper, Divider
} from '@mui/material';
import { 
  ArrowBack, KeyboardArrowUp, Email, Phone, LocationOn, Schedule,
  Send, Support, Security, Business, QuestionAnswer, BugReport,
  Feedback, Chat, WhatsApp, LinkedIn, Instagram
} from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  usePageTitle('Contact Us');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const contactMethods = [
    {
      icon: <Email />,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'teamwandercall@gmail.com',
      action: 'mailto:teamwandercall@gmail.com?subject=Support Request&body=Hello wandercall Team,',
      color: '#6366f1'
    },
    { 
      icon: <Phone />,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+91 9919668028',
      action: 'tel:+919919668028',
      color: '#10b981'
    },
    {
      icon: <Chat />,
      title: 'Live Chat',
      description: 'Instant support via live chat',
      contact: 'Available 24/7',
      action: '#',
      color: '#f59e0b'
    },
    {
      icon: <WhatsApp />,
      title: 'WhatsApp',
      description: 'Quick support on WhatsApp',
      contact: '+91 9919668028',
      action: 'https://wa.me/+919919668028',
      color: '#25d366'
    }
  ];

  const supportCategories = [
    { icon: <Support />, title: 'General Support', description: 'Account help, booking issues' },
    { icon: <Security />, title: 'Privacy & Security', description: 'Data protection, account security' },
    { icon: <Business />, title: 'Business Inquiries', description: 'Partnerships, collaborations' },
    { icon: <BugReport />, title: 'Technical Issues', description: 'App bugs, technical problems' },
    { icon: <Feedback />, title: 'Feedback', description: 'Suggestions, feature requests' },
    { icon: <QuestionAnswer />, title: 'FAQ', description: 'Common questions and answers' }
  ];

  const teamMembers = [
    {
      name: 'Rishi Sinha',
      role: 'Customer Success Manager',
      avatar: 'RS',
      color: '#6366f1'
    },
    {
      name: 'Anmol Sinha',
      role: 'Technical Support Lead',
      avatar: 'AS',
      color: '#10b981'
    },
    {
      name: 'Suryansh Pandey',
      role: 'Privacy Officer',
      avatar: 'SP',
      color: '#f59e0b'
    }
  ];

  // Custom X (Twitter) Icon Component
  const XIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </SvgIcon>
  );

  const socialLinks = [
    { icon: <XIcon />, name: 'X', url: 'https://x.com/teamwandercall', color: '#000000' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://linkedin.com/company/wandercall', color: '#0077b5' },
    { icon: <Instagram />, name: 'Instagram', url: 'https://www.instagram.com/wandercallofficial/', color: '#e4405f' }
  ];

  return (
    <Box className="contact-page-container" sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>


      {/* Hero Section */}
      <Box className="contact-hero-section" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 0 } }}>
        <div className="contact-floating-elements">
          <motion.div className="contact-floating-orb orb-1" animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="contact-floating-orb orb-2" animate={{ x: [-15, 15, -15], scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div className="contact-floating-orb orb-3" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </div>
        
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Chip label="💬 Get In Touch" className="contact-hero-chip" sx={{ mb: 3 }} />
            </motion.div>
            <Typography variant="h1" className="contact-hero-title" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2 }}>
              Contact <span className="contact-gradient-text">Us</span>
            </Typography>
            <p style={{ textAlign: 'center', color: "white", maxWidth: 600, margin: '0 auto' }}>
              We're here to help you with any questions, concerns, or feedback
            </p>
            
            {/* Hero Illustration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <svg viewBox="0 0 600 400" style={{ maxWidth: '500px', height: 'auto' }}>
                <defs>
                  <linearGradient id="contactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <motion.circle 
                  cx="300" cy="200" r="100" 
                  fill="white" opacity="0.1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.rect 
                  x="250" y="150" width="100" height="80" rx="15" 
                  fill="url(#contactGrad)"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.circle 
                  cx="280" cy="170" r="8" 
                  fill="white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                  cx="320" cy="170" r="8" 
                  fill="white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.path 
                  d="M270 200 Q300 220 330 200" 
                  stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Methods */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            How Can We Help?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Choose your preferred way to get in touch with our support team
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {contactMethods.map((method, index) => (
            <Grid item xs={12} sm={6} md={3} key={method.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="contact-method-card" sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer'
                }} onClick={() => method.title === 'Email Support' ? window.location.href = method.action : window.open(method.action, '_blank')}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        background: method.color,
                        color: 'white',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: `0 8px 25px ${method.color}40`
                      }}
                    >
                      {method.icon}
                    </motion.div>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                      {method.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {method.description}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: method.color }}>
                      {method.contact}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}>
                Send Us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have a specific question or need detailed assistance? Fill out the form and we'll get back to you within 24 hours.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Our Support Team</Typography>
                <List>
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: member.color, width: 40, height: 40 }}>
                            {member.avatar}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={member.name}
                          secondary={member.role}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 4 }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          value={formData.name}
                          onChange={handleInputChange('name')}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          value={formData.subject}
                          onChange={handleInputChange('subject')}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange('message')}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<Send />}
                            sx={{ py: 1.5 }}
                          >
                            Send Message
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Support Categories */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            What Do You Need Help With?
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {supportCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Paper sx={{ 
                  p: 3,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.div>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 700 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Office Info & Social */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Visit Our Office
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mora Tekra, Hazira Road"
                    secondary="surat, GJ - 394517, india"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Business Hours"
                    secondary="Monday - Friday: 9:00 AM - 6:00 PM PST"
                  />
                </ListItem>
              </List>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Follow Us
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Stay connected with us on social media for updates, tips, and community discussions.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: social.color,
                        color: 'white',
                        '&:hover': {
                          bgcolor: social.color,
                          opacity: 0.8
                        }
                      }}
                      onClick={() => window.open(social.url, '_blank')}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
        <Divider sx={{ mb: 4, background: 'rgba(99, 102, 241, 0.2)' }} />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 wandercall. We're here to help you every step of the way.
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

export default Contact;