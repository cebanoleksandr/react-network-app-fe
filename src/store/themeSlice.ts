import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';

interface ThemeState {
  mode: PaletteMode;
}

const getInitialMode = (): PaletteMode => {
  const stored = localStorage.getItem('network-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: ThemeState = {
  mode: getInitialMode(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeModeAC: (state, action: PayloadAction<PaletteMode>) => {
      state.mode = action.payload;
      localStorage.setItem('network-theme', action.payload);
    },
    toggleThemeModeAC: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('network-theme', state.mode);
    },
  },
});

export const { setThemeModeAC, toggleThemeModeAC } = themeSlice.actions;
export default themeSlice.reducer;
