import { createTheme } from '@mui/material/styles';

// Create a custom MUI theme matching the wedding aesthetic
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#c2e1ee', 
      light: '#d6ecf4', 
      dark: '#9dc4d7', 
      contrastText: '#2c3e50',
    },
    secondary: {
      main: '#6b7280', // Gray-500 - Secondary theme color
      light: '#9ca3af', // Gray-400
      dark: '#374151', // Gray-700
      contrastText: '#ffffff',
    },
    error: {
      main: '#d27f7f', // Red-500
    },
    warning: {
      main: '#cfb68b', // Amber-500
    },
    info: {
      main: '#617ba4', // Blue-500
    },
    success: {
      main: '#145870', 
      light: '#7ebfd6', 
      dark: '#0c3443', 
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // Gray-800
      secondary: '#6b7280', // Gray-500
      disabled: '#9ca3af', // Gray-400
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

// Unified wedding color scheme - elegant emerald and gray
export const weddingColors = {
  primary: {
    main: '#c2e1ee', 
    light: '#d1e8f3', 
    lighter: '#e0f0f7',
    lightest: '#f0f7fb',
    dark: '#a8d4e6',
    darker: '#8ec7de',
    surface: '#b5dde9', 
  },
  secondary: {
    main: '#2f8a90', 
    light: '#4baab1', // Gray-400
    lighter: '#89dbe1', // Gray-300
    lightest: '#aef0f4', // Gray-200
    dark: '#195a5e', // Gray-700
    darker: '#0a393d', // Gray-800
    surface: '#063538', // Gray-50
  },
  neutral: {
    white: '#ffffff',
    light: '#c6dcf3', // Slate-50
    medium: '#64748b', // Slate-500
    dark: '#2d3542', // Slate-700
  },
};

// Helper function to get wedding colors - now returns unified theme
export const getWeddingVariant = () => {
  // Always return the same unified theme
  return {
    primary: weddingColors.primary.main,
    light: weddingColors.primary.light,
    dark: weddingColors.primary.dark,
    hover: weddingColors.primary.darker,
  };
};

// Direct access to the unified color palette
export const getUnifiedColors = () => weddingColors;