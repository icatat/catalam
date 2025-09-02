'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';

import RSVPModal from '@/components/RSVPModal';
import RSVPConfirmation from '@/components/RSVPConfirmation';
import { InviteVerification } from '@/components/InviteVerification';
import { RSVPFormData } from '@/types/wedding';
import { useLanguage } from '@/contexts/LanguageContext';
import CustomButton from '@/components/Button';
import { ScrollReveal, ScrollProgress } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { useTheme, Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Location, GuestData } from '@/models/RSVP';
import { 
  handleReconfirmation, 
  submitRSVP, 
  createEmailPromise,
  RSVPHandlerOptions 
} from '@/lib/rsvpUtils';
import { WEDDING_INFO, MESSAGES } from '@/lib/constants';

interface WeddingPageProps {
  location: Location;
}

export default function WeddingPageLayout({ location }: WeddingPageProps) {
  const { t } = useLanguage();
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

  const weddingInfo = WEDDING_INFO[location];
  const isRomania = location === Location.ROMANIA;
  const locationName = isRomania ? 'Romania' : 'Vietnam';

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
      
      // Check if this is a re-confirmation
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

      // Submit RSVP
      const rsvpResponse = await submitRSVP(options);
      const rsvpResult = await rsvpResponse.json();

      if (rsvpResult.success) {
        // Refetch guest data from database to get updated RSVP status
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

      // Create email promise
      const emailPromise = createEmailPromise({
        name: formData.name || guestData.full_name,
        email: formData.email,
        attending: formData.rsvp === 'true',
        location
      });

      // Show confirmation immediately
      setConfirmationData({
        attending: formData.rsvp === 'true',
        email: formData.email,
        emailSent: false
      });
      setShowConfirmation(true);

      // Handle email in background
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
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>{t('wedding.verification.loading')}</Typography>
        </div>
      </div>
    );
  }

  // Invite verification
  if (!guestData) {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.palette.primary.light}45 0%, ${theme.palette.primary.light}40 25%, ${theme.palette.primary.light}50 50%, ${theme.palette.primary.main}20 75%, ${theme.palette.primary.light}30 100%), url(/landmarks.png)`, backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
        <InviteVerification 
          location={location}
          onVerified={handleInviteVerified}
        />
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/landmarks.png)`, backgroundRepeat: 'repeat', backgroundSize: 'auto' }}>
        <Navigation currentPage={isRomania ? "romania" : "vietnam"} />
      
        {/* Personalized Welcome Section */}
        {guestData && (
          <Box sx={{ 
            pt: { xs: 8, md: 10 }, 
            pb: 12, 
            px: 3,
            textAlign: 'center',
            position: 'relative',
            backgroundImage: `url(${weddingInfo.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: { xs: 0, md: 4 },
            mx: { xs: 0, md: 4 },
            mt: { xs: 0, md: 3 },
            boxShadow: { xs: 'none', md: theme.shadows[6] },
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              zIndex: 1
            },
            '& > *': {
              position: 'relative',
              zIndex: 2
            }
          }}>
            {/* Personalized Message */}
            {guestData.rsvp.includes(location) ? (
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  mb: 3,
                  maxWidth: '900px',
                  mx: 'auto',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  lineHeight: 1.2
                }}
              >
                {t('wedding.welcome.confirmed', { 
                  name: guestData.full_name.split(' ')[0],
                  location: locationName 
                })}
              </Typography>
            ) : (
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  mb: 3,
                  maxWidth: '900px',
                  mx: 'auto',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  lineHeight: 1.2
                }}
              >
                {t('wedding.welcome.pending', { 
                  name: guestData.full_name.split(' ')[0],
                  location: locationName 
                })}
              </Typography>
            )}

            <Typography 
              variant="h5" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 5,
                fontWeight: 500,
                maxWidth: '700px',
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                opacity: 0.8
              }}
            >
              {weddingInfo.date} • {weddingInfo.location}
            </Typography>

            {/* RSVP/Update Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              {guestData.rsvp.includes(location) && (
                <CheckCircle 
                  sx={{ 
                    color: theme.palette.success.main, 
                    fontSize: '1.5rem' 
                  }} 
                />
              )}
              <CustomButton
                onClick={() => setShowRSVPModal(true)}
                variant={guestData.rsvp.includes(location) ? "text" : "contained"}
                size={guestData.rsvp.includes(location) ? "medium" : "large"}
                sx={guestData.rsvp.includes(location) ? {
                  // Subtle styling for confirmed users
                  px: 3,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  borderRadius: 2,
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                } : {
                  // Prominent styling for non-confirmed users
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
                  ? t('rsvp.button.update')
                  : t('rsvp.button.now')
                }
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* Fallback for non-verified guests */}
        {!guestData && (
          <HeroSection
            title={t('wedding.hero.title', { location: weddingInfo.name })}
            date={weddingInfo.date}
            subtitle={weddingInfo.subtitle}
            location={weddingInfo.location}
            backgroundImage={weddingInfo.heroImage}
          />
        )}

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
                {t('wedding.location.title')}
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
                    {isRomania ? 'Oradea, Romania' : 'Cam Ranh, Vietnam'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: theme.palette.text.secondary, 
                    mb: 3, 
                    lineHeight: 1.7 
                  }}>
                    {isRomania ? 
                      'Join us in the beautiful city of Oradea for our Romanian wedding celebration. Known for its stunning architecture and rich cultural heritage, Oradea provides the perfect backdrop for our special day.' :
                      'Celebrate with us in vibrant Cam Ranh for our Vietnamese wedding ceremony. This bustling metropolis, rich in history and tradition, will host our joyous celebration.'
                    }
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
                      {t('wedding.venue.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                      {t('wedding.venue.tbd')}
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
                  {isRomania ? (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2716.889008262144!2d22.072338490107096!3d47.0816401496941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474637651b7f20c1%3A0x9e1984228909fcf2!2sCamelot%20Resort!5e0!3m2!1sen!2sus!4v1756786599009!5m2!1sen!2sus"
                      allowFullScreen
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Camelot Resort - Oradea, Romania"
                    />
                  ) : (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.5942044923677!2d109.19268197506148!3d12.071417288167309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31708bff67aac6b7%3A0xd15bf6357e2930a3!2sAlma%20Resort%20Cam%20Ranh!5e0!3m2!1sen!2sus!4v1756786279316!5m2!1sen!2sus"
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Alma Resort - Cam Ranh, Vietnam"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </section>
        </ScrollReveal>


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
      </div>
    </>
  );
}