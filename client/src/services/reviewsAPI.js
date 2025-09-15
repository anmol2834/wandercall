import api from './api';

export const reviewsAPI = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  addReview: (productId, reviewData) => api.post(`/reviews/${productId}`, reviewData)
};

export default reviewsAPI;