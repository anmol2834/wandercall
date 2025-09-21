import { Box, Container, Typography, Grid, Card, CardContent, IconButton, Chip, Avatar, LinearProgress, useTheme } from '@mui/material';
import { ArrowBack, Star, TrendingUp, People, Favorite, Rocket, Security, Speed, EmojiEvents, LocationOn, Phone, Email } from '@mui/icons-material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState(0);
  const [counters, setCounters] = useState({ experiencerss: 0, rating: 0, destinations: 0, satisfaction: 0 });
  
  usePageTitle('About Us');

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounters({ experiencerss: 50000, rating: 4.9, destinations: 200, satisfaction: 99 });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: <People />, number: '20K+', label: 'Happy Experiencers', color: '#6366f1', progress: 85 },
    { icon: <Star />, number: '4.9', label: 'Average Rating', color: '#f59e0b', progress: 98 },
    { icon: <TrendingUp />, number: '200+', label: 'Destinations', color: '#10b981', progress: 75 },
    { icon: <Favorite />, number: '99%', label: 'Satisfaction Rate', color: '#ec4899', progress: 99 }
  ];

  const values = [
    { icon: <Rocket />, title: 'Innovation', description: 'Cutting-edge technology for seamless experiences' },
    { icon: <Security />, title: 'Trust', description: 'Your safety and security is our top priority' },
    { icon: <Speed />, title: 'Excellence', description: 'Delivering exceptional service every time' },
    { icon: <EmojiEvents />, title: 'Achievement', description: 'Award-winning experiences' }
  ];

  const milestones = [
    { year: '2024', title: 'Founded', description: 'wandercall was born in Surat' },
    { year: '2025', title: '10K Users', description: 'Reached our first major milestone' },
    { year: '2026', title: 'Willing to Pan-India', description: 'Expanded across all major cities' },
    { year: '2027', title: 'Willing to 50K+ Experiencers', description: 'Half a million happy customers' },
    { year: '2024', title: 'Willi to Global Vision', description: 'Expanding to international destinations' }
  ];

  const teamMembers = [
    {
      name: 'Rishi Sinha',
      role: 'CEO & Co-Founder',
      description: 'Oversees production and operations, ensuring seamless delivery of experiences',
      photo: 'https://res.cloudinary.com/drfndqoql/image/upload/v1758282103/rishi_photo_mc3xuq.png'
    },
    {
      name: 'Anmol Sinha',
      role: 'CTO & Co-Founder',
      description: 'Developer and tech architect, building and scaling the core application',
      photo: 'https://res.cloudinary.com/drfndqoql/image/upload/v1758279542/my-profile-pic_mdcc5t.png'
    },
    {
      name: 'Suryansh Pandey',
      role: 'CFO & Co-Founder',
      description: 'Leads budgeting, financial planning, and negotiations to drive sustainable growth',
      photo: 'https://res.cloudinary.com/drfndqoql/image/upload/v1758282934/Gemini_Generated_Image_gvhvsogvhvsogvhv_pkdhzv.png'
    }
  ];

  return (
    <Box className="about-page-container" sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      {/* Back Button */}
      <IconButton 
        className="about-back-button"
        onClick={() => navigate('/')}
      >
        <ArrowBack />
      </IconButton>

      {/* Hero Section */}
      <Box className="about-hero-section">
        <div className="about-floating-elements">
          <motion.div className="about-floating-circle about-circle-1" animate={{ y: [-20, 20, -20] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.div className="about-floating-circle about-circle-2" animate={{ y: [20, -20, 20] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.div className="about-floating-circle about-circle-3" animate={{ y: [-15, 15, -15] }} transition={{ duration: 5, repeat: Infinity }} />
        </div>
        
        <Container maxWidth="lg">
          <motion.div
            style={{ y, opacity }}
            className="about-hero-content"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Chip label="✨ Trusted by 50K+ Experiencers" className="about-hero-chip" />
              <Typography variant="h1" className="about-hero-title">
                About <span className="about-gradient-text">wandercall</span>
              </Typography>
              <p style={{ textAlign: 'center', color: "white", maxWidth: 600, margin: '0 auto' }}>
                Connecting experiencerss with extraordinary experiences across India and beyond
              </p>
            </motion.div>
            
            {/* Enhanced Hero Illustration */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="about-hero-illustration"
            >
              <div className="about-illustration-container">
                <motion.div 
                  className="about-pulse-ring"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <svg viewBox="0 0 500 300" className="about-main-illustration">
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="25%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="75%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  <motion.circle 
                    cx="150" cy="150" r="80" 
                    fill="url(#heroGrad)" 
                    opacity="0.3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle 
                    cx="350" cy="150" r="60" 
                    fill="url(#heroGrad)" 
                    opacity="0.2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.rect 
                    x="200" y="100" width="100" height="100" rx="20" 
                    fill="url(#heroGrad)" 
                    opacity="0.4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.circle 
                    cx="250" cy="150" r="30" 
                    fill="white" 
                    opacity="0.9"
                    filter="url(#glow)"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.path 
                    d="M100 250 Q250 200 400 250" 
                    stroke="url(#heroGrad)" 
                    strokeWidth="4" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced Stats Section */}
      <Container maxWidth="lg" className="about-stats-section" sx={{ pt: { xs: 6, sm: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="about-stats-header"
        >
          <Typography variant="h3" className="about-stats-title">
            Our Impact in Numbers
          </Typography>
          <p style={{ textAlign: 'center', color: theme.palette.text.secondary, maxWidth: 600, margin: '0 auto' }}>
            Real metrics that showcase our commitment to excellence
          </p>
        </motion.div>
        
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="stat-card enhanced-card" sx={{ backgroundColor: theme.palette.background.paper }}>
                  <CardContent className="stat-content">
                    <motion.div 
                      className="stat-icon"
                      style={{ backgroundColor: stat.color }}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <Typography variant="h3" className="stat-number">
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      {stat.label}
                    </Typography>
                    <Box className="progress-container">
                      <LinearProgress 
                        variant="determinate" 
                        value={stat.progress} 
                        className="stat-progress"
                        sx={{ 
                          '& .MuiLinearProgress-bar': { 
                            backgroundColor: stat.color 
                          }
                        }}
                      />
                      <Typography variant="caption" className="progress-text">
                        {stat.progress}% Growth
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Values Section */}
      <Container maxWidth="lg" className="values-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="values-header"
        >
          <Typography variant="h3" className="section-title">
            Our Core Values
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="value-card" sx={{ backgroundColor: theme.palette.background.paper }}>
                  <CardContent className="value-content">
                    <motion.div 
                      className="value-icon"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      {value.icon}
                    </motion.div>
                    <Typography variant="h6" className="value-title">
                      {value.title}
                    </Typography>
                    <Typography variant="body2" className="value-description">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Journey Section */}
      <Box className="about-journey-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-journey-header"
          >
            <Typography variant="h3" className="section-title about-journey-title">
              Our Journey
            </Typography>
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', maxWidth: 600, margin: '0 auto' }}>
              Milestones that shaped our story
            </p>
          </motion.div>
          
          <div className="about-journey-timeline">
            <div className="about-timeline-line" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={`about-timeline-item ${index % 2 === 0 ? 'about-timeline-left' : 'about-timeline-right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <motion.div 
                  className="about-timeline-dot"
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="about-dot-inner" />
                </motion.div>
                
                <motion.div 
                  className="about-timeline-content"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="about-timeline-card">
                    <div className="about-timeline-year">{milestone.year}</div>
                    <div className="about-timeline-details">
                      <Typography variant="h5" className="about-timeline-title">
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" className="about-timeline-description">
                        {milestone.description}
                      </Typography>
                    </div>
                    <div className="about-timeline-glow" />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" className="story-section">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h3" className="section-title">
                Our Story
              </Typography>
              <Typography variant="body1" className="story-text">
                Founded in 2024, wandercall began as a dream to make experiences accessible and memorable for everyone. We believe that every experience should be spark joy in your life and creates lasting memories.
              </Typography>
              <Typography variant="body1" className="story-text">
                From humble beginnings in Surat, we've grown to serve thousands of experiencerss across India, offering curated experiences that showcase the beauty, culture, and diversity of our incredible country.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="story-illustration"
            >
              <svg viewBox="0 0 400 300" className="story-svg">
                <defs>
                  <linearGradient id="storyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <rect x="50" y="50" width="300" height="200" rx="20" fill="url(#storyGrad)" opacity="0.2" />
                <circle cx="200" cy="120" r="40" fill="url(#storyGrad)" />
                <rect x="100" y="180" width="200" height="60" rx="30" fill="url(#storyGrad)" opacity="0.6" />
                <circle cx="120" cy="80" r="20" fill="url(#storyGrad)" opacity="0.4" />
                <circle cx="280" cy="80" r="20" fill="url(#storyGrad)" opacity="0.4" />
              </svg>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Container maxWidth="lg" className="team-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="team-header"
        >
          <Typography variant="h3" className="section-title">
            Meet Our Team
          </Typography>
          <p style={{ textAlign: 'center', color: theme.palette.text.secondary, maxWidth: 600, margin: '0 auto' }}>
            Passionate individuals dedicated to creating amazing experiences
          </p>
        </motion.div>

        <Grid container spacing={4} className="team-grid">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="team-card" sx={{ backgroundColor: theme.palette.background.paper }}>
                  <CardContent className="team-content">
                    <Box className="team-avatar">
                      <div className="photo-frame">
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="team-photo"
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '4px solid #6366f1',
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                          }}
                        />
                      </div>
                    </Box>
                    <Typography variant="h5" className="team-name">
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" className="team-role">
                      {member.role}
                    </Typography>
                    <Typography variant="body2" className="team-description">
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Mission Section */}
      <Box className="mission-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mission-content"
          >
            <Typography variant="h3" className="mission-title">
              Our Mission
            </Typography>
            <Typography variant="h6" className="mission-text">
              To inspire and enable meaningful experiences that connect people with places, cultures, and memories that last a lifetime.
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;