import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk for toggling review like
export const toggleReviewLike = createAsyncThunk(
  'reviewLikes/toggle',
  async ({ reviewId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reviews/like/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { reviewId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

const reviewLikesSlice = createSlice({
  name: 'reviewLikes',
  initialState: {
    likes: {}, // { reviewId: { liked: boolean, count: number } }
    loading: {},
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleReviewLike.pending, (state, action) => {
        const reviewId = action.meta.arg.reviewId;
        state.loading[reviewId] = true;
        state.error = null;
      })
      .addCase(toggleReviewLike.fulfilled, (state, action) => {
        const { reviewId, liked, likes } = action.payload;
        state.likes[reviewId] = { liked, count: likes };
        state.loading[reviewId] = false;
      })
      .addCase(toggleReviewLike.rejected, (state, action) => {
        const reviewId = action.meta.arg.reviewId;
        state.loading[reviewId] = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = reviewLikesSlice.actions;
export default reviewLikesSlice.reducer;