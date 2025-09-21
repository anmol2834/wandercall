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
    try {
      const response = await fetch(`${API_URL}/api/cancellation/check/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Cancellation check failed:', error);
      // Return default response to prevent UI errors
      return { success: false, canCancel: false, hoursLeft: 0 };
    }
  }
};