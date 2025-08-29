import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import experiencesReducer from '../features/experiences/experiencesSlice';
import rewardsReducer from '../redux/slices/rewardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    experiences: experiencesReducer,
    rewards: rewardsReducer,
  },
});