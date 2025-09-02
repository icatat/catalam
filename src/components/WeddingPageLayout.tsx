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
            pt: { xs: 12, md: 16 }, 
            pb: 8, 
            px: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: { xs: 0, md: 4 },
            mx: { xs: 0, md: 4 },
            mt: { xs: 0, md: 3 },
            boxShadow: { xs: 'none', md: theme.shadows[6] },
            border: `1px solid rgba(255, 255, 255, 0.9)`
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

            {/* Subtle RSVP/Update Button */}
            <CustomButton
              onClick={() => setShowRSVPModal(true)}
              variant={guestData.rsvp.includes(location) ? "outlined" : "contained"}
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 400,
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

        {/* Itinerary Section */}
        {/* <section className={cn(themeClasses.card('base'), themeClasses.section('base'))}>
          <div className={themeClasses.container()}>
            <ScrollReveal direction="up">
              <h2 className={cn(themeClasses.heading('h2', locationTheme.variant), 'mb-8 text-center')}>
                {t('wedding.itinerary.title')}
              </h2>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Stagger staggerDelay={0.3}>
                {days.map((day, index) => (
                  <Parallax key={index} offset={index % 2 === 0 ? 20 : -20}>
                    <ItineraryDay
                      title={day.title}
                      subtitle={day.subtitle}
                      events={day.events}
                      variant={index % 2 === 0 ? locationTheme.variant : 'secondary'}
                    />
                  </Parallax>
                ))}
              </Stagger>
            </div>
          </div>
        </section> */}

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
                {t('wedding.location.title') || `${locationName} Venue`}
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d173904.50690078692!2d21.625633020176004!3d47.074405555680805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474647e368762353%3A0x1b55a486d65d5344!2sOradea%2C%20Romania!5e0!3m2!1sen!2sus!4v1756700652208!5m2!1sen!2sus" 
                      allowFullScreen
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Oradea, Romania Location"
                    />
                  ) : (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d501725.3182740997!2d106.36831087319508!3d10.755292866990637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1756700700000!5m2!1sen!2sus"
                      allowFullScreen
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Cam Ranh, Vietnam Location"
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