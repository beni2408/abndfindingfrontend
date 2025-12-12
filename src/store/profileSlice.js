import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const url = userId ? `${API_URL}/api/profile/${userId}` : `${API_URL}/api/profile`;
      const response = await axios.get(url,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/api/profile`, profileData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    posts: [],
    postsCount: 0,
    bandmatesCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.posts = action.payload.posts;
        state.postsCount = action.payload.postsCount;
        state.bandmatesCount = action.payload.bandmatesCount;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;