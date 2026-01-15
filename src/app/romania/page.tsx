'use client';

import { useState, useEffect } from 'react';
import { NavigationButton } from '@/components/NavigationButton';
import { MainPageCard } from '@/components/MainPageCard';
import RSVPModal from '@/components/RSVPModal';
import RSVPConfirmation from '@/components/RSVPConfirmation';
import { InviteVerification } from '@/components/InviteVerification';
import { Box, useTheme, Container, Typography } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { Location, GuestData } from '@/models/RSVP';
import { RSVPFormData } from '@/types/wedding';
import { 
  handleReconfirmation, 
  submitRSVP, 
  createEmailPromise,
  RSVPHandlerOptions 
} from '@/lib/rsvpUtils';
import { WEDDING_INFO, MESSAGES } from '@/lib/constants';
import CustomButton from '@/components/Button';

export default function RomaniaWedding() {
  const theme = useTheme();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    attending: boolean;
    email: string;
    emailSent: boolean;
  }>({ attending: false, email: '', emailSent: false });

  const location = Location.ROMANIA;
  const weddingInfo = WEDDING_INFO[location];

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (savedInviteId) {
      fetch('/api/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_id: savedInviteId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.location?.includes(location)) {
            setGuestData({
              invite_id: savedInviteId,
              full_name: data.full_name,
              location: data.location,
              rsvp: data.rsvp || []
            });
          }
          setIsVerifying(false);
        })
        .catch(() => {
          Cookies.remove('invite_id');
          setIsVerifying(false);
        });
    } else {
      setIsVerifying(false);
    }
  }, [location]);

  const handleInviteVerified = (data: GuestData) => {
    setGuestData(data);
  };

  const handleRSVP = async (formData: RSVPFormData): Promise<void> => {
    if (!guestData) return;

    try {
      const options: RSVPHandlerOptions = { guestData, formData, location, setGuestData };
      
      const isReconfirmation = await handleReconfirmation(options);
      if (isReconfirmation) {
        setConfirmationData({
          attending: formData.rsvp === 'true',
          email: formData.email,
          emailSent: true
        });
        setShowConfirmation(true);
        return;
      }

      const rsvpResponse = await submitRSVP(options);
      const rsvpResult = await rsvpResponse.json();

      if (rsvpResult.success) {
        const updatedGuestResponse = await fetch('/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite_id: guestData.invite_id }),
        });
        const updatedGuestData = await updatedGuestResponse.json();
        setGuestData({
          invite_id: guestData.invite_id,
          full_name: updatedGuestData.full_name,
          location: updatedGuestData.location,
          rsvp: updatedGuestData.rsvp || []
        });
      }

      const emailPromise = createEmailPromise({
        name: formData.name || guestData.full_name,
        email: formData.email,
        attending: formData.rsvp === 'true',
        location
      });

      setConfirmationData({
        attending: formData.rsvp === 'true',
        email: formData.email,
        emailSent: false
      });
      setShowConfirmation(true);

      try {
        const emailResult = await emailPromise;
        const emailData = await emailResult.json();
        setConfirmationData(prev => ({
          ...prev,
          emailSent: emailData.success
        }));
      } catch (emailError) {
        console.error('Email error:', emailError);
        setConfirmationData(prev => ({
          ...prev,
          emailSent: false
        }));
      }
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert(MESSAGES.RSVP_ERROR(location));
    }
  };

  // Loading state
  if (isVerifying) {
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

  // Invite verification
  if (!guestData) {
    return (
      <div className="min-h-screen" style={{ 
        background: `linear-gradient(135deg, rgba(239, 217, 223, 0.15) 0%, rgba(239, 217, 223, 0.15) 25%, rgba(239, 217, 223, 0.2) 50%, rgba(239, 217, 223, 0.1) 75%, rgba(239, 217, 223, 0.15) 100%), url(/background-main.png)`, 
        backgroundRepeat: 'repeat', 
        backgroundSize: 'contain', 
        backgroundAttachment: 'fixed' 
      }}>
        <InviteVerification 
          location={location}
          onVerified={handleInviteVerified}
        />
      </div>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, rgba(239, 217, 223, 0.15) 0%, rgba(239, 217, 223, 0.15) 25%, rgba(239, 217, 223, 0.2) 50%, rgba(239, 217, 223, 0.1) 75%, rgba(239, 217, 223, 0.15) 100%), url(/background-main.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top-left NameHeader */}
      <Box sx={{ 
        position: 'absolute', 
        top: theme.spacing(2), 
        left: theme.spacing(2), 
        zIndex: theme.zIndex.appBar 
      }}>
        <MainPageCard
          sx={{
            border: 'none !important',
            boxShadow: 'none !important',
            backgroundColor: 'transparent !important',
            '&:hover': {
              transform: 'none !important',
              boxShadow: 'none !important',
            }
          }}
          imageSrc="/NameHeader.png"
          alt="Wedding Names"
        />
      </Box>

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
        <NavigationButton href="/contact">
          Contact
        </NavigationButton>

        <NavigationButton href="/">
          Home
        </NavigationButton>
      </Box>

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
              color: theme.palette.primary.dark,
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {guestData.rsvp.includes(location)
              ? `Welcome back, ${guestData.full_name.split(' ')[0]}! Your RSVP for Romania has been confirmed.`
              : `Welcome, ${guestData.full_name.split(' ')[0]}! Please RSVP for our Romania wedding.`
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
          {/* Romania Polaroid with location/date */}
          <MainPageCard
            polaroid={true}
            imageSrc="/photo_3.png"
            alt="Romania Wedding Photo"
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
              variant={guestData.rsvp.includes(location) ? "outlined" : "contained"}
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {guestData.rsvp.includes(location)
                ? 'Update RSVP'
                : 'RSVP Now'
              }
            </CustomButton>
          </Box>
        </Box>

        {/* Location/Venue Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <section style={{ padding: theme.spacing(8, 0) }}>
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
              <Typography variant="h2" component="h2" sx={{ 
                color: theme.palette.primary.main, 
                fontWeight: 700, 
                mb: 6, 
                textAlign: 'center' 
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
                  boxShadow: theme.shadows[4] 
                }}>
                  <Typography variant="h4" component="h3" sx={{ 
                    color: theme.palette.text.primary, 
                    fontWeight: 600, 
                    mb: 3 
                  }}>
                    Oradea, Romania
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: theme.palette.text.secondary, 
                    mb: 3, 
                    lineHeight: 1.7 
                  }}>
                    Join us in the beautiful city of Oradea for our Romanian wedding celebration. Known for its stunning architecture and rich cultural heritage, Oradea provides the perfect backdrop for our special day.
                  </Typography>
                  
                  {/* Venue Address */}
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: theme.palette.grey[50], 
                    borderRadius: 2, 
                    border: `1px solid ${theme.palette.grey[200]}` 
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
                  boxShadow: theme.shadows[8],
                  '& iframe': {
                    width: '100%',
                    height: { xs: '300px', md: '450px' },
                    border: 0
                  }
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2716.889008262144!2d22.072338490107096!3d47.0816401496941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474637651b7f20c1%3A0x9e1984228909fcf2!2sCamelot%20Resort!5e0!3m2!1sen!2sus!4v1756786599009!5m2!1sen!2sus"
                      allowFullScreen
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Camelot Resort - Oradea, Romania"
                      style={{ width: '100%', height: '300px', border: 0, borderRadius: '12px' }}
                    />
                  </Box>
                </Box>
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
          guestName={guestData.full_name}
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