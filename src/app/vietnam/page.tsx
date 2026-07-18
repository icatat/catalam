'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { MainPageCard } from '@/components/MainPageCard';
import RSVPModal from '@/components/RSVPModal';
import RSVPConfirmation from '@/components/RSVPConfirmation';
import { Box, useTheme, Container, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { Location, GuestData } from '@/models/RSVP';
import { ItineraryEvent } from '@/types/wedding';
import { useRSVPHandler } from '@/lib/useRSVPHandler';
import { WEDDING_INFO } from '@/lib/constants';
import CustomButton from '@/components/Button';

export default function VietnamWedding() {
  const theme = useTheme();
  const router = useRouter();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [rsvpableEvents, setRsvpableEvents] = useState<ItineraryEvent[]>([]);
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  const location = Location.VIETNAM;
  const weddingInfo = WEDDING_INFO[location];
  const { handleRSVP, confirmationData, showConfirmation, setShowConfirmation } = useRSVPHandler(
    guestData,
    location,
    (data) => setGuestData(data)
  );

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (!savedInviteId) {
      router.push('/');
      return;
    }

    fetch('/api/vietnam-timeline')
      .then(r => r.json())
      .then(data => {
        const allEvents = (data.days || []).flatMap((d: { date?: string; events?: ItineraryEvent[] }) =>
          (d.events || []).map((e: ItineraryEvent) => ({ ...e, date: d.date }))
        );
        setRsvpableEvents(allEvents.filter((e: ItineraryEvent) => e.type === 'Event'));
      })
      .catch(() => {});

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
  }, [location, router]);

  // Loading state
  if (isVerifying || !guestData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Box
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            sx={{
              borderBottom: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Loading...</Typography>
        </div>
      </div>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Subtle textured background — image only */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          opacity: 0.5,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <Navigation currentPage="vietnam" showRomania={guestData?.romania} showVietnam={true} />
      <Container maxWidth="xl" sx={{ height: '100%', display: 'flow' }}>
        {/* Hero */}
        <Box sx={{
          pt: { xs: 8, md: 10 },
          pb: 4,
          textAlign: 'center'
        }}>
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
              mb: 1.5,
              fontSize: { xs: '3.5rem', md: '5rem' },
              lineHeight: 1.05,
            }}
          >
            Vietnam
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Thasadith", sans-serif',
              color: '#8e645d',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
              mb: 2,
            }}
          >
            {guestData.has_rsvp_vietnam ? 'Your RSVP is confirmed' : `Welcome, ${guestData.first_name}`}
          </Typography>
        </Box>
        
        {/* Centered Polaroid Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            pb: 6
          }}
        >
          {/* Vietnam Polaroid with location/date */}
          <MainPageCard
            polaroid={true}
            imageSrc="/photo_0.webp"
            alt="Vietnam Wedding Photo"
            animationDelay={0.1}
            bottomContent={
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#333',
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  {weddingInfo.location}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666',
                    fontWeight: 400
                  }}
                >
                  {weddingInfo.date}
                </Typography>
              </Box>
            }
          />
          
          {/* RSVP Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CustomButton
              onClick={() => setShowRSVPModal(true)}
              variant={guestData.has_rsvp_vietnam ? "outlined" : "contained"}
              size="large"
              sx={{ px: 5, py: 1.5 }}
            >
              {guestData.has_rsvp_vietnam ? 'Update RSVP' : 'RSVP'}
            </CustomButton>
          </Box>
        </Box>

        {/* Navigation Cards */}
        <ScrollReveal direction="up" delay={0.1}>
          <section style={{ padding: theme.spacing(4, 0, 8, 0) }}>
            <Box sx={{ maxWidth: '900px', mx: 'auto', px: 2 }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2.5, md: 3 }
              }}>
                {/* Itinerary Card */}
                <Card sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
                  <CardActionArea onClick={() => router.push('/vietnam/itinerary')}>
                    <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          color: theme.palette.primary.dark,
                          fontSize: '1.75rem',
                          fontWeight: 500,
                          mb: 0.75,
                          letterSpacing: '-0.005em',
                        }}
                      >
                        Itinerary
                      </Typography>
                      <Typography
                        sx={{
                          color: '#8e645d',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3em',
                        }}
                      >
                        The schedule
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Details & FAQ Card */}
                <Card sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
                  <CardActionArea onClick={() => router.push('/vietnam/details')}>
                    <CardContent sx={{ p: { xs: 4, md: 5 }, textAlign: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          color: theme.palette.primary.dark,
                          fontSize: '1.75rem',
                          fontWeight: 500,
                          mb: 0.75,
                          letterSpacing: '-0.005em',
                        }}
                      >
                        Details &amp; FAQ
                      </Typography>
                      <Typography
                        sx={{
                          color: '#8e645d',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3em',
                        }}
                      >
                        Venue &amp; Guide
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            </Box>
          </section>
        </ScrollReveal>
      </Container>

      {/* RSVP Modal */}
      {guestData && (
        <RSVPModal
          isOpen={showRSVPModal}
          onClose={() => setShowRSVPModal(false)}
          onSubmit={handleRSVP}
          guestData={guestData}
          location={location}
          variant="primary"
          rsvpableEvents={rsvpableEvents}
        />
      )}

      {/* RSVP Confirmation */}
      {guestData && (
        <RSVPConfirmation
          isVisible={showConfirmation}
          attending={confirmationData.attending}
          guestName={`${guestData.first_name} ${guestData.last_name}`}
          email={confirmationData.email}
          location={location}
          onModify={() => {
            setShowConfirmation(false);
            setShowRSVPModal(true);
          }}
          onClose={() => setShowConfirmation(false)}
          variant="primary"
          emailSent={confirmationData.emailSent}
        />
      )}
    </Box>
  );
}