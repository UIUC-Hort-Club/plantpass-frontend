import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2D6A4F", // Deep forest green
      light: "#52B788",
      dark: "#1B4332",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F77F00", // Warm orange accent
      light: "#FCBF49",
      dark: "#D62828",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8F9FA",
      paper: "#FFFFFF",
    },
    success: {
      main: "#52B788",
      light: "#95D5B2",
    },
    text: {
      primary: "#212529",
      secondary: "#6C757D",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  // @ts-expect-error - MUI shadows type mismatch, will be fixed in refinement phase
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    ...Array(18).fill('0px 24px 48px rgba(0,0,0,0.18)'),
  ],
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 14px',
          fontSize: '0.875rem',
          lineHeight: 1.43,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 3px 10px rgba(45, 106, 79, 0.22)',
          },
        },
        sizeSmall: {
          padding: '3px 8px',
          fontSize: '0.8125rem',
          lineHeight: 1.43,
          borderRadius: 7,
        },
        sizeLarge: {
          padding: '9px 20px',
          fontSize: '0.9375rem',
          lineHeight: 1.43,
          borderRadius: 9,
        },
        containedPrimary: {
          color: '#FFFFFF',
          background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        sizeSmall: {
          padding: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': {
              borderColor: '#52B788',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2D6A4F',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
