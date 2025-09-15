import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

// Async thunks with caching
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    const { products } = getState().products;
    
    // Return cached data if available and not stale
    if (products.length > 0) {
      return products;
    }
    
    try {
      const response = await productAPI.getAllProducts();
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { getState, rejectWithValue }) => {
    if (!productId || productId === 'undefined') {
      return rejectWithValue('Invalid product ID');
    }
    
    const { products, selectedProduct } = getState().products;
    
    // Check if product is already in products array
    const cachedProduct = products.find(p => p._id === productId);
    if (cachedProduct) {
      return cachedProduct;
    }
    
    // Check if it's the currently selected product
    if (selectedProduct && selectedProduct._id === productId) {
      return selectedProduct;
    }
    
    try {
      const response = await productAPI.getProductById(productId);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await productAPI.searchProducts(searchParams);
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    searchResults: [],
    loading: false,
    error: null,
    searchLoading: false,
    productLoading: false,
    lastFetched: null,
    cacheExpiry: 5 * 60 * 1000 // 5 minutes
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
        
        // Update product in products array if it exists
        const existingIndex = state.products.findIndex(p => p._id === action.payload._id);
        if (existingIndex !== -1) {
          state.products[existingIndex] = action.payload;
        } else {
          // Add to products array if not exists
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSelectedProduct, clearSearchResults, clearError } = productsSlice.actions;
export default productsSlice.reducer;