'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
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
} from '@mui/icons-material';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface NavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania' | 'contact' | 'about';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { 
      key: 'home', 
      label: t('nav.home'), 
      href: '/', 
      icon: <Home />,
      color: theme.palette.text.primary
    },
    { 
      key: 'about', 
      label: t('nav.about') || 'About Us', 
      href: '/about', 
      icon: <Timeline />,
      color: theme.palette.success.main
    },
    { 
      key: 'romania', 
      label: t('nav.romania'), 
      href: '/romania', 
      icon: <Favorite />,
      color: theme.palette.primary.main
    },
    { 
      key: 'vietnam', 
      label: t('nav.vietnam'), 
      href: '/vietnam', 
      icon: <Public />,
      color: theme.palette.secondary.main
    },
    { 
      key: 'contact', 
      label: t('nav.contact'), 
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
          {t('nav.footer.wedding')}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  height: 40,
                  position: 'relative',
                  minWidth: 150,
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

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        color: currentPage === item.key ? item.color : 'text.primary',
                        backgroundColor: currentPage === item.key ? `${item.color}15` : 'transparent',
                        fontWeight: currentPage === item.key ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': {
                          backgroundColor: `${item.color}10`,
                          color: item.color,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', color: 'inherit', fontSize: '1.1rem' }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body1" sx={{ color: 'inherit', fontWeight: 'inherit' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Link>
                ))}
              </Box>
            )}

            {/* Language Toggle (Desktop only) */}
            {!isMobile && (
              <Box sx={{ ml: 2 }}>
                <LanguageToggle variant="navigation" size="small" />
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

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