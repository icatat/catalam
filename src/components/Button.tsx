'use client';

import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import { ReactNode } from 'react';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  weddingVariant?: 'primary' | 'secondary' | 'accent';
}

export default function CustomButton({
  children,
  loading = false,
  loadingText,
  icon,
  weddingVariant = 'primary',
  variant,
  disabled,
  sx,
  ...props
}: CustomButtonProps) {
  const muiVariant =
    variant ??
    (weddingVariant === 'secondary'
      ? 'outlined'
      : weddingVariant === 'accent'
        ? 'text'
        : 'contained');

  return (
    <Button
      variant={muiVariant}
      disabled={loading || disabled}
      sx={sx}
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
