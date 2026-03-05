'use client';

import { useState } from 'react';
import { Box, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        zIndex: theme.zIndex.appBar
      }}>
        {/* Desktop Navigation */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: theme.spacing(1.5)
        }}>
          {navItems.map((item) => (
            <NavigationButton key={item.key} href={item.href}>
              {item.label}
            </NavigationButton>
          ))}
        </Box>

        {/* Mobile Burger Menu */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            {navItems.map((item) => (
              <MenuItem
                key={item.key}
                onClick={handleMenuClose}
                component="a"
                href={item.href}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </>
  );
}