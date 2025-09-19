import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

// Async thunks with caching
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    const { products, lastFetched, cacheExpiry } = getState().products;
    
    // Return cached data if available and not stale
    if (products.length > 0 && lastFetched && (Date.now() - lastFetched < cacheExpiry)) {
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
      return { product: cachedProduct, fromCache: true };
    }
    
    // Check if it's the currently selected product
    if (selectedProduct && selectedProduct._id === productId) {
      return { product: selectedProduct, fromCache: true };
    }
    
    try {
      const response = await productAPI.getProductById(productId);
      return { product: response.data.product, fromCache: false };
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

export const fetchProviderAvailability = createAsyncThunk(
  'products/fetchProviderAvailability',
  async (productId, { getState, rejectWithValue }) => {
    if (!productId) {
      return rejectWithValue('Product ID is required');
    }
    
    const { providerAvailability } = getState().products;
    
    // Return cached availability if exists
    if (providerAvailability[productId]) {
      return { productId, availability: providerAvailability[productId] };
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.wandercall.com'}/api/products/${productId}/availability`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      
      const data = await response.json();
      return { productId, availability: data.availability || [] };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch provider availability');
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
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
    // Provider availability state
    providerAvailability: {}, // { productId: availableDays[] }
    availabilityLoading: false,
    availabilityError: null
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
    },
    clearAvailabilityError: (state) => {
      state.availabilityError = null;
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
        const { product, fromCache } = action.payload;
        state.selectedProduct = product;
        
        // Only update products array if this product came from API (not from cache)
        // and if we don't already have a full products list
        if (!fromCache) {
          const existingIndex = state.products.findIndex(p => p._id === product._id);
          if (existingIndex !== -1) {
            state.products[existingIndex] = product;
          } else if (state.products.length > 0) {
            // Only add to products array if we already have products loaded
            // This prevents replacing the full products list with just one product
            state.products.push(product);
          }
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
      })
      // Fetch provider availability
      .addCase(fetchProviderAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.availabilityError = null;
      })
      .addCase(fetchProviderAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        const { productId, availability } = action.payload;
        state.providerAvailability[productId] = availability;
      })
      .addCase(fetchProviderAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.availabilityError = action.payload;
      });
  }
});

export const { clearSelectedProduct, clearSearchResults, clearError, clearAvailabilityError } = productsSlice.actions;

// Selectors
export const selectProviderAvailability = (state, productId) => 
  state.products.providerAvailability[productId] || [];

export const selectAvailabilityLoading = (state) => state.products.availabilityLoading;
export const selectAvailabilityError = (state) => state.products.availabilityError;
export default productsSlice.reducer;