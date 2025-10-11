'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Box, useTheme, Container } from '@mui/material';
import { MainPageCard } from '@/components/MainPageCard';

export default function Home() {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        height: '100vh',
        background: `linear-gradient(135deg, rgba(239, 217, 223, 0.15) 0%, rgba(194, 225, 238, 0.15) 25%, rgba(239, 217, 223, 0.2) 50%, rgba(194, 225, 238, 0.1) 75%, rgba(239, 217, 223, 0.15) 100%), url(/background-main.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top-right controls */}
      <Box sx={{ 
        position: 'absolute', 
        top: theme.spacing(2), 
        right: theme.spacing(2), 
        display: 'flex', 
        alignItems: 'center', 
        gap: theme.spacing(1.5), 
        zIndex: theme.zIndex.appBar 
      }}>
        <LanguageToggle variant="subtle" size="small" />
      </Box>
      
      <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Grid Layout filled with cards */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
            gap: theme.spacing(1.5),
            p: theme.spacing(2),
            position: 'relative',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {/* Row 1: Country buttons and photos */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={3}
            gridRowStart={1}
            gridRowEnd={2}
            backgroundColor="linear-gradient(135deg, rgba(239, 217, 223, 0.9) 0%, rgba(239, 217, 223, 0.7) 100%)"
            title={`${t('nav.romania')} 🇷🇴`}
            subtitle={t('contact.info.romania')}
            href="/romania"
            animationDelay={0.2}
            sx={{
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: `2px solid rgba(239, 217, 223, 0.8)`,
              '&:hover': {
                backgroundColor: 'rgba(239, 217, 223, 1)',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              }
            }}
          />

          <MainPageCard
            gridColumnStart={3}
            gridColumnEnd={4}
            gridRowStart={1}
            gridRowEnd={3}
            imageSrc="/photo_2.jpeg"
            alt="Wedding Photo 2"
            animationDelay={0.3}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={4}
            gridColumnEnd={5}
            gridRowStart={1}
            gridRowEnd={2}
            imageSrc="/photo_0.png"
            alt="Wedding Photo 0"
            animationDelay={0.4}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={5}
            gridColumnEnd={7}
            gridRowStart={1}
            gridRowEnd={2}
            backgroundColor="linear-gradient(135deg, rgba(194, 225, 238, 0.9) 0%, rgba(194, 225, 238, 0.7) 100%)"
            title={`${t('nav.vietnam')} 🇻🇳`}
            subtitle={t('contact.info.vietnam')}
            href="/vietnam"
            animationDelay={0.5}
            sx={{
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: `2px solid rgba(194, 225, 238, 0.8)`,
              '&:hover': {
                backgroundColor: 'rgba(194, 225, 238, 1)',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6],
              }
            }}
          />

          <MainPageCard
            gridColumnStart={7}
            gridColumnEnd={8}
            gridRowStart={1}
            gridRowEnd={3}
            imageSrc="/photo_4.jpeg"
            alt="Wedding Photo 4"
            animationDelay={0.6}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          {/* Row 2: More photos */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={2}
            gridRowStart={2}
            gridRowEnd={4}
            imageSrc="/photo_3.png"
            alt="Wedding Photo 3"
            animationDelay={0.7}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={2}
            gridColumnEnd={3}
            gridRowStart={2}
            gridRowEnd={3}
            imageSrc="/photo_6.jpeg"
            alt="Wedding Photo 6"
            animationDelay={0.8}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={5}
            gridColumnEnd={6}
            gridRowStart={2}
            gridRowEnd={4}
            imageSrc="/photo_5.jpeg"
            alt="Wedding Photo 5"
            animationDelay={0.9}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={6}
            gridColumnEnd={7}
            gridRowStart={2}
            gridRowEnd={3}
            imageSrc="/photo_7.jpeg"
            alt="Wedding Photo 7"
            animationDelay={1.0}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          {/* Row 3-4: NameHeader (protected area) and remaining photos */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={3}
            gridRowStart={2}
            gridRowEnd={3}
            imageSrc="/NameHeader.png"
            alt="Wedding Names"
            animationDelay={1.2}
            sx={{
              borderRadius: 0,
              boxShadow: 'none',
              border: 'none',
              overflow: 'visible',
              zIndex: 10,
              '&:hover': {
                boxShadow: 'none',
                transform: 'none',
              },
              '& img': {
                objectFit: 'contain !important',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={6}
            gridColumnEnd={7}
            gridRowStart={3}
            gridRowEnd={5}
            imageSrc="/photo_9.jpeg"
            alt="Wedding Photo 9"
            animationDelay={1.4}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          <MainPageCard
            gridColumnStart={7}
            gridColumnEnd={8}
            gridRowStart={3}
            gridRowEnd={5}
            imageSrc="/photo_2.jpeg"
            alt="Wedding Photo 2 Extra"
            animationDelay={1.5}
            sx={{
              '& img': {
                objectFit: 'contain',
              }
            }}
          />

          {/* Row 5: Navigation buttons */}
          <MainPageCard
            gridColumnStart={5}
            gridColumnEnd={6}
            gridRowStart={5}
            gridRowEnd={6}
            backgroundColor="rgba(255, 255, 255, 0.85)"
            title={t('nav.about')}
            href="/about"
            animationDelay={1.6}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid rgba(0, 0, 0, 0.08)`,
              borderRadius: 1,
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                transform: 'scale(1.02)',
                boxShadow: theme.shadows[2],
              }
            }}
          />

          <MainPageCard
            gridColumnStart={6}
            gridColumnEnd={7}
            gridRowStart={5}
            gridRowEnd={6}
            backgroundColor="rgba(255, 255, 255, 0.85)"
            title={t('nav.contact')}
            href="/contact"
            animationDelay={1.7}
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid rgba(0, 0, 0, 0.08)`,
              borderRadius: 1,
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                transform: 'scale(1.02)',
                boxShadow: theme.shadows[2],
              }
            }}
          />

        </Box>

      </Container>
    </Box>
  );
}