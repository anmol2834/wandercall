const express = require('express');
const { getReviews, addReview, toggleReviewLike } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/:productId - Get reviews for a product
router.get('/:productId', getReviews);

// POST /api/reviews/:productId - Add a new review (admin only)
router.post('/:productId', addReview);

// POST /api/reviews/like/:reviewId - Toggle like on a review
router.post('/like/:reviewId', auth, toggleReviewLike);

module.exports = router;