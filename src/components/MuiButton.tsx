'use client';

import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import { ReactNode } from 'react';

interface MuiButtonProps extends Omit<ButtonProps, 'color'> {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  weddingVariant?: 'romania' | 'vietnam' | 'accent';
  color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
}

export default function MuiButton({
  children,
  loading = false,
  loadingText,
  icon,
  weddingVariant,
  disabled,
  sx,
  ...props
}: MuiButtonProps) {
  // Wedding-specific styling
  const getWeddingStyles = () => {
    if (!weddingVariant) return {};

    switch (weddingVariant) {
      case 'romania':
        return {
          backgroundColor: '#f43f5e', // Rose-500
          color: 'white',
          '&:hover': {
            backgroundColor: '#e11d48', // Rose-600
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(244, 63, 94, 0.3)',
          },
          '&:disabled': {
            backgroundColor: '#fda4af', // Rose-300
            color: 'rgba(255, 255, 255, 0.7)',
          },
        };
      case 'vietnam':
        return {
          backgroundColor: '#10b981', // Emerald-500
          color: 'white',
          '&:hover': {
            backgroundColor: '#059669', // Emerald-600
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
          },
          '&:disabled': {
            backgroundColor: '#6ee7b7', // Emerald-300
            color: 'rgba(255, 255, 255, 0.7)',
          },
        };
      case 'accent':
        return {
          backgroundColor: '#ec4899', // Pink-500
          color: 'white',
          '&:hover': {
            backgroundColor: '#db2777', // Pink-600
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
          },
          '&:disabled': {
            backgroundColor: '#f9a8d4', // Pink-300
            color: 'rgba(255, 255, 255, 0.7)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      disabled={loading || disabled}
      sx={{
        ...getWeddingStyles(),
        fontWeight: 600,
        borderRadius: '12px',
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          ...getWeddingStyles()['&:hover'],
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {loading ? (
          <>
            <CircularProgress size={16} color="inherit" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </Box>
    </Button>
  );
}