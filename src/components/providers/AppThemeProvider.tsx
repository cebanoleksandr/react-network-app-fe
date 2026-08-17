import { useMemo, type ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { getTheme } from "../../theme";

interface IProps {
  children: ReactNode;
}

const AppThemeProvider = ({ children }: IProps) => {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
