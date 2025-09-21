import { wishlistAPI } from './api';
import { setWishlistItems, addWishlistItem, removeWishlistItem } from '../redux/slices/wishlistSlice';
import { throttle } from '../utils/throttle';
import { clearCache } from '../hooks/useDataCache';

class WishlistService {
  constructor() {
    this.store = null;
  }

  setStore(store) {
    this.store = store;
  }

  // Initialize wishlist data
  async initializeWishlist() {
    if (!this.store) return;
    
    try {
      const response = await wishlistAPI.getWishlist();
      const items = response.data.data || [];
      this.store.dispatch(setWishlistItems(items));
    } catch (error) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error('Failed to initialize wishlist:', error);
      }
    }
  }

  // Add to wishlist with real-time update
  async addToWishlist(productId, productData = null) {
    if (!this.store) return false;

    return throttle(`add-${productId}`, async () => {
      try {
        // Optimistic update
        this.store.dispatch(addWishlistItem({ 
          productId, 
          item: productData ? { product: productData } : null 
        }));

        // API call
        await wishlistAPI.addToWishlist(productId);
        
        // Refresh to get complete data
        await this.initializeWishlist();
        
        return true;
      } catch (error) {
        // Revert on error
        this.store.dispatch(removeWishlistItem(productId));
        console.error('Failed to add to wishlist:', error);
        return false;
      }
    }, 500);
  }

  // Remove from wishlist with real-time update
  async removeFromWishlist(productId) {
    if (!this.store) return false;

    return throttle(`remove-${productId}`, async () => {
      try {
        // Optimistic update
        this.store.dispatch(removeWishlistItem(productId));

        // API call
        await wishlistAPI.removeFromWishlist(productId);
        
        return true;
      } catch (error) {
        // Refresh on error to get correct state
        await this.initializeWishlist();
        console.error('Failed to remove from wishlist:', error);
        return false;
      }
    }, 500);
  }

  // Check if product is wishlisted
  isWishlisted(productId) {
    if (!this.store) return false;
    const state = this.store.getState();
    return state.wishlist.status[productId] || false;
  }

  // Get wishlist items
  getWishlistItems() {
    if (!this.store) return [];
    const state = this.store.getState();
    return state.wishlist.items;
  }
}

export const wishlistService = new WishlistService();