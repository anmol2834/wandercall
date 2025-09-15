import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import experiencesReducer from './slices/experiencesSlice';
import productsReducer from './slices/productsSlice';
import ticketReducer from './slices/ticketSlice';
import checkoutReducer from './slices/checkoutSlice';
import reviewsReducer from './slices/reviewsSlice';
import wishlistReducer from './slices/wishlistSlice';



export const store = configureStore({
  reducer: {
    theme: themeReducer,
    experiences: experiencesReducer,
    products: productsReducer,
    tickets: ticketReducer,
    checkout: checkoutReducer,
    reviews: reviewsReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
});

// Initialize wishlist service
import { wishlistService } from '../services/wishlistService';
wishlistService.setStore(store);