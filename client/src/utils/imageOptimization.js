// Image optimization utilities

export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl) return null;
  
  const {
    width,
    height,
    quality = 80,
    format = 'auto'
  } = options;
  
  // If it's already an optimized URL, return as is
  if (originalUrl.includes('?')) return originalUrl;
  
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality !== 80) params.append('q', quality);
  if (format !== 'auto') params.append('f', format);
  
  const queryString = params.toString();
  return queryString ? `${originalUrl}?${queryString}` : originalUrl;
};

export const getResponsiveImageSrcSet = (baseUrl, sizes = [400, 800, 1200, 1600]) => {
  if (!baseUrl) return '';
  
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (urls) => {
  const promises = urls.filter(Boolean).map(preloadImage);
  try {
    return await Promise.allSettled(promises);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
    return [];
  }
};

// Check if WebP is supported
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Convert image URL to WebP if supported
export const getWebPUrl = (originalUrl) => {
  if (!originalUrl || !supportsWebP()) return originalUrl;
  
  // Simple conversion for common formats
  if (originalUrl.match(/\.(jpg|jpeg|png)$/i)) {
    return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return originalUrl;
};