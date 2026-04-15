"use client";

import { createTheme } from "@mui/material/styles";

const sf =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", system-ui, sans-serif';
const sfRounded =
  '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", system-ui, sans-serif';
const sfMono =
  '"SF Mono", ui-monospace, "Menlo", Monaco, "Cascadia Mono", monospace';

const tint = "#1E6E4F";
const tintDark = "#0E4A33";
const tintLight = "#2E9E6B";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: tint, dark: tintDark, light: tintLight, contrastText: "#FFFFFF" },
    secondary: { main: "#007AFF", contrastText: "#FFFFFF" },
    success: { main: "#34C759", contrastText: "#FFFFFF" },
    warning: { main: "#FF9500", contrastText: "#FFFFFF" },
    error: { main: "#FF3B30", contrastText: "#FFFFFF" },
    info: { main: "#007AFF", contrastText: "#FFFFFF" },
    background: { default: "#F2F2F7", paper: "#FFFFFF" },
    text: {
      primary: "#000000",
      secondary: "rgba(60,60,67,0.60)",
      disabled: "rgba(60,60,67,0.30)",
    },
    divider: "rgba(60,60,67,0.18)",
    grey: {
      50: "#F2F2F7",
      100: "#E5E5EA",
      200: "#D1D1D6",
      300: "#C7C7CC",
      400: "#AEAEB2",
      500: "#8E8E93",
      600: "#636366",
      700: "#48484A",
      800: "#3A3A3C",
      900: "#1C1C1E",
    },
  },
  typography: {
    fontFamily: sf,
    h1: { fontFamily: sf, fontWeight: 700, fontSize: "2.125rem", letterSpacing: "-0.022em", lineHeight: 1.12 },
    h2: { fontFamily: sf, fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.02em", lineHeight: 1.18 },
    h3: { fontFamily: sf, fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.018em", lineHeight: 1.22 },
    h4: { fontFamily: sf, fontWeight: 600, fontSize: "1.25rem", letterSpacing: "-0.012em", lineHeight: 1.28 },
    h5: { fontFamily: sf, fontWeight: 600, fontSize: "1.0625rem", letterSpacing: "-0.008em" },
    h6: { fontFamily: sf, fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.004em" },
    subtitle1: { fontWeight: 600, fontSize: "1.0625rem", letterSpacing: "-0.004em" },
    subtitle2: { fontWeight: 600, fontSize: "0.9375rem", letterSpacing: 0 },
    body1: { fontWeight: 400, fontSize: "1.0625rem", letterSpacing: "-0.004em", lineHeight: 1.35 },
    body2: { fontWeight: 400, fontSize: "0.9375rem", letterSpacing: 0, lineHeight: 1.38 },
    caption: { fontWeight: 400, fontSize: "0.75rem", letterSpacing: 0 },
    overline: {
      fontWeight: 600,
      fontSize: "0.75rem",
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      lineHeight: 1.3,
    },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "-0.004em", fontSize: "1.0625rem" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F2F2F7",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        "::selection": { background: "rgba(30,110,79,0.22)" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          minHeight: 50,
          borderRadius: 14,
          paddingInline: 22,
          fontSize: "1.0625rem",
          fontWeight: 600,
          letterSpacing: "-0.004em",
        },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
          "&:active": { transform: "scale(0.985)" },
        },
        outlined: {
          borderWidth: 1,
          borderColor: "rgba(60,60,67,0.18)",
          color: "#000",
          backgroundColor: "#FFFFFF",
          "&:hover": { borderWidth: 1, backgroundColor: "rgba(60,60,67,0.04)" },
        },
        text: {
          color: tint,
        },
        sizeLarge: { minHeight: 52, fontSize: "1.0625rem" },
        sizeSmall: { minHeight: 36, fontSize: "0.9375rem", paddingInline: 14 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          minHeight: 34,
          borderRadius: 8,
          border: "none",
          color: "rgba(60,60,67,0.75)",
          fontWeight: 600,
          fontSize: "0.9375rem",
          letterSpacing: "-0.004em",
          textTransform: "none",
          backgroundColor: "transparent",
          transition: "background-color 120ms ease, color 120ms ease, box-shadow 120ms ease",
          "&.Mui-selected": {
            backgroundColor: "#FFFFFF",
            color: "#000",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
            "&:hover": { backgroundColor: "#FFFFFF" },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "#E9E9EB",
          borderRadius: 9,
          padding: 2,
          gap: 0,
          width: "100%",
        },
        grouped: {
          borderRadius: "7px !important",
          border: "none !important",
          margin: "0 !important",
          flex: 1,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "none",
          backgroundColor: "#FFFFFF",
          boxShadow: "none",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": { paddingBottom: 16 },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(60,60,67,0.18)" },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 51,
          height: 31,
          padding: 0,
          overflow: "visible",
        },
        switchBase: {
          padding: 2,
          "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#FFFFFF",
            "& + .MuiSwitch-track": {
              backgroundColor: "#34C759",
              opacity: 1,
              border: 0,
            },
          },
        },
        thumb: {
          width: 27,
          height: 27,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15), 0 3px 1px rgba(0,0,0,0.06)",
        },
        track: {
          borderRadius: 31 / 2,
          backgroundColor: "#E9E9EA",
          opacity: 1,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:active": { transform: "scale(0.95)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.8125rem",
          borderRadius: 999,
          height: 26,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: "0.9375rem",
        },
      },
    },
  },
});

export { sf, sfRounded, sfMono };
export default theme;
