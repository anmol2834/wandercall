import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rewardsAPI } from '../../services/api';

// Async thunks
export const fetchUserRewards = createAsyncThunk(
  'rewards/fetchUserRewards',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await rewardsAPI.getUserRewards(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rewards');
    }
  }
);

export const redeemReward = createAsyncThunk(
  'rewards/redeemReward',
  async ({ rewardId, userId }, { rejectWithValue }) => {
    try {
      const response = await rewardsAPI.redeemReward({ rewardId, userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to redeem reward');
    }
  }
);

export const earnXP = createAsyncThunk(
  'rewards/earnXP',
  async ({ userId, amount, source, description }, { rejectWithValue }) => {
    try {
      const response = await rewardsAPI.earnXP({ userId, amount, source, description });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to earn XP');
    }
  }
);

const initialState = {
  xpBalance: 0,
  totalEarned: 0,
  totalRedeemed: 0,
  currentTier: 'Bronze',
  rewards: [],
  history: [],
  availableRewards: [],
  loading: false,
  error: null
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRewards: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Rewards
      .addCase(fetchUserRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.xpBalance = action.payload.xpBalance || 0;
        state.totalEarned = action.payload.totalEarned || 0;
        state.totalRedeemed = action.payload.totalRedeemed || 0;
        state.currentTier = action.payload.currentTier || 'Bronze';
        state.rewards = action.payload.rewards || [];
        state.history = action.payload.history || [];
        state.availableRewards = action.payload.availableRewards || [];
      })
      .addCase(fetchUserRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Redeem Reward
      .addCase(redeemReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(redeemReward.fulfilled, (state, action) => {
        state.loading = false;
        state.xpBalance = action.payload.newBalance;
        state.totalRedeemed += action.payload.cost;
        state.history.unshift({
          type: 'redeemed',
          description: action.payload.rewardName,
          amount: action.payload.cost,
          date: new Date().toISOString()
        });
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Earn XP
      .addCase(earnXP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(earnXP.fulfilled, (state, action) => {
        state.loading = false;
        state.xpBalance += action.payload.amount;
        state.totalEarned += action.payload.amount;
        state.history.unshift({
          type: 'earned',
          description: action.payload.description,
          amount: action.payload.amount,
          date: new Date().toISOString()
        });
      })
      .addCase(earnXP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, resetRewards } = rewardsSlice.actions;
export default rewardsSlice.reducer;