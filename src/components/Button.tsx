'use client';

import { Button, ButtonProps, CircularProgress, Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { getUnifiedColors } from '@/lib/mui-theme';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  weddingVariant?: 'primary' | 'secondary' | 'accent'; // Keep for backward compatibility but all use same colors now
}

export default function CustomButton({
  children,
  loading = false,
  loadingText,
  icon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  weddingVariant: _, // Keep for backward compatibility but ignore
  disabled,
  sx,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  const colors = getUnifiedColors();
  
  // Unified styling using emerald theme colors
  const getUnifiedStyles = () => {
    return {
      backgroundColor: colors.primary.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: colors.primary.dark,
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${colors.primary.main}40`, // 40 = 25% opacity in hex
      },
      '&:disabled': {
        backgroundColor: colors.primary.light,
        color: 'rgba(255, 255, 255, 0.7)',
      },
    };
  };

  return (
    <Button
      disabled={loading || disabled}
      sx={{
        ...getUnifiedStyles(),
        fontWeight: 600,
        borderRadius: '12px',
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          ...getUnifiedStyles()['&:hover'],
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