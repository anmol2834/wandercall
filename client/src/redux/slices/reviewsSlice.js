import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewsAPI } from '../../services/reviewsAPI';

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId, { getState, rejectWithValue }) => {
    const { reviewsCache } = getState().reviews;
    
    // Check if reviews are cached for this product
    const cachedReviews = reviewsCache[productId];
    if (cachedReviews && (Date.now() - cachedReviews.timestamp) < 5 * 60 * 1000) {
      return { reviews: cachedReviews.reviews, productId };
    }
    
    try {
      const response = await reviewsAPI.getReviews(productId);
      return { ...response.data, productId };
    } catch (error) {
      // Silently fail if backend not available
      if (error.response?.status === 404) {
        return { reviews: [], productId };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.addReview(productId, reviewData);
      return response.data;
    } catch (error) {
      // Handle backend not available
      if (error.response?.status === 404) {
        return rejectWithValue('Backend API not available. Please implement the reviews endpoints.');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    addingReview: false,
    reviewsCache: {}, // Cache reviews by productId
    currentProductId: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        const { reviews, productId } = action.payload;
        state.reviews = reviews || [];
        state.currentProductId = productId;
        
        // Cache the reviews
        state.reviewsCache[productId] = {
          reviews: reviews || [],
          timestamp: Date.now()
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        // Don't show error for 404s, just use empty reviews
        if (action.payload !== 'Failed to fetch reviews') {
          state.error = action.payload;
        }
      })
      // Add review
      .addCase(addReview.pending, (state) => {
        state.addingReview = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.addingReview = false;
        state.reviews.unshift(action.payload.review);
        
        // Update cache with new review
        if (state.currentProductId && state.reviewsCache[state.currentProductId]) {
          state.reviewsCache[state.currentProductId].reviews.unshift(action.payload.review);
          state.reviewsCache[state.currentProductId].timestamp = Date.now();
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.addingReview = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearReviews } = reviewsSlice.actions;

// Selectors
export const selectAverageRating = (state, productId) => {
  const cachedReviews = state.reviews.reviewsCache[productId];
  const reviews = cachedReviews?.reviews || [];
  
  if (reviews.length === 0) {
    return 0; // Return 0 if no reviews, don't use product static rating
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  const averageRating = totalRating / reviews.length;
  
  return Math.round(averageRating * 10) / 10; // Round to 1 decimal place
};

export const selectReviewCount = (state, productId) => {
  const cachedReviews = state.reviews.reviewsCache[productId];
  return cachedReviews?.reviews?.length || 0;
};

export default reviewsSlice.reducer;