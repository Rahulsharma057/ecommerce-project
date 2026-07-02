"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "@/theme/theme";
import ReduxProvider from "@/redux/ReduxProvider";

export default function Providers({ children }) {
  
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}