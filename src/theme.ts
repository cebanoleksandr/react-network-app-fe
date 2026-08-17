import { createTheme, type PaletteMode } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
      },
      ...(mode === 'light'
        ? {
            background: {
              default: '#EDEEF0',
              paper: '#ffffff',
            },
          }
        : {
            background: {
              default: '#0f1115',
              paper: '#1a1d23',
            },
          }),
    },
  });
