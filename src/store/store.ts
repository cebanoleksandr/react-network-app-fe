import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import postsSlice from './postsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postsSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
