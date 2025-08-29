import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: (data) => api.post('/auth/send-otp', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const waitlistAPI = {
  join: (data) => api.post('/waitlist/join', data),
  joinAuthenticated: (data) => api.post('/waitlist/join-authenticated', data),
  checkStatus: (email) => api.get(`/waitlist/status${email ? `?email=${email}` : ''}`),
  checkStatusAuthenticated: () => api.get('/waitlist/status-authenticated'),
};

export const rewardsAPI = {
  getUserRewards: (userId) => api.get(`/rewards/user/${userId}`),
  redeemReward: (data) => api.post('/rewards/redeem', data),
  earnXP: (data) => api.post('/rewards/earn-xp', data),
  getXPHistory: (userId) => api.get(`/rewards/history/${userId}`),
};

export const addressAPI = {
  getUserAddresses: () => api.get('/addresses'),
  addAddress: (data) => api.post('/addresses', data),
  updateAddress: (addressId, data) => api.put(`/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.patch(`/addresses/${addressId}/default`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  sendEmailOTP: () => api.post('/users/send-email-otp'),
  updatePassword: (currentPassword, newPassword) => api.put('/users/update-password', { currentPassword, newPassword }),
  updatePasswordWithEmail: (emailOtp, newPassword) => api.put('/users/update-password-email', { emailOtp, newPassword }),
};

export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getProductById: (productId) => api.get(`/products/${productId}`),
  searchProducts: (params) => api.get('/products/search', { params }),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkWishlistStatus: (productId) => api.get(`/wishlist/check/${productId}`),
};

export const ticketAPI = {
  getMyBookings: () => api.get('/tickets/my-bookings'),
  getTicket: (ticketId) => api.get(`/tickets/${ticketId}`),
  markAsDownloaded: (ticketId) => api.patch(`/tickets/${ticketId}/download`),
};

export const paymentAPI = {
  createPaymentSession: (data) => api.post('/create-payment-session', data),
  verifyPayment: (data) => api.post('/verify-payment', data),
  createBooking: (data) => api.post('/checkout', data),
};

export default api;