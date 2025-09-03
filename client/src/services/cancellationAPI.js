const API_URL = import.meta.env.VITE_API_URL || 'https://api.wandercall.com';

export const cancellationAPI = {
  // Cancel booking within 48 hours
  cancelBooking: async (ticketId) => {
    const response = await fetch(`${API_URL}/api/cancellation/cancel/${ticketId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // Check if cancellation is allowed
  checkCancellationEligibility: async (ticketId) => {
    const response = await fetch(`${API_URL}/api/cancellation/check/${ticketId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};