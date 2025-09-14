import api from './api';

export const refundTicketAPI = {
  createRefundTicket: async (ticketId, upiId) => {
    try {
      const response = await api.post('/refund-ticket/create-refund-ticket', {
        ticketId,
        upiId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create refund ticket' };
    }
  }
};