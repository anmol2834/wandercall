import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Star } from '@mui/icons-material';

const ExperienceCard = ({ experience }) => {
  return (
    <Card className="card-hover" elevation={3}>
      <CardMedia
        component="img"
        height="200"
        image={experience.image}
        alt={experience.title}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {experience.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {experience.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Star sx={{ color: '#fbbf24', fontSize: 16 }} />
            <Typography variant="body2">{experience.rating}</Typography>
          </Box>
          <Chip label={`$${experience.price}`} color="primary" size="small" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;