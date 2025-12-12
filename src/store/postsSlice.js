import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/api/posts`, postData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/api/posts/feed`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/like',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/api/posts/${postId}/like`, {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, text }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/api/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const editPost = createAsyncThunk(
  'posts/edit',
  async ({ postId, content, image }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/api/posts/${postId}`,
        { content, image },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/api/posts/${postId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.isLoading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.likes = Array(action.payload.likesCount).fill(null);
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.comments.push(action.payload.comment);
        }
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
      });
  },
});

export default postsSlice.reducer;