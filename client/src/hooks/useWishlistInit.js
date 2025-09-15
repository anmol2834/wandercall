import { useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from '../contexts/AuthContext';

// Hook to initialize wishlist data when user logs in
export const useWishlistInit = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize wishlist through service
      wishlistService.initializeWishlist();
    }
  }, [isAuthenticated, user]);
};