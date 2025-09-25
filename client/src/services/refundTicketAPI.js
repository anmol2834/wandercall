import api from './api';

export const refundTicketAPI = {
  createRefundTicket: async (ticketId, upiId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://api.wandercall.com'}/api/refund-ticket/create-refund-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticketId, upiId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Refund ticket creation failed:', error);
      throw { success: false, message: error.message || 'Failed to create refund ticket' };
    }
  }
};