'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Box, useTheme, Container, Typography, IconButton } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';
import { ArrowLeft } from 'lucide-react';

export default function VietnamDetails() {
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
          background: `linear-gradient(135deg, rgba(194, 225, 238, 0.15) 0%, rgba(194, 225, 238, 0.15) 25%, rgba(194, 225, 238, 0.2) 50%, rgba(194, 225, 238, 0.1) 75%, rgba(194, 225, 238, 0.15) 100%), url(/background-main.png)`,
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
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
              <Typography variant="h2" component="h2" sx={{
                fontFamily: '"Arizonia", cursive',
                color: theme.palette.primary.dark,
                fontWeight: 400,
                mb: 6,
                textAlign: 'center',
                fontSize: { xs: '3rem', md: '4rem' }
              }}>
                Wedding Location
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 4,
                alignItems: 'center'
              }}>
                {/* Location Details */}
                <Box sx={{
                  p: 4,
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.grey[200]}`
                }}>
                  <Typography variant="h4" component="h3" sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    mb: 3
                  }}>
                    Cam Ranh, Vietnam
                  </Typography>

                  <Typography variant="body1" sx={{
                    color: theme.palette.text.secondary,
                    mb: 3,
                    lineHeight: 1.7
                  }}>
                    Celebrate with us in vibrant Cam Ranh for our Vietnamese wedding ceremony. This bustling metropolis, rich in history and tradition, will host our joyous celebration.
                  </Typography>

                  {/* Venue Address */}
                  <Box sx={{
                    p: 3,
                    bgcolor: theme.palette.grey[50],
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      mb: 1
                    }}>
                      Venue
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                      Details coming soon!
                    </Typography>
                  </Box>
                </Box>

                {/* Google Maps Embed */}
                <Box sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.grey[300]}`,
                  '& iframe': {
                    width: '100%',
                    height: { xs: '300px', md: '450px' },
                    border: 0
                  }
                }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5942044923677!2d109.19268197506148!3d12.071417288167309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31708bff67aac6b7%3A0xd15bf6357e2930a3!2sAlma%20Resort%20Cam%20Ranh!5e0!3m2!1sen!2sus!4v1756786279316!5m2!1sen!2sus"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Alma Resort - Cam Ranh, Vietnam"
                  />
                </Box>
              </Box>

              {/* More details coming soon */}
              <Box sx={{
                mt: 6,
                p: 4,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 3,
                textAlign: 'center',
                border: `1px solid ${theme.palette.grey[200]}`
              }}>
                <Typography variant="body1" sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                  lineHeight: 1.8
                }}>
                  More details coming soon — including the full guest guide, accommodation recommendations, and FAQ.
                </Typography>
              </Box>
            </Box>
          </section>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
