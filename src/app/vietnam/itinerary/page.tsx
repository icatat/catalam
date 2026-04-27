'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Box, useTheme, Container, Typography, IconButton } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';
import { ArrowLeft } from 'lucide-react';

export default function VietnamItinerary() {
  const theme = useTheme();
  const router = useRouter();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (!savedInviteId) {
      router.push('/');
      return;
    }

    fetch('/api/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_id: savedInviteId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.vietnam) {
          setGuestData({
            invite_id: savedInviteId,
            first_name: data.first_name,
            last_name: data.last_name,
            vietnam: data.vietnam,
            romania: data.romania,
            group: data.group,
            has_rsvp_romania: data.has_rsvp_romania,
            has_rsvp_vietnam: data.has_rsvp_vietnam,
            group_members: data.group_members || [],
          } as any);
          setIsVerifying(false);
        } else {
          router.push('/');
        }
      })
      .catch(() => {
        Cookies.remove('invite_id');
        router.push('/');
      });
  }, [router]);

  if (isVerifying || !guestData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Box
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            sx={{ borderBottom: `2px solid ${theme.palette.primary.main}` }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Loading...</Typography>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Fixed Background Layer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(135deg, rgba(194, 225, 238, 0.15) 0%, rgba(194, 225, 238, 0.15) 25%, rgba(194, 225, 238, 0.2) 50%, rgba(194, 225, 238, 0.1) 75%, rgba(194, 225, 238, 0.15) 100%), url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          zIndex: -1
        }}
      />

      <Navigation currentPage="vietnam" showRomania={(guestData as any)?.romania} showVietnam={true} />

      <Container maxWidth="xl">
        <Box sx={{ pt: { xs: 8, md: 10 }, pb: 2 }}>
          <IconButton
            onClick={() => router.push('/vietnam')}
            sx={{ color: theme.palette.primary.main, mb: 2 }}
          >
            <ArrowLeft />
          </IconButton>
        </Box>

        <ScrollReveal direction="up" delay={0.1}>
          <section style={{ padding: theme.spacing(2, 0, 8, 0) }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, textAlign: 'center' }}>
              <Typography variant="h2" component="h1" sx={{
                fontFamily: '"Arizonia", cursive',
                color: theme.palette.primary.dark,
                fontWeight: 400,
                mb: 4,
                fontSize: { xs: '3rem', md: '4rem' }
              }}>
                Itinerary
              </Typography>
              <Typography variant="body1" sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
                lineHeight: 1.8
              }}>
                Details for the Vietnam wedding day will be published here soon. Stay tuned!
              </Typography>
            </Box>
          </section>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
