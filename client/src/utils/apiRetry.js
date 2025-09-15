// Retry logic for API calls with exponential backoff
export const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError;
};

// Graceful error handler that doesn't break the UI
export const handleApiError = (error, fallbackValue = null) => {
  if (error.response?.status === 429) {
    // Rate limit error - return fallback silently
    return fallbackValue;
  }
  
  if (error.response?.status >= 500) {
    // Server error - log but don't break UI
    console.warn('Server error, using fallback:', error.message);
    return fallbackValue;
  }
  
  // For other errors, log and return fallback
  console.error('API error:', error);
  return fallbackValue;
};