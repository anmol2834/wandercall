import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import experiencesReducer from './slices/experiencesSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    experiences: experiencesReducer,
  },
});