'use client';

import { Button, ButtonProps, CircularProgress, Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { getWeddingVariant } from '@/lib/mui-theme';

interface CustomButtonProps extends Omit<ButtonProps, 'color'> {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  weddingVariant?: 'romania' | 'vietnam' | 'accent';
  color?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';
}

export default function CustomButton({
  children,
  loading = false,
  loadingText,
  icon,
  weddingVariant,
  disabled,
  sx,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  
  // Wedding-specific styling using theme colors
  const getWeddingStyles = () => {
    if (!weddingVariant) return {};

    const colors = getWeddingVariant(weddingVariant);
    
    return {
      backgroundColor: colors.primary,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: colors.dark,
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${colors.primary}40`, // 40 = 25% opacity in hex
      },
      '&:disabled': {
        backgroundColor: colors.hover,
        color: 'rgba(255, 255, 255, 0.7)',
      },
    };
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