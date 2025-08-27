import { Box, Typography, Card, CardContent, Container } from '@mui/material';
import { motion } from 'framer-motion';

export const BookedPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Booked Experiences</Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your booked travel experiences and adventures.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const WishlistPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Wishlist</Typography>
          <Typography variant="body1" color="text.secondary">
            Your saved experiences and dream destinations.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const RewardsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Rewards & Points</Typography>
          <Typography variant="body1" color="text.secondary">
            Track your reward points and redeem exclusive benefits.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const HelpPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Help Center</Typography>
          <Typography variant="body1" color="text.secondary">
            Find answers to common questions and get support.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const CommunityPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Community</Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with fellow travelers and share experiences.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const JournalPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Experience Journal</Typography>
          <Typography variant="body1" color="text.secondary">
            Document your travel memories and experiences.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const QAPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Questions & Answers</Typography>
          <Typography variant="body1" color="text.secondary">
            Ask questions and get answers from the community.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);

export const TransactionsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Container maxWidth="lg">
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>Transaction History</Typography>
          <Typography variant="body1" color="text.secondary">
            View your payment history and transaction details.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </motion.div>
);