"use client";

import { createTheme } from "@mui/material/styles";

const display = "var(--font-fraunces), Georgia, serif";
const body = "var(--font-jakarta), system-ui, -apple-system, sans-serif";
const mono = "var(--font-mono), ui-monospace, SFMono-Regular, monospace";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary:   { main: "#0B3D2E", dark: "#072418", light: "#3E7B4F", contrastText: "#FAF7F0" },
    secondary: { main: "#C8963E", dark: "#9C6E20", light: "#E7C48A", contrastText: "#0E1A14" },
    success:   { main: "#3E7B4F", contrastText: "#FAF7F0" },
    warning:   { main: "#C8963E", contrastText: "#0E1A14" },
    error:     { main: "#8C2F2F", contrastText: "#FAF7F0" },
    background: { default: "#FAF7F0", paper: "#FFFEF9" },
    text: { primary: "#0E1A14", secondary: "#4A5A50" },
    divider: "rgba(14, 26, 20, 0.12)",
  },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 },
    h2: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 },
    h3: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05 },
    h4: { fontFamily: display, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.1 },
    h5: { fontFamily: display, fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontFamily: display, fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: "0.02em" },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    overline: { fontWeight: 700, letterSpacing: "0.14em", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.02em" },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(1200px 600px at 80% -10%, rgba(200,150,62,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(11,61,46,0.08), transparent 60%)",
          backgroundAttachment: "fixed",
        },
        "::selection": { background: "#C8963E", color: "#0E1A14" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          minHeight: 52,
          borderRadius: 999,
          paddingInline: 24,
          fontSize: "0.95rem",
        },
        outlined: {
          borderWidth: 1.5,
          "&:hover": { borderWidth: 1.5 },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            background: "linear-gradient(180deg, #0E4A38 0%, #072418 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.12) inset, 0 8px 24px -12px rgba(7,36,24,0.6)",
            "&:hover": {
              background: "linear-gradient(180deg, #135A44 0%, #0B3D2E 100%)",
            },
          },
        },
      ],
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          minHeight: 52,
          borderRadius: 12,
          borderColor: "rgba(14,26,20,0.14)",
          color: "#0E1A14",
          fontWeight: 600,
          letterSpacing: "0.02em",
          textTransform: "none",
          "&.Mui-selected": {
            backgroundColor: "#0B3D2E",
            color: "#FAF7F0",
            "&:hover": { backgroundColor: "#0E4A38" },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { gap: 8 },
        grouped: {
          borderRadius: "12px !important",
          border: "1px solid rgba(14,26,20,0.14) !important",
          marginLeft: "0 !important",
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 22,
          border: "1px solid rgba(14,26,20,0.08)",
          background:
            "linear-gradient(180deg, #FFFEF9 0%, #FAF6E8 100%)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.9) inset, 0 30px 60px -40px rgba(7,36,24,0.25), 0 8px 20px -14px rgba(7,36,24,0.15)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: "0.04em",
          borderRadius: 999,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(14,26,20,0.12)" },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": { color: "#FAF7F0" },
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0B3D2E", opacity: 1 },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        overline: { display: "inline-block" },
      },
    },
  },
});

export { display, body, mono };
export default theme;
