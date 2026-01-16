'use client';

import { Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  animationDelay?: number;
}

export function NavigationButton({
  href,
  children,
  animationDelay = 0,
}: NavigationButtonProps) {
  const theme = useTheme();

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Button
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        size="small"
        sx={{
          color: theme.palette.primary.main,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 1.5,
          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
          fontWeight: 500,
          backdropFilter: 'blur(15px)',
          textTransform: 'none',
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.5, sm: 0.75 },
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            boxShadow: theme.shadows[4],
          }
        }}
      >
        {children}
      </Button>
    </Link>
  );
}