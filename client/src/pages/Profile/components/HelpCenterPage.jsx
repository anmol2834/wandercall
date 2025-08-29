import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  Accordion, AccordionSummary, AccordionDetails, TextField,
  Button, Chip, InputAdornment, Paper, Avatar
} from '@mui/material';
import {
  ExpandMore, Search, HelpOutline, Chat, Phone, Email,
  QuestionAnswer, Support, ContactSupport, LiveHelp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const HelpCenterPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(false);

  const faqData = [
    {
      id: 1,
      question: 'How do I book an experience?',
      answer: 'Browse our experiences, select your preferred date and time, add to cart, and complete the secure checkout process. You\'ll receive instant confirmation via email.',
      category: 'Booking'
    },
    {
      id: 2,
      question: 'What is your cancellation policy?',
      answer: 'Free cancellation up to 24 hours before your experience. Some experiences may have different policies - check the specific terms during booking.',
      category: 'Cancellation'
    },
    {
      id: 3,
      question: 'How do I earn and use reward points?',
      answer: 'Earn XP by booking experiences, writing reviews, and referring friends. Use your XP to unlock exclusive rewards and discounts.',
      category: 'Rewards'
    },
    {
      id: 4,
      question: 'Can I modify my booking?',
      answer: 'Yes, you can modify your booking up to 48 hours before the experience date. Go to My Bookings and select the modify option.',
      category: 'Booking'
    },
    {
      id: 5,
      question: 'How do I contact customer support?',
      answer: 'You can reach us via live chat, email at support@wandercall.com, or phone at +1-800-WANDER. Our team is available 24/7.',
      category: 'Support'
    }
  ];

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <Chat />,
      color: '#10b981',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Email />,
      color: '#6366f1',
      action: 'Send Email'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      icon: <Phone />,
      color: '#f59e0b',
      action: 'Call Now'
    }
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
          <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  🆘 Help Center
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Find answers to your questions and get the support you need
                </Typography>
                <Chip label="24/7 Support Available" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ textAlign: 'center' }}
                >
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)" />
                    <text x="50" y="60" textAnchor="middle" fill="white" fontSize="30">🆘</text>
                  </svg>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 4
        }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main'
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Support Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Get Support
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {supportOptions.map((option, index) => (
            <Grid item xs={12} md={4} key={option.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Avatar sx={{
                        backgroundColor: option.color,
                        width: 60,
                        height: 60,
                        margin: '0 auto 16px',
                        fontSize: '1.5rem'
                      }}>
                        {option.icon}
                      </Avatar>
                    </motion.div>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {option.description}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: option.color,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: option.color,
                          filter: 'brightness(1.1)'
                        }
                      }}
                    >
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Frequently Asked Questions
        </Typography>
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 0 }}>
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Accordion
                  expanded={expandedFAQ === faq.id}
                  onChange={() => setExpandedFAQ(expandedFAQ === faq.id ? false : faq.id)}
                  sx={{
                    backgroundColor: 'transparent',
                    '&:before': { display: 'none' },
                    '& .MuiAccordionSummary-root': {
                      borderBottom: index < filteredFAQs.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                    }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <HelpOutline color="primary" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {faq.question}
                        </Typography>
                        <Chip 
                          label={faq.category} 
                          size="small" 
                          sx={{ 
                            mt: 0.5,
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            color: 'primary.main',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ pl: 5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Paper sx={{
          p: 4,
          mt: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3
        }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ContactSupport sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          </motion.div>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Still need help?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Our support team is here to help you 24/7
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<LiveHelp />}
            sx={{
              borderRadius: 3,
              px: 4,
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)'
            }}
          >
            Contact Support
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default HelpCenterPage;