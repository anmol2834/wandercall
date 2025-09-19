const Review = require('../models/Review');

// Get reviews for a product
const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// Add a new review (authorized users only)
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, rating, comment, userEmail } = req.body;
    
    // Check if user is authorized to add reviews
    const authorizedEmails = [
      'anmolsinha4321@gmail.com',
      'rishi.sinha0101@gmail.com', 
      'sp9094065@gmail.com'
    ];
    
    if (!userEmail || !authorizedEmails.includes(userEmail)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add reviews'
      });
    }
    
    // Validate input
    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and comment are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const review = new Review({
      productId,
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      createdBy: userEmail
    });
    
    await review.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
};

// Toggle like on a review
const toggleReviewLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    const hasLiked = review.likedBy.includes(userId);
    
    if (hasLiked) {
      // Unlike
      review.likedBy.pull(userId);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      // Like
      review.likedBy.push(userId);
      review.likes += 1;
    }
    
    await review.save();
    
    res.json({
      success: true,
      liked: !hasLiked,
      likes: review.likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    });
  }
};

module.exports = {
  getReviews,
  addReview,
  toggleReviewLike
};