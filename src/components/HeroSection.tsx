import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Box, Typography, useTheme, Container } from '@mui/material';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  date: string;
  location: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  date,
  location,
  backgroundImage,
  className = ''
}: HeroSectionProps) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Box
      component={motion.div}
      ref={ref}
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 
          `linear-gradient(135deg, ${theme.palette.primary.light}45 0%, ${theme.palette.primary.main}20 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: 8
      }}
      style={{ y, opacity }}
    >
      {backgroundImage && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)'
          }}
        />
      )}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component={motion.h1}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            fontWeight: 700,
            mb: 4,
            color: backgroundImage ? 'white' : theme.palette.text.primary,
            textShadow: backgroundImage ? '0 4px 8px rgba(0,0,0,0.5)' : 'none'
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="h5"
            component={motion.p}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            sx={{
              mb: 8,
              color: backgroundImage ? 'white' : theme.palette.text.secondary,
              textShadow: backgroundImage ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        <Box
          component={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          sx={{
            display: 'inline-block',
            p: 3,
            backgroundColor: backgroundImage ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
            borderRadius: 3,
            boxShadow: theme.shadows[8]
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mb: 2
            }}
          >
            {date}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            {location}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}