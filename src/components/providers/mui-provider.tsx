"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";

const rtlCache = createCache({ key: "radman", stylisPlugins: [rtlPlugin] });

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: "#275d7a", contrastText: "#ffffff" },
    secondary: { main: "#5f8f9d", contrastText: "#ffffff" },
    background: { default: "#f4f8f8", paper: "#ffffff" },
    text: { primary: "#183247", secondary: "#647b89" },
    divider: "#dbe7e8",
    error: { main: "#c73535" }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "var(--font-iran-yekan), Arial, sans-serif",
    button: { fontWeight: 700, textTransform: "none" },
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 }
  },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 44, borderRadius: 12, boxShadow: "0 4px 12px rgba(39, 93, 122, 0.14)", "&:hover": { boxShadow: "0 7px 18px rgba(39, 93, 122, 0.18)" } } } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #dbe7e8", boxShadow: "0 10px 30px rgba(26, 67, 80, 0.07)" } } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: "#ffffff", borderRadius: 12 } } }
  }
});

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
