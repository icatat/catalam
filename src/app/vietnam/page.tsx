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
import { RSVPFormData, NewGuestCreated } from '@/types/wedding';
import { useRSVPHandler } from '@/lib/useRSVPHandler';
import { WEDDING_INFO } from '@/lib/constants';
import CustomButton from '@/components/Button';

export default function VietnamWedding() {
  const theme = useTheme();
  const router = useRouter();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
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
      {/* Fixed Background Layer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(194, 225, 238, 0.15) 0%, rgba(194, 225, 238, 0.15) 25%, rgba(194, 225, 238, 0.2) 50%, rgba(194, 225, 238, 0.1) 75%, rgba(194, 225, 238, 0.15) 100%), url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          zIndex: -1
        }}
      />
      <Navigation currentPage="vietnam" showRomania={guestData?.romania} showVietnam={true} />
      <Container maxWidth="xl" sx={{ height: '100%', display: 'flow' }}>
        {/* Welcome Message */}
        <Box sx={{ 
          pt: { xs: 8, md: 10 }, 
          pb: 4, 
          textAlign: 'center'
        }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: '"Arizonia", cursive',
              color: theme.palette.primary.dark,
              fontWeight: 400,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            {guestData.has_rsvp_vietnam
              ? `Welcome back, ${guestData.first_name}! Your RSVP for Vietnam has been confirmed.`
              : `Welcome, ${guestData.first_name}! Please RSVP for our Vietnam wedding.`
            }
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
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none'
              }}
            >
              {guestData.has_rsvp_vietnam
                ? 'Update RSVP'
                : 'RSVP Now'
              }
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
                gap: 3
              }}>
                {/* Itinerary Card */}
                <Card
                  sx={{
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 3,
                    boxShadow: theme.shadows[2],
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardActionArea onClick={() => router.push('/vietnam/itinerary')}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography sx={{
                        fontFamily: '"Arizonia", cursive',
                        color: theme.palette.primary.dark,
                        fontSize: '2rem',
                        fontWeight: 400,
                        mb: 1
                      }}>
                        Itinerary
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Coming soon
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                {/* Details & FAQ Card */}
                <Card
                  sx={{
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 3,
                    boxShadow: theme.shadows[2],
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardActionArea onClick={() => router.push('/vietnam/details')}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography sx={{
                        fontFamily: '"Arizonia", cursive',
                        color: theme.palette.primary.dark,
                        fontSize: '2rem',
                        fontWeight: 400,
                        mb: 1
                      }}>
                        Details & FAQ
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Venue & Guest Guide
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