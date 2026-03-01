"use client"

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material"
import { type ReactNode } from "react"

const theme = createTheme({
  palette: {
    primary: {
      main: "#B5436E",
      light: "#D4729A",
      dark: "#8C2A52",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FDF2F4",
      light: "#FFF7F8",
      dark: "#F5E1E5",
      contrastText: "#3D1A26",
    },
    success: {
      main: "#2D8B6F",
      light: "#5BB898",
      dark: "#1E6B53",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D4915E",
      light: "#E8B992",
      dark: "#B87340",
      contrastText: "#3D1A26",
    },
    error: {
      main: "#C93545",
      light: "#E36B77",
      dark: "#A12636",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FDF8F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D1520",
      secondary: "#7A6069",
    },
  },
  typography: {
    fontFamily: "'Geist', 'Geist Fallback', system-ui, sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
        },
        containedPrimary: {
          boxShadow: "0 2px 8px rgba(181, 67, 110, 0.25)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(181, 67, 110, 0.35)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          border: "1px solid #F5E1E5",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 68,
          borderTop: "1px solid #F5E1E5",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          padding: "6px 0",
          "&.Mui-selected": {
            color: "#B5436E",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 14px rgba(181, 67, 110, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          margin: 16,
          width: "calc(100% - 32px)",
          maxWidth: 400,
        },
      },
    },
  },
})

export default function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
