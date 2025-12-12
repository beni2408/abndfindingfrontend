import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const sendConnectionRequest = createAsyncThunk(
  'connections/sendRequest',
  async (recipient, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/api/connections/request`,
        { recipient },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const respondToRequest = createAsyncThunk(
  'connections/respond',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/api/connections/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchBandmates = createAsyncThunk(
  'connections/fetchBandmates',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/api/connections`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'connections/fetchPending',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/api/connections/pending`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  'connections/fetchSent',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/api/connections/sent`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: {
    bandmates: [],
    pendingRequests: [],
    sentRequests: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendConnectionRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sentRequests.push(action.payload);
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBandmates.fulfilled, (state, action) => {
        state.bandmates = action.payload;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload;
      })
      .addCase(respondToRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status === 'accepted') {
          state.bandmates.push(action.payload);
        }
        state.pendingRequests = state.pendingRequests.filter(
          req => req._id !== action.payload._id
        );
      });
  },
});

export default connectionsSlice.reducer;