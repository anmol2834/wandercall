import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentAPI } from '../../services/api';

// Async thunks
export const createPaymentSession = createAsyncThunk(
  'checkout/createPaymentSession',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createPaymentSession(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment session');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'checkout/verifyPayment',
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.verifyPayment(verificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const createBooking = createAsyncThunk(
  'checkout/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    bookingData: null,
    paymentSession: null,
    createdTicket: null,
    loading: false,
    error: null,
    paymentStatus: null,
  },
  reducers: {
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    },
    clearBookingData: (state) => {
      state.bookingData = null;
      state.paymentSession = null;
      state.createdTicket = null;
      state.paymentStatus = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment session
      .addCase(createPaymentSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentSession.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSession = action.payload;
      })
      .addCase(createPaymentSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload.status;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTicket = action.payload.ticket;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBookingData, clearBookingData, clearError, setPaymentStatus } = checkoutSlice.actions;
export default checkoutSlice.reducer;