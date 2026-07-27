'use client';

import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import Image from 'next/image';

interface MainPageCardProps {
  imageSrc: string;
  alt?: string;
  polaroid?: boolean;
  bottomContent?: React.ReactNode;
  animationDelay?: number;
  sx?: Record<string, unknown>;
}

export function MainPageCard({
  imageSrc,
  alt = 'Wedding Photo',
  polaroid = false,
  bottomContent,
  animationDelay = 0,
  sx,
}: MainPageCardProps) {
  
  if (polaroid) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay, duration: 0.6 }}
        sx={{
          position: 'relative',
          maxWidth: { xs: '280px', sm: '350px', md: '400px' },
          width: '100%',
          '& > img:first-of-type': {
            border: '20px solid #ffffff',
            borderBottomWidth: '120px',
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100% !important',
            height: 'auto !important',
          },
          ...sx,
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          width={0}
          height={0}
          sizes="(max-width: 600px) 280px, (max-width: 900px) 350px, 400px"
          priority
        />
        {bottomContent && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '10px',
              width: 'auto',
              left: '50%',
              transform: 'translateX(-50%)',
              height: 'auto',
              justifyContent: 'center',
              maxWidth: '90%'
            }}
          >
            {bottomContent}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: animationDelay, duration: 0.6 }}
      sx={sx}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </Box>
  );
}