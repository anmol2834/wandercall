import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Search, CalendarMonth, Celebration } from '@mui/icons-material';
import './HowItWorks.css';

const steps = [
  {
    icon: <Search />,
    title: 'Discover',
    description: 'Explore our curated collection of one-of-a-kind experiences across various categories and locations.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: <CalendarMonth />,
    title: 'Book',
    description: 'Secure your spot with our simple booking process, instant confirmation, and flexible payment options.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: <Celebration />,
    title: 'Enjoy',
    description: 'Create lasting memories with expertly designed and professionally hosted experiences.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

const HowItWorks = () => {
  return (
    <Container maxWidth="lg" className="how-it-works-container">
      <Typography variant="h2" className="section-title">
        How It Works
      </Typography>
      <Typography variant="h6" className="section-subtitle">
        Three simple steps to your next adventure
      </Typography>
      
      <Grid container spacing={4} className="steps-grid">
        {steps.map((step, index) => (
          <Grid item xs={12} md={4} key={step.title}>
            <Card className="step-card" data-step={index + 1}>
              <Box 
                className="icon-container"
                sx={{ background: step.gradient }}
              >
                {step.icon}
              </Box>
              <CardContent className="step-content">
                <Typography variant="h5" className="step-title">
                  {step.title}
                </Typography>
                <Typography variant="body1" className="step-description">
                  {step.description}
                </Typography>
              </CardContent>
              <Box className="step-number">
                {index + 1}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HowItWorks;