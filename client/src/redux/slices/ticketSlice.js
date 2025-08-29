import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketAPI } from '../../services/api';

// Async thunks
export const fetchMyBookings = createAsyncThunk(
  'tickets/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketAPI.getMyBookings();
      return response.data.tickets;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await ticketAPI.getTicket(ticketId);
      return response.data.ticket;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket');
    }
  }
);

export const markTicketAsDownloaded = createAsyncThunk(
  'tickets/markAsDownloaded',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await ticketAPI.markAsDownloaded(ticketId);
      return response.data.ticket;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as downloaded');
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