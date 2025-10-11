'use client';

import { motion } from 'framer-motion';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface MainPageCardProps {
  // Grid positioning
  gridColumnStart?: number;
  gridColumnEnd?: number;
  gridRowStart?: number;
  gridRowEnd?: number;
  
  // Optional sizing (will maintain proportions)
  width?: number;
  height?: number;
  
  // Image card props
  imageSrc?: string;
  alt?: string;
  aspectRatio?: string; // e.g., '16/9', '4/3', '1/1'
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
  
  // Color card props
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  
  // Navigation
  href?: string;
  onClick?: () => void;
  
  // Animation
  animationDelay?: number;
  
  // Style overrides
  className?: string;
  sx?: Record<string, unknown>;
}

export function MainPageCard({
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  width,
  height,
  imageSrc,
  alt = 'Wedding Photo',
  aspectRatio,
  objectFit = 'contain',
  backgroundColor,
  title,
  subtitle,
  href,
  onClick,
  animationDelay = 0,
  className,
  sx,
}: MainPageCardProps) {
  const theme = useTheme();
  
  const isColorCard = !imageSrc && backgroundColor;
  const isClickable = href || onClick;
  
  // Calculate grid spans for future dynamic image sizing
  // const columnSpan = gridColumnEnd && gridColumnStart ? gridColumnEnd - gridColumnStart : 1;
  // const rowSpan = gridRowEnd && gridRowStart ? gridRowEnd - gridRowStart : 1;
  // const maxSpan = Math.max(columnSpan, rowSpan);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  const cardContent = isColorCard ? (
    // Color card content
    <>
      {title && (
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" sx={{ textAlign: 'center', px: 2, opacity: 0.9 }}>
          {subtitle}
        </Typography>
      )}
    </>
  ) : (
    // Image card content
    <Image
      src={imageSrc!}
      alt={alt}
      fill
      style={{ 
        objectFit: objectFit,
        objectPosition: 'center'
      }}
    />
  );

  const cardSx = {
    ...(gridColumnStart && gridColumnEnd && { gridColumn: `${gridColumnStart} / ${gridColumnEnd}` }),
    ...(gridRowStart && gridRowEnd && { gridRow: `${gridRowStart} / ${gridRowEnd}` }),
    ...(width && { width }),
    ...(height && { height }),
    ...(aspectRatio && { aspectRatio }),
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    // Remove any default padding/margin for images
    ...(!isColorCard && {
      padding: 0,
      margin: 0,
    }),
    ...(isClickable && { cursor: 'pointer' }),
    ...(isColorCard && {
      background: backgroundColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      border: `2px solid ${backgroundColor}`,
      padding: theme.spacing(2),
    }),
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
      ...(isColorCard && {
        background: backgroundColor?.replace('0.9', '1').replace('0.7', '0.8'),
      }),
    },
    ...sx,
  };

  const motionProps = {
    component: motion.div,
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: animationDelay, duration: 0.6 },
    whileHover: { scale: isClickable ? 1.02 : 1 },
    whileTap: isClickable ? { scale: 0.98 } : {},
    ...(isClickable && { onClick: handleClick }),
  };

  if (href && !onClick) {
    return (
      <Box
        component={Link}
        href={href}
        sx={{ textDecoration: 'none' }}
        className={className}
      >
        <Box
          {...motionProps}
          sx={cardSx}
        >
          {cardContent}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      {...motionProps}
      sx={cardSx}
      className={className}
    >
      {cardContent}
    </Box>
  );
}