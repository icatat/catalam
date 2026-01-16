'use client';

import { useState, useEffect } from 'react';
import { NavigationButton } from '@/components/NavigationButton';
import { ClickableMap } from '@/components/ClickableMap';
import { Box, useTheme, Container, Typography, Button } from '@mui/material';
import { MainPageCard } from '@/components/MainPageCard';
import { InviteModal } from '@/components/InviteModal';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { Location } from '@/models/RSVP';

interface GuestData {
  invite_id: string;
  full_name: string;
  location: Location[];
  rsvp: Location[];
}

export default function Home() {
  const theme = useTheme();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasSkipped, setHasSkipped] = useState(false);

  useEffect(() => {
    const checkExistingInvite = async () => {
      const savedInviteId = Cookies.get('invite_id');
      const skippedStatus = Cookies.get('invite_skipped');

      if (skippedStatus === 'true') {
        setHasSkipped(true);
        setIsVerifying(false);
        return;
      }

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
              full_name: data.full_name,
              location: data.location,
              rsvp: data.rsvp || [],
            });
          } else {
            Cookies.remove('invite_id');
            setShowInviteModal(true);
          }
        } catch {
          Cookies.remove('invite_id');
          setShowInviteModal(true);
        }
      } else {
        setShowInviteModal(true);
      }
      setIsVerifying(false);
    };

    checkExistingInvite();
  }, []);

  const handleInviteVerified = (data: GuestData) => {
    Cookies.set('invite_id', data.invite_id, { expires: 30 });
    Cookies.remove('invite_skipped');
    setGuestData(data);
    setHasSkipped(false);
    setShowInviteModal(false);
  };

  const handleSkip = () => {
    Cookies.set('invite_skipped', 'true', { expires: 1 }); // Expires in 1 day
    setHasSkipped(true);
    setShowInviteModal(false);
  };

  const handleChangeInvite = () => {
    Cookies.remove('invite_id');
    Cookies.remove('invite_skipped');
    setGuestData(null);
    setHasSkipped(false);
    setShowInviteModal(true);
  };

  const handleRemoveInvite = () => {
    Cookies.remove('invite_id');
    Cookies.set('invite_skipped', 'true', { expires: 1 });
    setGuestData(null);
    setHasSkipped(true);
  };

  const showRomaniaMap = !hasSkipped && (guestData && guestData.location.includes(Location.ROMANIA));
  const showVietnamMap = !hasSkipped && (guestData && guestData.location.includes(Location.VIETNAM));

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
          {showRomaniaMap && (
            <ClickableMap
              imageSrc="/Romania_Map.png"
              alt="Romania Map"
              href="/romania"
              animationDelay={0.3}
              width={120}
              height={120}
            />
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
          </Box>

          {/* Vietnam Map - Right */}
          {showVietnamMap && (
            <ClickableMap
              imageSrc="/Vietnam_Map.png"
              alt="Vietnam Map"
              href="/vietnam"
              animationDelay={0.4}
              width={120}
              height={120}
            />
          )}

        </Box>

      </Container>

      {/* Fine Print - Invite Management */}
      <Box
        sx={{
          position: 'absolute',
          bottom: theme.spacing(2),
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: theme.zIndex.appBar,
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
              Logged in as {guestData.full_name} •{' '}
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
                Change invite code
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
          ) : hasSkipped ? (
            <>
              Browsing without invite •{' '}
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
                Enter invite code
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
        onSkip={handleSkip}
      />
    </Box>
  );
}