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
        
        {/* Random Grid Layout with photo-shaped cards */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: theme.spacing(0.3),
            p: theme.spacing(0.5),
            position: 'relative',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {/* Large landscape photo_2 */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={5}
            gridRowStart={1}
            gridRowEnd={3}
            imageSrc="/photo_2.png"
            alt="Wedding Photo 2"
            aspectRatio="4/3"
            objectFit="contain"
            animationDelay={0.1}
          />
          
          {/* About button */}
          <MainPageCard
            gridColumnStart={5}
            gridColumnEnd={6}
            gridRowStart={1}
            gridRowEnd={2}
            backgroundColor="linear-gradient(135deg, rgba(255, 182, 193, 0.9) 0%, rgba(255, 182, 193, 0.7) 100%)"
            title={t('nav.about')}
            href="/about"
            aspectRatio="1/1"
            animationDelay={0.2}
            sx={{
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: `2px solid rgba(255, 182, 193, 0.8)`,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.8rem',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 182, 193, 1)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: theme.shadows[8],
              }
            }}
          />
          
          {/* Portrait photo_4 */}
          <MainPageCard
            gridColumnStart={6}
            gridColumnEnd={8}
            gridRowStart={1}
            gridRowEnd={4}
            imageSrc="/photo_4.png"
            alt="Wedding Photo 4"
            aspectRatio="3/4"
            objectFit="contain"
            animationDelay={0.3}
          />
          
          {/* Square photo_5 */}
          <MainPageCard
            gridColumnStart={8}
            gridColumnEnd={9}
            gridRowStart={1}
            gridRowEnd={2}
            imageSrc="/photo_5.png"
            alt="Wedding Photo 5"
            aspectRatio="1/1"
            objectFit="contain"
            animationDelay={0.4}
          />
          
          {/* Romania button */}
          <MainPageCard
            gridColumnStart={9}
            gridColumnEnd={11}
            gridRowStart={1}
            gridRowEnd={2}
            backgroundColor="linear-gradient(135deg, rgba(239, 217, 223, 0.9) 0%, rgba(239, 217, 223, 0.7) 100%)"
            title={`${t('nav.romania')} 🇷🇴`}
            href="/romania"
            animationDelay={0.5}
            sx={{
              aspectRatio: '2/1',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: `2px solid rgba(239, 217, 223, 0.8)`,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(239, 217, 223, 1)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: theme.shadows[8],
              }
            }}
          />
          
          {/* Wide landscape photo_6 (estimated 16:9 ratio) */}
          <MainPageCard
            gridColumnStart={8}
            gridColumnEnd={11}
            gridRowStart={2}
            gridRowEnd={3}
            imageSrc="/photo_6.png"
            alt="Wedding Photo 6"
            animationDelay={0.6}
            sx={{ 
              aspectRatio: '16/9',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Square photo_7 (estimated 1:1 ratio) */}
          <MainPageCard
            gridColumnStart={5}
            gridColumnEnd={6}
            gridRowStart={2}
            gridRowEnd={3}
            imageSrc="/photo_7.png"
            alt="Wedding Photo 7"
            animationDelay={0.7}
            sx={{ 
              aspectRatio: '1/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />

          {/* CENTER: NameHeader */}
          <MainPageCard
            gridColumnStart={3}
            gridColumnEnd={6}
            gridRowStart={3}
            gridRowEnd={4}
            imageSrc="/NameHeader.png"
            alt="Wedding Names"
            animationDelay={0.1}
            sx={{
              aspectRatio: '3/1',
              borderRadius: 0,
              boxShadow: 'none',
              border: 'none',
              overflow: 'visible',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                boxShadow: 'none',
                transform: 'none',
              },
              '& img': {
                objectFit: 'contain !important',
                width: '100%',
                height: '100%',
              }
            }}
          />
          
          {/* Large landscape photo_9 (estimated 16:10 ratio) */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={3}
            gridRowStart={3}
            gridRowEnd={4}
            imageSrc="/photo_9.png"
            alt="Wedding Photo 9"
            animationDelay={0.8}
            sx={{ 
              aspectRatio: '16/10',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Portrait photo_10 (estimated 2:3 ratio) */}
          <MainPageCard
            gridColumnStart={8}
            gridColumnEnd={10}
            gridRowStart={3}
            gridRowEnd={5}
            imageSrc="/photo_10.png"
            alt="Wedding Photo 10"
            animationDelay={0.9}
            sx={{ 
              aspectRatio: '2/3',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Square photo_11 (estimated 1:1 ratio) */}
          <MainPageCard
            gridColumnStart={6}
            gridColumnEnd={7}
            gridRowStart={3}
            gridRowEnd={4}
            imageSrc="/photo_11.png"
            alt="Wedding Photo 11"
            animationDelay={1.0}
            sx={{ 
              aspectRatio: '1/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Vietnam button */}
          <MainPageCard
            gridColumnStart={7}
            gridColumnEnd={8}
            gridRowStart={3}
            gridRowEnd={5}
            backgroundColor="linear-gradient(135deg, rgba(194, 225, 238, 0.9) 0%, rgba(194, 225, 238, 0.7) 100%)"
            title={`${t('nav.vietnam')} 🇻🇳`}
            href="/vietnam"
            animationDelay={1.1}
            sx={{
              aspectRatio: '1/2',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: `2px solid rgba(194, 225, 238, 0.8)`,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.9rem',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(194, 225, 238, 1)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: theme.shadows[8],
              }
            }}
          />
          
          {/* Wide landscape photo_12 (estimated 5:3 ratio) */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={4}
            gridRowStart={4}
            gridRowEnd={5}
            imageSrc="/photo_12.png"
            alt="Wedding Photo 12"
            animationDelay={1.2}
            sx={{ 
              aspectRatio: '5/3',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Square photo_13 (estimated 1:1 ratio) */}
          <MainPageCard
            gridColumnStart={4}
            gridColumnEnd={5}
            gridRowStart={4}
            gridRowEnd={5}
            imageSrc="/photo_13.png"
            alt="Wedding Photo 13"
            animationDelay={1.3}
            sx={{ 
              aspectRatio: '1/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Square photo_14 (estimated 1:1 ratio) */}
          <MainPageCard
            gridColumnStart={5}
            gridColumnEnd={6}
            gridRowStart={4}
            gridRowEnd={5}
            imageSrc="/photo_14.png"
            alt="Wedding Photo 14"
            animationDelay={1.4}
            sx={{ 
              aspectRatio: '1/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Square photo_15 (estimated 1:1 ratio) */}
          <MainPageCard
            gridColumnStart={6}
            gridColumnEnd={7}
            gridRowStart={4}
            gridRowEnd={5}
            imageSrc="/photo_15.png"
            alt="Wedding Photo 15"
            animationDelay={1.5}
            sx={{ 
              aspectRatio: '1/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />

          {/* Contact button */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={3}
            gridRowStart={5}
            gridRowEnd={6}
            backgroundColor="linear-gradient(135deg, rgba(173, 216, 230, 0.9) 0%, rgba(173, 216, 230, 0.7) 100%)"
            title={t('nav.contact')}
            href="/contact"
            animationDelay={1.6}
            sx={{
              aspectRatio: '2/1',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: `2px solid rgba(173, 216, 230, 0.8)`,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(173, 216, 230, 1)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: theme.shadows[8],
              }
            }}
          />
          
          {/* Extra wide bottom banner */}
          <MainPageCard
            gridColumnStart={3}
            gridColumnEnd={11}
            gridRowStart={5}
            gridRowEnd={6}
            imageSrc="/photo_6.png"
            alt="Wedding Photo 6 Banner"
            animationDelay={1.7}
            sx={{ 
              aspectRatio: '8/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />
          
          {/* Final bottom row with remaining photos */}
          <MainPageCard
            gridColumnStart={1}
            gridColumnEnd={11}
            gridRowStart={6}
            gridRowEnd={7}
            imageSrc="/photo_9.png"
            alt="Wedding Photo 9 Ultra Wide"
            animationDelay={1.8}
            sx={{ 
              aspectRatio: '10/1',
              '& img': { 
                objectFit: 'contain !important',
                width: '100%',
                height: '100%'
              }
            }}
          />

        </Box>

      </Container>
    </Box>
  );
}