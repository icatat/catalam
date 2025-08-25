import { createTheme } from '@mui/material/styles';

// Create a custom MUI theme matching the wedding aesthetic
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#f43f5e', // Rose-500 - Romania theme
      light: '#fb7185', // Rose-400
      dark: '#e11d48', // Rose-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Emerald-500 - Vietnam theme
      light: '#34d399', // Emerald-400
      dark: '#059669', // Emerald-600
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Red-500
    },
    warning: {
      main: '#f59e0b', // Amber-500
    },
    info: {
      main: '#3b82f6', // Blue-500
    },
    success: {
      main: '#10b981', // Emerald-500
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // Gray-800
      secondary: '#6b7280', // Gray-500
    },
  },
  typography: {
    fontFamily: '"Thasadith", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners matching current design
  },
  components: {
    // Customize MUI components
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          fontWeight: 600,
          borderRadius: '12px',
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default MUI gradient
        },
      },
    },
  },
});

// Wedding-specific color variants
export const weddingColors = {
  romania: {
    primary: '#f43f5e', // Rose-500
    light: '#fdf2f8', // Rose-50
    dark: '#e11d48', // Rose-600
    hover: '#fb7185', // Rose-400
  },
  vietnam: {
    primary: '#10b981', // Emerald-500
    light: '#f0fdf4', // Emerald-50
    dark: '#059669', // Emerald-600
    hover: '#34d399', // Emerald-400
  },
  accent: {
    primary: '#ec4899', // Pink-500
    light: '#fdf2f8', // Pink-50
    dark: '#db2777', // Pink-600
    hover: '#f472b6', // Pink-400
  },
  neutral: {
    primary: '#64748b', // Slate-500
    light: '#f8fafc', // Slate-50
    dark: '#334155', // Slate-700
    hover: '#94a3b8', // Slate-400
  },
};

// Helper function to get wedding variant colors from theme
export const getWeddingVariant = (variant: 'romania' | 'vietnam' | 'accent' | 'neutral' = 'romania') => {
  return weddingColors[variant];
};