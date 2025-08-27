import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import experiencesReducer from '../features/experiences/experiencesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    experiences: experiencesReducer,
  },
});