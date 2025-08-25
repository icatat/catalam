'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPModal from '@/components/RSVPModal';
import RSVPConfirmation from '@/components/RSVPConfirmation';
import { InviteVerification } from '@/components/InviteVerification';
import { RSVPFormData } from '@/types/wedding';
import { ItineraryDayData } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import CustomButton from '@/components/Button';
import { ScrollReveal, Parallax, ScrollProgress, Stagger } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { useTheme, Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Location, GuestData } from '@/models/RSVP';
import { 
  handleReconfirmation, 
  updateGuestRSVPStatus, 
  submitRSVP, 
  createEmailPromise,
  RSVPHandlerOptions 
} from '@/lib/rsvpUtils';
import { WEDDING_INFO, LOCATION_THEME, MESSAGES } from '@/lib/constants';

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
  const locationTheme = LOCATION_THEME[location];
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

      // Update guest RSVP status
      updateGuestRSVPStatus(options);

      // Submit RSVP
      await submitRSVP(options);

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
          <p className={themeClasses.body('base', 'secondary')}>{t('wedding.verification.loading')}</p>
        </div>
      </div>
    );
  }

  // Invite verification
  if (!guestData) {
    return (
      <div className={cn("min-h-screen", themeClasses.gradientBg(locationTheme.gradientBg))}>
        <InviteVerification 
          location={location}
          onVerified={handleInviteVerified}
        />
      </div>
    );
  }

  // Create itinerary with translations
  const days: ItineraryDayData[] = isRomania ? [
    {
      title: t('itinerary.romania.day1.title'),
      subtitle: t('itinerary.romania.day1.subtitle'),
      events: [
        {
          time: '6:00 PM',
          title: t('itinerary.romania.day1.welcome.title'),
          location: t('itinerary.romania.day1.welcome.location'),
          description: t('itinerary.romania.day1.welcome.description')
        }
      ]
    },
    {
      title: t('itinerary.romania.day2.title'),
      subtitle: t('itinerary.romania.day2.subtitle'),
      events: [
        {
          time: '3:00 PM',
          title: t('itinerary.romania.day2.civil.title'),
          location: t('itinerary.romania.day2.civil.location'),
          description: t('itinerary.romania.day2.civil.description')
        },
        {
          time: '6:00 PM',
          title: t('itinerary.romania.day2.celebration.title'),
          location: t('itinerary.romania.day2.celebration.location'),
          description: t('itinerary.romania.day2.celebration.description')
        }
      ]
    }
  ] : [
    {
      title: t('itinerary.vietnam.day1.title'),
      subtitle: t('itinerary.vietnam.day1.subtitle'),
      events: [
        {
          time: '10:00 AM',
          title: t('itinerary.vietnam.day1.ceremony.title'),
          location: t('itinerary.vietnam.day1.ceremony.location'),
          description: t('itinerary.vietnam.day1.ceremony.description')
        },
        {
          time: '6:00 PM',
          title: t('itinerary.vietnam.day1.reception.title'),
          location: t('itinerary.vietnam.day1.reception.location'),
          description: t('itinerary.vietnam.day1.reception.description')
        }
      ]
    },
    {
      title: t('itinerary.vietnam.day2.title'),
      subtitle: t('itinerary.vietnam.day2.subtitle'),
      events: [
        {
          time: '10:00 AM',
          title: t('itinerary.vietnam.day2.activities.title'),
          location: t('itinerary.vietnam.day2.activities.location'),
          description: t('itinerary.vietnam.day2.activities.description')
        }
      ]
    }
  ];

  return (
    <>
      <ScrollProgress />
      <div className={cn("min-h-screen", themeClasses.gradientBg(locationTheme.gradientBg))}>
        <Navigation currentPage={isRomania ? "romania" : "vietnam"} />
      
        <HeroSection
          title={t('wedding.hero.title', { location: weddingInfo.name })}
          date={weddingInfo.date}
          subtitle={weddingInfo.subtitle}
          location={weddingInfo.location}
          backgroundImage={weddingInfo.heroImage}
        />

        {/* Itinerary Section */}
        <section className={cn(themeClasses.card('base'), themeClasses.section('base'))}>
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
        </section>

        {/* RSVP Section */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className={themeClasses.section('base')}>
            <div className={themeClasses.container()}>
              <div className={cn("max-w-2xl mx-auto text-center", themeClasses.card('base'))}>
                <h2 className={cn(themeClasses.heading('h2', locationTheme.variant), 'mb-4')}>
                  {t('rsvp.title', { location: locationName })}
                </h2>
                
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4, textAlign: 'center' }}>
                  {t('rsvp.modal.welcome', { name: guestData.full_name })}
                </Typography>

                {/* RSVP Status */}
                {guestData.rsvp.includes(location) ? (
                  <Card sx={{ bgcolor: theme.palette.success.light + '20', border: `1px solid ${theme.palette.success.main}40`, mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32, mr: 2 }}>
                          <CheckCircle sx={{ fontSize: '1rem', color: 'white' }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: theme.palette.success.dark, fontWeight: 600 }}>
                          {t('rsvp.already.title')}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: theme.palette.success.dark, mb: 2, textAlign: 'center' }}>
                        {t('rsvp.already.message', { location: locationName })}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CustomButton
                          onClick={() => setShowRSVPModal(true)}
                          variant="outlined"
                          size="medium"
                          sx={{ 
                            borderColor: theme.palette.success.main,
                            color: theme.palette.success.dark,
                            '&:hover': {
                              backgroundColor: theme.palette.success.light + '20',
                              borderColor: theme.palette.success.dark
                            }
                          }}
                        >
                          {t('common.modify')}
                        </CustomButton>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Card sx={{ bgcolor: theme.palette.grey[50], border: `1px solid ${theme.palette.grey[200]}`, mb: 3 }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1, fontWeight: 600 }}>
                        {t('rsvp.please.title')}
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        {t('rsvp.please.message', { location: locationName })}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* RSVP Button */}
                <CustomButton
                  onClick={() => setShowRSVPModal(true)}
                  size="large"
                  variant="contained"
                  weddingVariant={locationTheme.variant === 'primary' ? 'romania' : 'vietnam'}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.125rem',
                  }}
                >
                  {guestData.rsvp.includes(location) 
                    ? t('rsvp.button.update')
                    : t('rsvp.button.now')
                  }
                </CustomButton>

                <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 2, textAlign: 'center' }}>
                  {t('questions.text')}
                </Typography>
              </div>
            </div>
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
            variant={locationTheme.variant}
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
            variant={locationTheme.variant}
            emailSent={confirmationData.emailSent}
          />
        )}
      </div>
    </>
  );
}