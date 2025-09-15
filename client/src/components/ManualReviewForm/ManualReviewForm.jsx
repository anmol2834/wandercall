import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, Rating, Button,
  CircularProgress, Alert
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { addReview } from '../../redux/slices/reviewsSlice';
import { useAuth } from '../../contexts/AuthContext';

const ManualReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { addingReview, error } = useSelector(state => state.reviews);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  // Only show for authorized emails
  const authorizedEmails = ['anmolsinha4321@gmail.com', 'rishi.sinha0101@gmail.com', 'sp9094065@gmail.com'];
  if (!user || !authorizedEmails.includes(user.email)) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    try {
      await dispatch(addReview({ 
        productId, 
        reviewData: { ...formData, userEmail: user.email } 
      })).unwrap();
      setFormData({ name: '', rating: 5, comment: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="outlined"
        startIcon={showForm ? <Close /> : <Add />}
        onClick={() => setShowForm(!showForm)}
        size="small"
        sx={{ mb: 2 }}
      >
        {showForm ? 'Cancel' : 'Add Manual Review'}
      </Button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Manual Review
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Reviewer Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    sx={{ mb: 2 }}
                    required
                  />

                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend" gutterBottom>
                      Rating
                    </Typography>
                    <Rating
                      value={formData.rating}
                      onChange={(e, newValue) => setFormData({ ...formData, rating: newValue })}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Review Comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    sx={{ mb: 2 }}
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={addingReview || !formData.name.trim() || !formData.comment.trim()}
                    startIcon={addingReview ? <CircularProgress size={16} /> : null}
                  >
                    {addingReview ? 'Adding...' : 'Add Review'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ManualReviewForm;