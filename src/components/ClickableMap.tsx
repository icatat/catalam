'use client';

import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface ClickableMapProps {
  imageSrc: string;
  alt: string;
  href: string;
  animationDelay?: number;
  width?: number;
  height?: number;
}

export function ClickableMap({
  imageSrc,
  alt,
  href,
  animationDelay = 0,
  width = 150,
  height = 150,
}: ClickableMapProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay, duration: 0.6 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            filter: 'brightness(1.1)',
          }
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </Box>
    </Link>
  );
}