'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Box, useTheme, Container, Typography, IconButton } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';
import { ItineraryDayData } from '@/types/wedding';
import ItineraryDayBanner from '@/components/ItineraryDayBanner';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import { isSubtitleRedundant } from '@/lib/itinerary';
import { ArrowLeft } from 'lucide-react';

export default function VietnamItinerary() {
  const theme = useTheme();
  const router = useRouter();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [days, setDays] = useState<ItineraryDayData[]>([]);

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
            invited_events: data.invited_events_vietnam,
            group_members: data.group_members || [],
          });
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

  useEffect(() => {
    fetch('/api/vietnam-timeline')
      .then(response => response.json())
      .then(data => {
        setDays(data.days || []);
      })
      .catch(error => {
        console.error('Error loading timeline:', error);
      });
  }, []);

  // Hide sub-events this guest isn't invited to. Non-'Event' itinerary items
  // (details, logistics) always show; `invited_events` null/undefined = all.
  const displayDays = useMemo(() => {
    const invited = guestData?.invited_events;
    if (!invited) return days;
    return days
      .map((day) => ({
        ...day,
        events: (day.events || []).filter(
          (e) => e.type !== 'Event' || invited.includes(e.title)
        ),
      }))
      .filter((day) => (day.events?.length ?? 0) > 0);
  }, [days, guestData?.invited_events]);

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
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: 'background.default' }}>
      {/* Subtle textured background — image only, no color overlay */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          opacity: 0.50,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Navigation currentPage="vietnam" showRomania={guestData?.romania} showVietnam={true} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ pt: { xs: 8, md: 10 }, pb: 2 }}>
          <IconButton
            onClick={() => router.push('/vietnam')}
            sx={{ color: theme.palette.primary.dark, mb: 2 }}
            aria-label="Back to Vietnam"
          >
            <ArrowLeft />
          </IconButton>
        </Box>

        <ScrollReveal direction="up" delay={0.1}>
          <section style={{ padding: theme.spacing(1, 0, 10, 0) }}>
            <Box sx={{ maxWidth: 820, mx: 'auto', px: { xs: 2, md: 3 } }}>
              <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    color: '#a8916b',
                    fontSize: '1.25rem',
                    letterSpacing: '0.4em',
                    mb: 2,
                  }}
                >
                  ·   ·   ·
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: '"Arizonia", cursive',
                    color: theme.palette.primary.dark,
                    fontWeight: 400,
                    fontSize: { xs: '3.5rem', md: '5rem' },
                    lineHeight: 1.05,
                    mb: 1.5,
                  }}
                >
                  Itinerary
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Thasadith", sans-serif',
                    color: '#8e645d',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.32em',
                  }}
                >
                  Cam Ranh, Vietnam
                </Typography>
              </Box>

              {displayDays.map((day, index) => {
                const displaySubtitle = isSubtitleRedundant(day.subtitle, day.events)
                  ? undefined
                  : day.subtitle;
                return (
                  <Box key={index} sx={{ mb: { xs: 5, md: 7 } }}>
                    <ItineraryDayBanner
                      date={day.date}
                      subtitle={displaySubtitle}
                      location={day.location}
                      locationUrl={day.locationUrl}
                    />
                    {day.events && day.events.length > 0 && (
                      <ItineraryTimeline events={day.events} />
                    )}
                  </Box>
                );
              })}
            </Box>
          </section>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
