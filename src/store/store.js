import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import usersSlice from './usersSlice';
import messagesSlice from './messagesSlice';
import connectionsSlice from './connectionsSlice';
import postsSlice from './postsSlice';
import profileSlice from './profileSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    messages: messagesSlice,
    connections: connectionsSlice,
    posts: postsSlice,
    profile: profileSlice,
  },
});

export default store;