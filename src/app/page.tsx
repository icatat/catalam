'use client';

import { motion } from 'framer-motion';
import { PhotoCard, TextCard } from '@/components/ui/photo-card';
import { DynamicPhotoCard } from '@/components/DynamicPhotoCard';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { Box, useTheme, Container, Typography } from '@mui/material';
// Removed getWeddingVariant import as we now use unified theme colors

interface BlobImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function Home() {
  const { t } = useLanguage();
  const theme = useTheme();
  const [blobImages, setBlobImages] = useState<BlobImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();
        setBlobImages(data.images || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  // Randomize blob images with dynamic positioning
  const randomizedBlobImages = useMemo(() => {
    return [...blobImages].sort(() => Math.random() - 0.5).map(image => ({
      ...image,
      rotation: 0, // Removed rotation to keep images straight
      scale: 0.8 + Math.random() * 0.4,
    }));
  }, [blobImages]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/landmarks.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        p: { xs: theme.spacing(2), md: theme.spacing(3) },
        position: 'relative'
      }}
    >
      {/* Subtle top-right controls */}
      <Box sx={{ 
        position: 'absolute', 
        top: theme.spacing(2), 
        right: theme.spacing(2), 
        display: 'flex', 
        alignItems: 'center', 
        gap: theme.spacing(1.5), 
        zIndex: theme.zIndex.appBar 
      }}>
        <Box
          component={Link}
          href="/contact"
          sx={{
            px: theme.spacing(1.5),
            py: theme.spacing(1),
            borderRadius: theme.shape.borderRadius * 6,
            fontSize: theme.typography.caption.fontSize,
            fontWeight: theme.typography.fontWeightMedium,
            transition: theme.transitions.create(['all'], { duration: theme.transitions.duration.short }),
            backgroundColor: theme.palette.common.white + '1A',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${theme.palette.common.white}33`,
            color: theme.palette.common.white + 'E6',
            textDecoration: 'none',
            display: 'inline-block',
            '&:hover': {
              backgroundColor: theme.palette.common.white + '33',
              color: theme.palette.common.white,
              borderColor: theme.palette.common.white + '4D',
            },
          }}
        >
          {t('nav.contact')}
        </Box>
        <LanguageToggle variant="subtle" size="small" />
      </Box>
      
      <Container maxWidth="xl">
        
        {/* Centered Main Title */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: theme.spacing(8) }}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 100, sm: 120, md: 160 },
              width: { xs: 500, sm: 600, md: 700 },
              maxWidth: '500vw',
            }}
          >
            <Image
              src="/NameHeader.png"
              alt="Catalina & Lam"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
        </Box>

        {/* Prominent Wedding Location Cards */}
        <Box
          component={motion.div}
          sx={{ display: 'flex', justifyContent: 'center', mb: theme.spacing(8), gap: theme.spacing(2), flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
      
          {/* Romania Wedding Card */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <PhotoCard
              src="/photo_3.png"
              alt="Romania Wedding"
              size="wide"
              href="/romania"
              className="w-80 transition-all duration-300"
              sx={{
                boxShadow: theme.shadows[8],
                border: `${theme.spacing(0.5)} solid ${theme.palette.primary.main}30`,
                borderRadius: theme.shape.borderRadius * 0.05,
                '&:hover': {
                  boxShadow: theme.shadows[16],
                  borderColor: `${theme.palette.primary.main}60`,
                  background: theme.palette.primary.main 
                },
              }}
              overlay={
                <Box sx={{ 
                  textAlign: 'center',
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(52, 65, 80, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: theme.spacing(2)
                }}>
                 
                  <Typography variant="h5" component="h3" sx={{ color: theme.palette.common.white, mb: theme.spacing(1), fontWeight: theme.typography.fontWeightBold }}>
                      {t('nav.romania') } 🇷🇴
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.common.white, mb: theme.spacing(2) }}>
                    {t('contact.info.romania')}
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Vietnam Wedding Card */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <PhotoCard
              src="/photo_0.png"
              alt="Vietnam Wedding"
              size="wide"
              href="/vietnam"
              className="w-80 transition-all duration-300"
              sx={{
                boxShadow: theme.shadows[8],
                border: `${theme.spacing(0.5)} solid ${theme.palette.primary.main}30`,
                borderRadius: theme.shape.borderRadius * 0.05,
                '&:hover': {
                  boxShadow: theme.shadows[16],
                  borderColor: `${theme.palette.primary.main}60`,
                },
              }}
              overlay={
                <Box sx={{ 
                  textAlign: 'center',
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(52, 65, 80, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: theme.spacing(2)
                }}>
                  <Typography variant="h5" component="h3" sx={{ color: theme.palette.common.white, mb: theme.spacing(1), fontWeight: theme.typography.fontWeightBold }}>
                    {t('nav.vietnam')} 🇻🇳
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.common.white, mb: theme.spacing(2) }}>
                    {t('contact.info.vietnam')}
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>

                {/* About Us Section */}
        <Box
          component={motion.div}
          sx={{ 
            textAlign: 'center', 
            mb: theme.spacing(8),
            maxWidth: 800,
            mx: 'auto',
            px: theme.spacing(2)
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Box
            component={Link}
            href="/about"
            sx={{
              display: 'inline-block',
              px: theme.spacing(3),
              py: theme.spacing(1.5),
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              borderRadius: theme.shape.borderRadius * 2,
              textDecoration: 'none',
              fontWeight: theme.typography.fontWeightMedium,
              transition: 'all 0.3s ease',
              boxShadow: theme.shadows[4],
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)'
              }
            }}
          >
            Read Our Story
          </Box>
        </Box>


        {/* Dynamic Blob Store Images Gallery */}
        {loading && (
          <Box
            component={motion.div}
            sx={{ display: 'flex', justifyContent: 'center', py: theme.spacing(8) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: theme.spacing(4),
                backgroundColor: theme.palette.common.white + '1A',
                backdropFilter: 'blur(4px)',
                borderRadius: theme.shape.borderRadius * 2,
                px: theme.spacing(4),
              }}
            >
              <Box
                className="inline-block animate-spin rounded-full h-12 w-12"
                sx={{
                  borderBottom: `4px solid ${theme.palette.primary.main}`,
                }}
              />
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mt: theme.spacing(2) }}>
                {t('common.loading')}
              </Typography>
            </Box>
          </Box>
        )}

        {!loading && blobImages.length > 0 && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          > 
            {/* Masonry-like grid for blob images */}
            <Box sx={{ 
              columnCount: { xs: 1, sm: 2, md: 3, lg: 4 }, 
              columnGap: { xs: theme.spacing(2), md: theme.spacing(3) }
            }}>
              {randomizedBlobImages.map((image, index) => (
                <Box
                  key={image.url}
                  component={motion.div}
                  sx={{ 
                    breakInside: 'avoid', 
                    mb: { xs: theme.spacing(2), md: theme.spacing(3) },
                    width: '100%'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0 
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 0,
                    zIndex: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <DynamicPhotoCard
                    src={image.url}
                    alt={`Wedding memory ${index + 1}`}
                    className="w-full"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!loading && blobImages.length === 0 && (
          <Box
            component={motion.div}
            sx={{ display: 'flex', justifyContent: 'center', py: theme.spacing(8) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <TextCard size="medium" variant="accent" sx={{ maxWidth: theme.spacing(60) }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ maxWidth: "48px", mx: 'auto', mb: theme.spacing(2) }}>
                  <img src="favicon.ico" alt="Wedding icon" style={{ width: '100%', height: 'auto' }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ color: theme.palette.primary.main, mb: theme.spacing(1.5) }}>
                  Memories Coming Soon
                </Typography>
              </Box>
            </TextCard>
          </Box>
        )}

      </Container>
    </Box>
  );
}