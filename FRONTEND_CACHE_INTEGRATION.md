# Frontend Cache Integration Guide

## Real-Time Cache Revalidation

Your backend now sends cache revalidation signals to the frontend. Here's how to integrate:

### 1. Response Headers to Monitor

```javascript
// After any API call, check these headers:
const response = await fetch('/api/users/profile', { method: 'PUT', ... });

// Check if cache refresh is needed
const shouldRevalidate = response.headers.get('X-Revalidate') === 'true';
const revalidationType = response.headers.get('X-Revalidate-Type');
const forceRefresh = response.headers.get('X-Force-Refresh') === 'true';

if (shouldRevalidate || forceRefresh) {
  // Trigger frontend cache refresh based on type
  handleCacheRevalidation(revalidationType);
}
```

### 2. Revalidation Types

```javascript
const handleCacheRevalidation = (type) => {
  switch (type) {
    case 'user-profile':
      // Refresh user profile data
      dispatch(fetchUserProfile());
      break;
      
    case 'user-wishlist':
      // Refresh wishlist data
      dispatch(fetchWishlist());
      break;
      
    case 'products':
      // Refresh product listings
      dispatch(fetchProducts());
      break;
      
    case 'user-bookings':
      // Refresh user bookings and tickets
      dispatch(fetchUserBookings());
      dispatch(fetchUserTickets());
      break;
  }
};
```

### 3. Manual Cache Refresh

```javascript
// Force refresh user-specific cache
const refreshUserCache = async () => {
  try {
    const response = await fetch('/api/cache/refresh/user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Refresh all user-related data
      dispatch(fetchUserProfile());
      dispatch(fetchWishlist());
      dispatch(fetchUserBookings());
    }
  } catch (error) {
    console.error('Cache refresh failed:', error);
  }
};

// Force refresh products cache
const refreshProductsCache = async () => {
  try {
    await fetch('/api/cache/refresh/products', { method: 'POST' });
    dispatch(fetchProducts());
  } catch (error) {
    console.error('Products cache refresh failed:', error);
  }
};
```

### 4. Axios Interceptor Integration

```javascript
// Add to your axios setup
axios.interceptors.response.use(
  (response) => {
    // Check for cache revalidation headers
    const shouldRevalidate = response.headers['x-revalidate'] === 'true';
    const revalidationType = response.headers['x-revalidate-type'];
    const forceRefresh = response.headers['x-force-refresh'] === 'true';
    
    if (shouldRevalidate || forceRefresh) {
      // Dispatch revalidation event
      window.dispatchEvent(new CustomEvent('cache-revalidate', {
        detail: { type: revalidationType, force: forceRefresh }
      }));
    }
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Listen for revalidation events
window.addEventListener('cache-revalidate', (event) => {
  handleCacheRevalidation(event.detail.type);
});
```

### 5. Redux Integration

```javascript
// Add to your Redux store
const cacheMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Listen for successful API actions
  if (action.type.endsWith('/fulfilled')) {
    const meta = action.meta;
    if (meta?.response?.headers) {
      const shouldRevalidate = meta.response.headers['x-revalidate'] === 'true';
      const revalidationType = meta.response.headers['x-revalidate-type'];
      
      if (shouldRevalidate) {
        // Dispatch appropriate refresh actions
        switch (revalidationType) {
          case 'user-profile':
            store.dispatch(fetchUserProfile());
            break;
          case 'user-wishlist':
            store.dispatch(fetchWishlist());
            break;
          case 'products':
            store.dispatch(fetchProducts());
            break;
        }
      }
    }
  }
  
  return result;
};
```

### 6. React Hook for Cache Management

```javascript
// Custom hook for cache management
const useCacheRevalidation = () => {
  const dispatch = useDispatch();
  
  const handleRevalidation = useCallback((type) => {
    switch (type) {
      case 'user-profile':
        dispatch(fetchUserProfile());
        break;
      case 'user-wishlist':
        dispatch(fetchWishlist());
        break;
      case 'products':
        dispatch(fetchProducts());
        break;
      case 'user-bookings':
        dispatch(fetchUserBookings());
        break;
    }
  }, [dispatch]);
  
  const refreshUserCache = useCallback(async () => {
    try {
      await api.post('/cache/refresh/user');
      handleRevalidation('user-profile');
      handleRevalidation('user-wishlist');
      handleRevalidation('user-bookings');
    } catch (error) {
      console.error('Cache refresh failed:', error);
    }
  }, [handleRevalidation]);
  
  return { handleRevalidation, refreshUserCache };
};
```

## Benefits

✅ **Instant Updates**: Changes reflect immediately across all screens
✅ **Automatic Sync**: No manual refresh needed after user actions  
✅ **Optimized Performance**: Cache benefits with real-time consistency
✅ **Smart Invalidation**: Only refreshes what actually changed
✅ **Fallback Support**: Works even if cache fails