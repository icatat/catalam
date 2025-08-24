'use client';

import { createContext, useContext } from 'react';

// Theme tokens
export const theme = {
  colors: {
    primary: {
      50: 'rose-50',
      100: 'rose-100',
      500: 'rose-500',
      600: 'rose-600',
      900: 'rose-900',
    },
    secondary: {
      50: 'emerald-50',
      100: 'emerald-100',
      500: 'emerald-500',
      600: 'emerald-600',
      900: 'emerald-900',
    },
    accent: {
      50: 'pink-50',
      100: 'pink-100',
      500: 'pink-500',
      600: 'pink-600',
    },
    neutral: {
      50: 'slate-50',
      100: 'slate-100',
      200: 'slate-200',
      300: 'slate-300',
      600: 'slate-600',
      700: 'slate-700',
      800: 'slate-800',
      900: 'slate-900',
    },
    white: 'white',
    transparent: 'transparent',
  },
  gradients: {
    primary: 'from-rose-50 via-white to-pink-50',
    primaryCard: 'from-rose-50 to-rose-100',
    secondary: 'from-emerald-50 to-emerald-100',
    accent: 'from-pink-50 to-pink-100',
    neutral: 'from-slate-50 to-slate-100',
    overlay: 'from-black/50 via-transparent to-black/20',
    hero: 'from-rose-50 via-white to-pink-50',
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    glow: 'shadow-glow',
    glowLg: 'shadow-glow-lg',
  },
  spacing: {
    xs: '0.5rem', // 2
    sm: '1rem',   // 4
    md: '1.5rem', // 6
    lg: '2rem',   // 8
    xl: '3rem',   // 12
    '2xl': '4rem', // 16
    '3xl': '6rem', // 24
  },
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
  typography: {
    heading: {
      h1: 'text-6xl md:text-8xl lg:text-9xl font-serif',
      h2: 'text-4xl md:text-5xl font-serif',
      h3: 'text-2xl md:text-3xl font-serif',
      h4: 'text-xl md:text-2xl font-body font-semibold',
      h5: 'text-lg font-body font-semibold',
    },
    body: {
      large: 'text-xl md:text-2xl font-body',
      base: 'text-base font-body',
      small: 'text-sm font-body',
      xs: 'text-xs font-body',
    },
    colors: {
      primary: 'text-slate-800',
      secondary: 'text-slate-600',
      muted: 'text-slate-500',
      white: 'text-white',
      accent: 'text-rose-600',
    }
  },
  components: {
    card: {
      base: 'bg-white rounded-xl shadow-lg p-6',
      hero: 'bg-white/90 rounded-lg p-6 shadow-lg',
      gradient: 'bg-gradient-to-br rounded-xl shadow-lg p-8',
    },
    button: {
      primary: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white',
      secondary: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white',
      outline: 'border border-white/20 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:border-white/40',
      ghost: 'hover:bg-white/10 text-white',
    },
    input: {
      base: 'w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all',
      label: 'block text-slate-700 font-medium mb-2',
    },
    section: {
      base: 'py-16',
      hero: 'relative h-screen overflow-hidden',
      content: 'max-w-4xl mx-auto px-4',
    }
  }
} as const;

// Theme context
const ThemeContext = createContext(theme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility functions for theme usage
export const getThemeClass = (path: string, fallback = '') => {
  const keys = path.split('.');
  let value: unknown = theme;
  
  for (const key of keys) {
    value = (value as Record<string, unknown>)?.[key];
    if (value === undefined) return fallback;
  }
  
  return typeof value === 'string' ? value : fallback;
};

// Pre-built component class generators
export const themeClasses = {
  // Background patterns
  gradientBg: (variant: 'primary' | 'secondary' | 'accent' | 'neutral' | 'hero' = 'primary') => 
    `bg-gradient-to-br ${theme.gradients[variant]}`,
  
  cardBg: (variant: 'primary' | 'secondary' | 'accent' | 'neutral' = 'primary') =>
    `bg-gradient-to-br ${theme.gradients[`${variant}Card` as keyof typeof theme.gradients] || theme.gradients.primaryCard} ${theme.borderRadius.md} ${theme.shadows.lg} p-8`,
    
  // Typography combinations
  heading: (level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5', color: 'primary' | 'secondary' | 'white' | 'accent' = 'primary') =>
    `${theme.typography.heading[level]} ${theme.typography.colors[color]}`,
    
  body: (size: 'large' | 'base' | 'small' | 'xs' = 'base', color: 'primary' | 'secondary' | 'muted' | 'white' = 'primary') =>
    `${theme.typography.body[size]} ${theme.typography.colors[color]}`,
    
  // Interactive elements
  button: (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-9 px-4 py-2 text-sm',
      md: 'h-12 px-6 py-3',
      lg: 'h-14 px-8 py-4 text-base'
    };
    return `${theme.components.button[variant]} ${sizeClasses[size]} ${theme.borderRadius.md} ${theme.shadows.lg} font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2`;
  },
  
  input: () => theme.components.input.base,
  inputLabel: () => theme.components.input.label,
  
  // Layout
  section: (variant: 'base' | 'hero' = 'base') => theme.components.section[variant],
  container: () => theme.components.section.content,
  
  // Cards
  card: (variant: 'base' | 'hero' | 'gradient' = 'base') => theme.components.card[variant],
};