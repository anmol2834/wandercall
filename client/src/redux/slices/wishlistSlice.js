import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // Full wishlist items with product details
    status: {}, // Simple productId: boolean mapping
    loading: false
  },
  reducers: {
    setWishlistItems: (state, action) => {
      state.items = action.payload;
      // Update status mapping
      state.status = {};
      action.payload.forEach(item => {
        const productId = item.product?._id || item._id;
        state.status[productId] = true;
      });
    },
    addWishlistItem: (state, action) => {
      const { productId, item } = action.payload;
      state.status[productId] = true;
      if (item && !state.items.find(i => (i.product?._id || i._id) === productId)) {
        state.items.push(item);
      }
    },
    removeWishlistItem: (state, action) => {
      const productId = action.payload;
      state.status[productId] = false;
      state.items = state.items.filter(item => (item.product?._id || item._id) !== productId);
    },
    clearWishlist: (state) => {
      state.items = [];
      state.status = {};
    }
  }
});

export const { setWishlistItems, addWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;