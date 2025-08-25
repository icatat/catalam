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
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Favorite,
  Public,
  Email,
} from '@mui/icons-material';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import MuiLanguageToggle from './MuiLanguageToggle';

interface MuiNavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania' | 'contact';
}

export default function MuiNavigation({ currentPage = 'home' }: MuiNavigationProps) {
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
      color: '#64748b' // Gray
    },
    { 
      key: 'romania', 
      label: t('nav.romania'), 
      href: '/romania', 
      icon: <Favorite />,
      color: '#f43f5e' // Rose
    },
    { 
      key: 'vietnam', 
      label: t('nav.vietnam'), 
      href: '/vietnam', 
      icon: <Public />,
      color: '#10b981' // Emerald
    },
    { 
      key: 'contact', 
      label: t('nav.contact'), 
      href: '/contact', 
      icon: <Email />,
      color: '#6366f1' // Indigo
    },
  ];

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        background: 'linear-gradient(135deg, #f43f5e 0%, #10b981 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" sx={{ fontFamily: 'serif', fontWeight: 600 }}>
          Cata & Lam
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <MuiLanguageToggle variant="navigation" size="small" />
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
          Wedding 2026 ✨
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
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontFamily: 'serif',
                  fontWeight: 600,
                  color: 'text.primary',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #10b981 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                Cata & Lam
              </Typography>
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
                <MuiLanguageToggle variant="navigation" size="small" />
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