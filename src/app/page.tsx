'use client';

import { useState, useEffect } from 'react';
import { NavigationButton } from '@/components/NavigationButton';
import { ClickableMap } from '@/components/ClickableMap';
import { Box, useTheme, Container, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MainPageCard } from '@/components/MainPageCard';
import { InviteModal } from '@/components/InviteModal';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { Location } from '@/models/RSVP';

interface GuestData {
  invite_id: string;
  first_name: string;
  last_name: string;
  vietnam: boolean;
  romania: boolean;
}

export default function Home() {
  const theme = useTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkExistingInvite = async () => {
      const savedInviteId = Cookies.get('invite_id');

      if (savedInviteId) {
        try {
          const response = await fetch('/api/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invite_id: savedInviteId }),
          });

          if (response.ok) {
            const data = await response.json();
            setGuestData({
              invite_id: savedInviteId,
              first_name: data.first_name,
              last_name: data.last_name,
              vietnam: data.vietnam,
              romania: data.romania
            });
          } else {
            Cookies.remove('invite_id');
          }
        } catch {
          Cookies.remove('invite_id');
        }
      }
      setIsVerifying(false);
    };

    checkExistingInvite();
  }, []);

  const handleInviteVerified = (data: GuestData) => {
    Cookies.set('invite_id', data.invite_id, { expires: 30 });
    setGuestData(data);
    setShowInviteModal(false);
  };

  const handleChangeInvite = () => {
    Cookies.remove('invite_id');
    setGuestData(null);
    setShowInviteModal(true);
  };

  const handleRemoveInvite = () => {
    Cookies.remove('invite_id');
    setGuestData(null);
  };

  const handleOpenModal = () => {
    setShowInviteModal(true);
  };

  console.log("GUEST DATA: ", guestData)

  const showRomaniaMap = guestData != null && guestData.romania;
  const showVietnamMap = guestData != null && guestData.vietnam;

  if (isVerifying) {
    return null; // or a loading spinner
  }

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
        zIndex: theme.zIndex.appBar
      }}>
        {/* Desktop Navigation */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: theme.spacing(1.5)
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
            <MenuItem onClick={handleMenuClose} component="a" href="/about">
              About Us
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component="a" href="/blog">
              Travel Blog
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component="a" href="/contact">
              Contact
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', py: { xs: 2, md: 0 } }}>
        {/* Centered Polaroid Container with Maps */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            gap: { xs: 3, sm: 4, md: 8 },
            py: { xs: 8, md: 0 }
          }}
        >
          {/* Romania Map - Left (Desktop only) */}
          {showRomaniaMap && (
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <ClickableMap
                imageSrc="/Romania_Map.png"
                alt="Romania Map"
                href="/romania"
                animationDelay={0.3}
                width={120}
                height={120}
              />
            </Box>
          )}

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

            {/* Access Code Button */}
            {!guestData && (
              <Box sx={{ mt: { xs: 2, md: 3 } }}>
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    }
                  }}
                >
                  Joining our wedding?
                </Button>
              </Box>
            )}

            {/* Maps Row - Mobile only */}
            {(showRomaniaMap || showVietnamMap) && (
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  gap: { xs: 3, sm: 4 },
                  mt: { xs: 3, sm: 4 },
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                {showRomaniaMap && (
                  <ClickableMap
                    imageSrc="/Romania_Map.png"
                    alt="Romania Map"
                    href="/romania"
                    animationDelay={0.3}
                    width={90}
                    height={90}
                  />
                )}
                {showVietnamMap && (
                  <ClickableMap
                    imageSrc="/Vietnam_Map.png"
                    alt="Vietnam Map"
                    href="/vietnam"
                    animationDelay={0.4}
                    width={90}
                    height={90}
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Vietnam Map - Right (Desktop only) */}
          {showVietnamMap && (
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <ClickableMap
                imageSrc="/Vietnam_Map.png"
                alt="Vietnam Map"
                href="/vietnam"
                animationDelay={0.4}
                width={120}
                height={120}
              />
            </Box>
          )}

        </Box>

      </Container>

      {/* Fine Print - Invite Management */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: theme.spacing(1), md: theme.spacing(2) },
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: theme.zIndex.appBar,
          width: '100%',
          px: 2
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            display: 'block',
            mb: 0.5,
          }}
        >
          {guestData ? (
            <>
              Access granted •{' '}
              <Button
                onClick={handleChangeInvite}
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                  textDecoration: 'underline',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Change access code
              </Button>
              {' • '}
              <Button
                onClick={handleRemoveInvite}
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                  textDecoration: 'underline',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                    color: theme.palette.error.main,
                  },
                }}
              >
                Remove
              </Button>
            </>
          ) : null}
        </Typography>
      </Box>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onVerified={handleInviteVerified}
      />
    </Box>
  );
}