import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketAPI } from '../../services/api';

// Async thunks
export const fetchMyBookings = createAsyncThunk(
  'tickets/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId, { rejectWithValue, getState }) => {
    try {
      // Get ticket from existing bookings data instead of API call
      const state = getState();
      const ticket = state.tickets.bookings.find(booking => 
        booking._id === ticketId || booking.ticketId === ticketId
      );
      
      if (ticket) {
        return ticket;
      } else {
        throw new Error('Ticket not found');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ticket');
    }
  }
);

export const markTicketAsDownloaded = createAsyncThunk(
  'tickets/markAsDownloaded',
  async (ticketId, { rejectWithValue }) => {
    try {
      // For now, just return the ticketId since we're using single fetch
      return { _id: ticketId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark as downloaded');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    bookings: [],
    selectedTicket: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch ticket by ID
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as downloaded
      .addCase(markTicketAsDownloaded.fulfilled, (state, action) => {
        const ticketId = action.payload._id;
        const bookingIndex = state.bookings.findIndex(booking => booking._id === ticketId);
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex] = action.payload;
        }
        if (state.selectedTicket?._id === ticketId) {
          state.selectedTicket = action.payload;
        }
      });
  },
});

export const { clearError, clearSelectedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;