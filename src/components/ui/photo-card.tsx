'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import { getUnifiedColors } from '@/lib/mui-theme';

interface PhotoCardProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  overlay?: ReactNode;
  href?: string;
  className?: string;
  priority?: boolean;
  sx?: object;
}

export function PhotoCard({
  src,
  alt,
  size = 'medium',
  overlay,
  href,
  className = '',
  priority = false,
  sx,
}: PhotoCardProps) {
  const theme = useTheme();
  const sizeClasses = {
    small: 'col-span-1 aspect-square',
    medium: 'col-span-1 aspect-[3/4]',
    large: 'col-span-2 aspect-square',
    wide: 'col-span-2 aspect-[2/1]',
    tall: 'col-span-1 aspect-[3/4]',
  };

  const CardContent = (
    <Box
      component={motion.div}
      className={cn(
        'relative overflow-hidden rounded-2xl group cursor-pointer',
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      sx={{
        boxShadow: theme.shadows[4],
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
        ...sx,
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Dark overlay that appears on hover */}
        <Box
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          sx={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent, transparent)',
          }}
        />
        
        {/* Content overlay */}
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-white opacity-100 transition-all duration-300">
              {overlay}
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative border that appears on hover */}
      <Box
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        sx={{
          border: `2px solid ${theme.palette.common.white}20`,
        }}
      />
    </Box>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

interface TextCardProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  sx?: object;
}

export function TextCard({ 
  children, 
  size = 'medium', 
  variant = 'primary',
  className = '',
  sx
}: TextCardProps) {
  const theme = useTheme();
  const sizeClasses = {
    small: 'col-span-1 aspect-square',
    medium: 'col-span-1 aspect-[3/4]', 
    large: 'col-span-2 aspect-[2/1]',
  };

  const colors = getUnifiedColors();
  // Use different shades for visual variety while maintaining unified theme
  const variantColors = {
    primary: variant === 'primary' ? colors.primary.main : variant === 'secondary' ? colors.primary.light : colors.primary.lighter,
    light: variant === 'primary' ? colors.primary.light : variant === 'secondary' ? colors.primary.lighter : colors.primary.lightest,
  };

  return (
    <Box
      component={motion.div}
      className={cn(
        'relative rounded-2xl p-6 flex items-center justify-center text-center',
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      sx={{
        background: `linear-gradient(135deg, ${variantColors.primary}10, ${variantColors.light}20)`,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[4],
        '&:hover': {
          boxShadow: theme.shadows[8],
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}