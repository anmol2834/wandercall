import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  useTheme,
  Fab,
  Tooltip,
  Chip,
  Avatar
} from '@mui/material';
import { ArrowBack, Gavel, Handshake, Security, Payment, Star, Shield, KeyboardArrowUp, MenuBook } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProviderTerms = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    {
      id: 'partnership',
      title: 'Partnership in Spirit',
      icon: <Handshake />,
      content: [
        'You are an independent host, not an employee or legal partner of Wandercall.',
        'While you control and deliver your experience, Wandercall supports you with tools, promotion, secure payments, and guidance to help you succeed.'
      ]
    },
    {
      id: 'hosting',
      title: 'Structure for Hosting Experiences',
      icon: <Star />,
      content: [
        'Design with Care – Provide a clear structure for your experience (introduction, main activity, closing/feedback).',
        'Be Transparent – Clearly communicate the duration, costs, requirements, and any safety considerations.',
        'Maintain Safety Standards – Take reasonable steps to ensure participant well-being throughout the experience.',
        'Engage with Respect – Treat all participants fairly, without bias or discrimination.',
        'Continuous Improvement – Be open to feedback and willing to refine your experience with Wandercall\'s support.'
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance & Responsibility',
      icon: <Gavel />,
      content: [
        'You agree to follow all local laws, regulations, and ethical standards.',
        'You confirm that the experience you provide is safe, lawful, and suitable for participants.',
        'You understand that you carry primary responsibility for the execution of your experience.'
      ]
    },
    {
      id: 'timing',
      title: 'Timing Commitment & Availability',
      icon: <Security />,
      content: [
        'Accurate Scheduling: You agree to list only those dates and times for which you are genuinely available to host.',
        'Punctuality: You must begin the experience at the scheduled time and respect the agreed-upon duration, except in cases of genuine emergency.',
        'Advance Notice: If you are unable to host at a confirmed time, you must notify Wandercall and participants as early as possible, and no later than the platform\'s minimum notice period.',
        'Responsiveness: You agree to respond promptly to booking requests, participant queries, or Wandercall communications to ensure a smooth participant experience.'
      ]
    },
    {
      id: 'support',
      title: 'Wandercall\'s Role & Support',
      icon: <Shield />,
      content: [
        'Providing Visibility – Showcasing your experiences to a wide audience.',
        'Ensuring Secure Payments – Handling transactions fairly and transparently.',
        'Offering Guidance – Advising on best practices, safety, and customer experience.',
        'Conflict Support – Assisting in resolving disputes between you and participants, where reasonable.'
      ]
    },
    {
      id: 'liability',
      title: 'Liability & Protection',
      icon: <Security />,
      content: [
        'You acknowledge that Wandercall is a facilitator, not a direct organizer of your activities.',
        'Wandercall will not be liable for accidents, losses, or disputes arising from your experience.',
        'You agree to indemnify and hold Wandercall harmless from any third-party claims related to your actions, omissions, or experience delivery.'
      ]
    },
    {
      id: 'payments',
      title: 'Payments, Cancellations & Policies',
      icon: <Payment />,
      content: [
        'Payments will be processed through Wandercall\'s secure system.',
        'You agree to follow Wandercall\'s cancellation and refund policies to ensure fairness for participants.',
        'Service fees will be clearly outlined before you publish your experience.'
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing & Offering Parity Policy',
      icon: <Payment />,
      content: [
        'As an Experience Provider, you may host clients/customers outside of Wandercall.',
        'However, the price you charge outside Wandercall must always be equal to or higher than the price listed on Wandercall for the same experience.',
        'You agree that all services, features, or value offered as part of an experience outside Wandercall must also be included in the experience listed on Wandercall.',
        'You may not provide "premium" or "enhanced" versions of an experience outside Wandercall that are not made available on Wandercall under the same or better terms.',
        'Wandercall reserves the right to review and audit your offerings. If you are found to be undercutting prices, offering additional perks outside the platform, or otherwise breaching this policy, your account may be permanently banned.'
      ]
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: isDark 
        ? '#0a0a0a'
        : '#ffffff',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark
          ? 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      },
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 3, md: 4 },
            position: 'relative',
            zIndex: 1
          }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton 
                onClick={() => navigate('/become-provider')}
                sx={{ 
                  mr: { xs: 1, md: 2 },
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
                  backdropFilter: 'blur(10px)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(99, 102, 241, 0.2)',
                  '&:hover': {
                    background: isDark 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                  }
                }}
              >
                <ArrowBack sx={{ color: isDark ? 'white' : '#1e293b' }} />
              </IconButton>
            </motion.div>
            
            <Box sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                    color: isDark ? 'white' : 'black',
                    background: isDark
                      ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: { xs: 'left', md: 'left' },
                    lineHeight: { xs: 1.2, md: 1.1 }
                  }}
                >
                  Provider Terms & Conditions
                </Typography>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Box sx={{
                    height: 3,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                    borderRadius: 2,
                    mt: 1,
                    maxWidth: { xs: 200, md: 300 }
                  }} />
                </motion.div>
              </motion.div>
            </Box>
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Avatar sx={{
                width: { xs: 40, md: 56 },
                height: { xs: 40, md: 56 },
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                ml: 2
              }}>
                <MenuBook sx={{ fontSize: { xs: 20, md: 28 } }} />
              </Avatar>
            </motion.div>
          </Box>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Paper sx={{
            p: { xs: 3, md: 4 },
            mb: { xs: 3, md: 4 },
            background: isDark 
              ? 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(99, 102, 241, 0.2)'
              : '1px solid rgba(99, 102, 241, 0.1)',
            borderRadius: 4,
            boxShadow: isDark
              ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
            }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                color: isDark ? 'white' : 'black',
                textAlign: 'center',
                position: 'relative'
              }}>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Wandercall Experience Provider Policy & Declaration
                </motion.span>
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                gap: 2
              }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Chip 
                    label="Welcome to Wandercall" 
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      px: 2,
                      py: 1
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Typography variant="body1" sx={{ 
                mb: 2,
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                lineHeight: 1.8,
                textAlign: 'center',
                fontSize: { xs: '0.95rem', md: '1rem' },
                fontWeight: 400
              }}>
                We believe in empowering individuals to share their passions as unique experiences.
                As an Experience Provider, you play the most important role in shaping meaningful and memorable moments for participants.
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Typography variant="body1" sx={{ 
                color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                lineHeight: 1.8,
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: { xs: '0.9rem', md: '1rem' },
                px: { xs: 1, md: 2 }
              }}>
                This declaration sets out our shared understanding. It protects you, the participants, and Wandercall — while ensuring a spirit of collaboration.
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.1 * (index + 4),
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6 }
            }}
            viewport={{ once: true, margin: '-100px' }}
            onViewportEnter={() => setActiveSection(index)}
          >
            <Paper sx={{
              p: { xs: 3, md: 4 },
              mb: { xs: 2, md: 3 },
              background: isDark 
                ? 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: isDark 
                ? `1px solid ${activeSection === index ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`
                : `1px solid ${activeSection === index ? 'rgba(99, 102, 241, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: activeSection === index 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
                  : 'transparent',
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              },
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: isDark
                  ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.2)'
                  : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.2)',
                borderColor: isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.4)'
              },
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Box sx={{
                      p: { xs: 1.2, md: 1.5 },
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                      mr: { xs: 1.5, md: 2 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -2,
                        borderRadius: 'inherit',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'xor',
                        WebkitMaskComposite: 'xor'
                      }
                    }}>
                      {React.cloneElement(section.icon, { 
                        sx: { 
                          color: 'white', 
                          fontSize: { xs: 20, md: 24 },
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        } 
                      })}
                    </Box>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                      color: isDark ? 'white' : 'black',
                      lineHeight: 1.2
                    }}>
                      {section.title}
                    </Typography>
                  </motion.div>
                </Box>
              </motion.div>
              
              <Box component="ul" sx={{ pl: { xs: 1, md: 2 }, m: 0, position: 'relative', zIndex: 1 }}>
                {section.content.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + (itemIndex * 0.1),
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <Typography 
                      component="li" 
                      variant="body1" 
                      sx={{ 
                        mb: { xs: 1.2, md: 1.5 },
                        color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)',
                        lineHeight: 1.8,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        fontWeight: 400,
                        position: 'relative',
                        pl: 1,
                        '&::marker': {
                          color: '#6366f1',
                          fontSize: '1.2em'
                        },
                        '&:hover': {
                          color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
                          transition: 'color 0.2s ease'
                        }
                      }}
                    >
                      {item}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        ))}

        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileInView={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.8 }
          }}
          viewport={{ once: true }}
        >
          <Paper sx={{
            p: { xs: 3, md: 4 },
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 30%, #ec4899 70%, #f59e0b 100%)',
            color: 'white',
            borderRadius: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              animation: 'shimmer 3s infinite',
            },
            '@keyframes shimmer': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' }
            }
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '1.5rem', md: '2.125rem' },
                position: 'relative',
                zIndex: 1
              }}>
                Our Shared Commitment
              </Typography>
            </motion.div>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, opacity: 0.95 }}>
              By agreeing to this declaration, you confirm that:
            </Typography>
            <Box component="ul" sx={{ textAlign: 'left', maxWidth: 800, mx: 'auto' }}>
              <Typography component="li" variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, opacity: 0.9 }}>
                You understand and accept your responsibilities as an independent experience provider.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, opacity: 0.9 }}>
                You acknowledge Wandercall's role as a supportive platform and facilitator, not as a direct organizer.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, opacity: 0.9 }}>
                You are committed to building safe, authentic, and memorable experiences — with Wandercall as your trusted platform partner.
              </Typography>
            </Box>
            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, fontStyle: 'italic' }}>
              Together, let's redefine how people connect, share, and experience the world.
            </Typography>
          </Paper>
        </motion.div>
        
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000
              }}
            >
              <Tooltip title="Scroll to top" placement="left">
                <Fab
                  onClick={scrollToTop}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      transform: 'scale(1.1)'
                    },
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  <KeyboardArrowUp />
                </Fab>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default ProviderTerms;