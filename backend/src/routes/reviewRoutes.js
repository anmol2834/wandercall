const express = require('express');
const { getReviews, addReview } = require('../controllers/reviewController');

const router = express.Router();

// GET /api/reviews/:productId - Get reviews for a product
router.get('/:productId', getReviews);

// POST /api/reviews/:productId - Add a new review (admin only)
router.post('/:productId', addReview);

module.exports = router;