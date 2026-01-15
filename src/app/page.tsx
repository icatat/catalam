'use client';

import { NavigationButton } from '@/components/NavigationButton';
import { ClickableMap } from '@/components/ClickableMap';
import { Box, useTheme, Container } from '@mui/material';
import { MainPageCard } from '@/components/MainPageCard';
import Image from 'next/image';

export default function Home() {
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
        <NavigationButton href="/about">
          About Us
        </NavigationButton>

        <NavigationButton href="/blog">
          Travel Blog
        </NavigationButton>

        <NavigationButton href="/contact">
          Contact
        </NavigationButton>
      </Box>
      
      <Container maxWidth="xl" sx={{ height: '100%', display: 'flow' }}>
        {/* Centered Polaroid Container with Maps */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            gap: 8
          }}
        >
          {/* Romania Map - Left */}
          <ClickableMap
            imageSrc="/Romania_Map.png"
            alt="Romania Map"
            href="/romania"
            animationDelay={0.3}
            width={120}
            height={120}
          />
          
          {/* Center Column with Polaroid and Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Centered bigger polaroid with NameHeader */}
            <MainPageCard
              polaroid={true}
              imageSrc="/photo_4.png"
              alt="Wedding Photo"
              animationDelay={0.1}
              bottomContent={
                <Image
                  src="/NameHeader.png"
                  alt="Wedding Names"
                  width={100}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%'
                  }}
                />
              }
            />
          </Box>
          
          {/* Vietnam Map - Right */}
          <ClickableMap
            imageSrc="/Vietnam_Map.png"
            alt="Vietnam Map"
            href="/vietnam"
            animationDelay={0.4}
            width={120}
            height={120}
          />

        </Box>

      </Container>
    </Box>
  );
}