import { useDataCache } from './useDataCache';
import { useAuth } from '../contexts/AuthContext';
import { wishlistAPI } from '../services/api';

export const useOptimizedWishlist = () => {
  const { user } = useAuth();
  
  const fetchWishlist = async (signal) => {
    if (!user) return [];
    
    const response = await wishlistAPI.getWishlist(signal);
    return response.data.data || [];
  };

  const {
    data: wishlistItems,
    loading,
    error,
    refetch,
    mutate
  } = useDataCache(
    `wishlist-${user?.id || 'anonymous'}`,
    fetchWishlist,
    {
      enabled: !!user,
      ttl: 3 * 60 * 1000, // 3 minutes
      dependencies: [user?.id]
    }
  );

  const addToWishlist = async (productId, productData) => {
    if (!user) throw new Error('User not authenticated');

    // Optimistic update
    const currentItems = wishlistItems || [];
    const newItem = productData ? { product: productData } : { productId };
    const optimisticItems = [...currentItems, newItem];
    mutate(optimisticItems);

    try {
      await wishlistAPI.addToWishlist(productId);
      // Refetch to get the complete data
      await refetch();
      return true;
    } catch (error) {
      // Revert on error
      mutate(currentItems);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) throw new Error('User not authenticated');

    // Optimistic update
    const currentItems = wishlistItems || [];
    const optimisticItems = currentItems.filter(
      item => item.productId !== productId && item.product?._id !== productId
    );
    mutate(optimisticItems);

    try {
      await wishlistAPI.removeFromWishlist(productId);
      return true;
    } catch (error) {
      // Revert on error
      mutate(currentItems);
      throw error;
    }
  };

  const isWishlisted = (productId) => {
    if (!wishlistItems) return false;
    return wishlistItems.some(
      item => item.productId === productId || item.product?._id === productId
    );
  };

  return {
    wishlistItems: wishlistItems || [],
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    refetch
  };
};