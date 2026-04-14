"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#1B5E20" },
    secondary: { main: "#FFB300" },
    background: { default: "#F7F9F7" },
  },
  typography: {
    fontFamily: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 48 } },
    },
    MuiToggleButton: {
      styleOverrides: { root: { minHeight: 48 } },
    },
  },
});

export default theme;
