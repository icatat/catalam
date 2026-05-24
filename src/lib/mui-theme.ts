import { createTheme } from '@mui/material/styles';

// Font roles:
//   display  = Arizonia (script) — hero titles, day banners only, 2.5rem+
//   serif    = Cormorant Garamond — section headings (h2/h3), pull quotes
//   sans     = Thasadith — body, UI, small headings (h4/h5/h6), buttons
const FONT_DISPLAY = '"Arizonia", "Brush Script MT", cursive';
const FONT_SERIF = '"Cormorant Garamond", "Cormorant", "Garamond", serif';
const FONT_SANS = '"Thasadith", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    ornament: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    ornament?: PaletteOptions['primary'];
  }
  interface TypographyVariants {
    display: React.CSSProperties;
    overline: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    display?: React.CSSProperties;
    overline?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
  }
}

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#81b8d2',
      light: '#d6ecf4',
      dark: '#20485b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4a6a78',
      light: '#7a96a3',
      dark: '#2e4854',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#b88880',
      light: '#d9b9b2',
      dark: '#8e645d',
      contrastText: '#ffffff',
    },
    ornament: {
      main: '#a8916b',
      light: '#d8c8a8',
      dark: '#7d6a4f',
      contrastText: '#ffffff',
    },
    error: {
      main: '#b8615e',
    },
    warning: {
      main: '#b8956b',
    },
    info: {
      main: '#5a7a96',
    },
    success: {
      main: '#5a8a6e',
    },
    background: {
      default: '#faf3f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4a6a78',
      disabled: '#9ca3af',
    },
    divider: 'rgba(32, 72, 91, 0.12)',
  },
  typography: {
    fontFamily: FONT_SANS,
    display: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 400,
      fontSize: '4rem',
      lineHeight: 1.1,
      letterSpacing: '0.005em',
    },
    h1: {
      fontFamily: FONT_SERIF,
      fontSize: '3rem',
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: '-0.005em',
    },
    h2: {
      fontFamily: FONT_SERIF,
      fontSize: '2.25rem',
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '-0.003em',
    },
    h3: {
      fontFamily: FONT_SERIF,
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.25,
    },
    h4: {
      fontFamily: FONT_SANS,
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.35,
      letterSpacing: '0.005em',
    },
    h5: {
      fontFamily: FONT_SANS,
      fontSize: '1.0625rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: FONT_SANS,
      fontSize: '0.9375rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: FONT_SANS,
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    },
    body1: {
      fontFamily: FONT_SANS,
      fontSize: '1.0625rem',
      lineHeight: 1.65,
    },
    body2: {
      fontFamily: FONT_SANS,
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: FONT_SANS,
      fontWeight: 700,
      letterSpacing: '0.04em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: FONT_SANS,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.9375rem',
          letterSpacing: '0.04em',
          borderRadius: '6px',
          padding: '12px 28px',
          boxShadow: 'none',
          transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.15s ease',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#b88880',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#8e645d',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#20485b',
          borderWidth: '1.5px',
          color: '#20485b',
          '&:hover': {
            backgroundColor: 'rgba(32, 72, 91, 0.06)',
            borderColor: '#20485b',
            borderWidth: '1.5px',
          },
        },
        text: {
          color: '#b88880',
          '&:hover': {
            backgroundColor: 'rgba(184, 136, 128, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid rgba(32, 72, 91, 0.08)',
          boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 8px 24px -12px rgba(32, 72, 91, 0.12)',
          backgroundImage: 'none',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            fontSize: '1rem',
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(32, 72, 91, 0.18)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(32, 72, 91, 0.35)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b88880',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.95rem',
            '&.Mui-focused': {
              color: '#b88880',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontSize: '1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#b88880',
          textDecorationColor: 'rgba(184, 136, 128, 0.4)',
          textUnderlineOffset: '3px',
          transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
          '&:hover': {
            color: '#8e645d',
            textDecorationColor: '#8e645d',
          },
        },
      },
    },
  },
});

// Legacy color palette — preserved so existing pages keep working.
// Prefer reading from `theme.palette.*` for new code.
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
    light: '#4baab1',
    lighter: '#89dbe1',
    lightest: '#aef0f4',
    dark: '#195a5e',
    darker: '#0a393d',
    surface: '#063538',
  },
  neutral: {
    white: '#ffffff',
    light: '#c6dcf3',
    medium: '#64748b',
    dark: '#2d3542',
  },
  accent: {
    main: '#b88880',
    light: '#d9b9b2',
    soft: '#f0e0db',
    dark: '#8e645d',
  },
  ornament: {
    main: '#a8916b',
    light: '#d8c8a8',
    soft: '#ede4d2',
    dark: '#7d6a4f',
  },
  ink: {
    deep: '#20485b',
    mid: '#4a6a78',
    soft: '#7a96a3',
  },
} as const;

export const getWeddingVariant = () => ({
  primary: weddingColors.primary.main,
  light: weddingColors.primary.light,
  dark: weddingColors.primary.dark,
  hover: weddingColors.primary.darker,
});

export const getUnifiedColors = () => weddingColors;
