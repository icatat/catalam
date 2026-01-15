'use client';

import { Box, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { NavigationButton } from './NavigationButton';

interface NavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania' | 'contact' | 'about' | 'blog';
  showRomania?: boolean;
  showVietnam?: boolean;
}

export default function Navigation({
  currentPage = 'home',
  showRomania = false,
  showVietnam = false
}: NavigationProps) {
  const theme = useTheme();

  const allNavItems = [
    { key: 'home', label: 'Home', href: '/', alwaysShow: true },
    { key: 'about', label: 'About Us', href: '/about', alwaysShow: true },
    { key: 'blog', label: 'Travel Blog', href: '/blog', alwaysShow: true },
    { key: 'romania', label: 'Romania', href: '/romania', alwaysShow: false, show: showRomania },
    { key: 'vietnam', label: 'Vietnam', href: '/vietnam', alwaysShow: false, show: showVietnam },
    { key: 'contact', label: 'Contact', href: '/contact', alwaysShow: true },
  ];

  const navItems = allNavItems.filter(item => item.alwaysShow || item.show);

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