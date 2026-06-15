import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../services/interfaces';

interface UserState {
  item: User | null;
}

const initialState: UserState = {
  item: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAC: (state, action: PayloadAction<User | null>) => {
      state.item = action.payload;
    },
  },
});

export const { setUserAC } = userSlice.actions;
export default userSlice.reducer;
