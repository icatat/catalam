'use client';

import { Box, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { NavigationButton } from './NavigationButton';

interface NavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania' | 'contact' | 'about' | 'blog';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const theme = useTheme();

  const navItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About Us', href: '/about' },
    { key: 'blog', label: 'Travel Blog', href: '/blog' },
    { key: 'romania', label: 'Romania', href: '/romania' },
    { key: 'vietnam', label: 'Vietnam', href: '/vietnam' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Logo - Top Left */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: theme.zIndex.appBar
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              height: 32,
              position: 'relative',
              minWidth: 120,
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
              },
              transition: 'transform 0.2s ease',
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
        </Link>
      </Box>

      {/* Navigation Buttons - Top Right */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
        zIndex: theme.zIndex.appBar
      }}>
        {navItems.map((item) => (
          <NavigationButton key={item.key} href={item.href}>
            {item.label}
          </NavigationButton>
        ))}
      </Box>
    </>
  );
}