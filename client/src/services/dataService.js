class DataService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.abortControllers = new Map();
    this.cacheExpiry = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  isCacheValid(key) {
    const expiry = this.cacheExpiry.get(key);
    return this.cache.has(key) && (!expiry || Date.now() < expiry);
  }

  getFromCache(key) {
    return this.cache.get(key);
  }

  setCache(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  clearCache(key) {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  // Prevent request cancellation with proper abort handling
  async fetchData(key, fetchFn, options = {}) {
    const { ttl = this.defaultTTL, forceRefresh = false } = options;

    if (!forceRefresh && this.isCacheValid(key)) {
      return this.getFromCache(key);
    }

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create abort controller for this request
    const abortController = new AbortController();
    this.abortControllers.set(key, abortController);

    const request = fetchFn(abortController.signal)
      .then(data => {
        this.setCache(key, data, ttl);
        this.cleanup(key);
        return data;
      })
      .catch(error => {
        this.cleanup(key);
        if (error.name === 'AbortError') {
          throw new Error('Request was cancelled');
        }
        throw error;
      });

    this.pendingRequests.set(key, request);
    return request;
  }

  cleanup(key) {
    this.pendingRequests.delete(key);
    this.abortControllers.delete(key);
  }

  // Optimistic updates for real-time sync
  optimisticUpdate(key, updateFn) {
    const currentData = this.getFromCache(key);
    if (currentData) {
      const updatedData = updateFn(currentData);
      this.setCache(key, updatedData);
      return updatedData;
    }
    return currentData;
  }

  // Cancel specific request
  cancelRequest(key) {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.cleanup(key);
    }
  }
}

export const dataService = new DataService();