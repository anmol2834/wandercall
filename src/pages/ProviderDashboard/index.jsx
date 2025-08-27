import { Container, Typography, Box } from '@mui/material';

const ProviderDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Provider Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ProviderDashboard;