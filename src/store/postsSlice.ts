import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../services/interfaces';

interface PostsState {
  items: Post[];
}

const initialState: PostsState = {
  items: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsAC: (state, action: PayloadAction<Post[]>) => {
      state.items = action.payload;
    },
    toggleSavePostAC: (state, action: PayloadAction<string>) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            isBookmarked: !item.isBookmarked,
          }
        }
        return item;
      })
    },
    deletePostAC: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updatePostAC: (state, action: PayloadAction<Post>) => {
      state.items = state.items.map(post => {
        if (post.id === action.payload.id) {
          return action.payload;
        }
        return post;
      })
    }
  },
});

export const { setPostsAC, toggleSavePostAC, deletePostAC, updatePostAC } = postsSlice.actions;
export default postsSlice.reducer;
