import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import experiencesReducer from './slices/experiencesSlice';
import productsReducer from './slices/productsSlice';
import ticketReducer from './slices/ticketSlice';
import checkoutReducer from './slices/checkoutSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    experiences: experiencesReducer,
    products: productsReducer,
    tickets: ticketReducer,
    checkout: checkoutReducer,
  },
});