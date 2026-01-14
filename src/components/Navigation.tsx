'use client';

import { useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Favorite,
  Public,
  Email,
  Timeline,
  Article,
} from '@mui/icons-material';
import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

interface NavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania' | 'contact' | 'about' | 'blog';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      key: 'home',
      label: 'Home',
      href: '/',
      icon: <Home />,
      color: theme.palette.text.primary
    },
    {
      key: 'about',
      label: 'About Us',
      href: '/about',
      icon: <Timeline />,
      color: theme.palette.success.main
    },
    {
      key: 'blog',
      label: 'Travel Blog',
      href: '/blog',
      icon: <Article />,
      color: theme.palette.warning.main
    },
    {
      key: 'romania',
      label: 'Romania',
      href: '/romania',
      icon: <Favorite />,
      color: theme.palette.primary.main
    },
    {
      key: 'vietnam',
      label: 'Vietnam',
      href: '/vietnam',
      icon: <Public />,
      color: theme.palette.secondary.main
    },
    {
      key: 'contact',
      label: 'Contact',
      href: '/contact',
      icon: <Email />,
      color: theme.palette.info.main
    },
  ];

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white'
      }}>
        <Box sx={{ height: 32, position: 'relative', minWidth: 120 }}>
          <Image
            src="/NameHeader.png"
            alt="Catalina & Lam"
            fill
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <LanguageToggle variant="navigation" size="small" />
      </Box>

      <Divider />

      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
              <ListItemButton
                selected={currentPage === item.key}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: `${item.color}15`,
                    borderLeft: `4px solid ${item.color}`,
                    '& .MuiListItemIcon-root': {
                      color: item.color,
                    },
                    '& .MuiListItemText-primary': {
                      color: item.color,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${item.color}08`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '1rem',
                      fontWeight: currentPage === item.key ? 600 : 400,
                    }
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Catalina & Lam Wedding 2026
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Logo and Menu */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        left: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: theme.zIndex.appBar
      }}>
        {/* Logo */}
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

        {/* Menu Button */}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ 
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Language Toggle */}
        <LanguageToggle variant="navigation" size="small" />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        PaperProps={{
          sx: {
            backgroundImage: 'none',
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}