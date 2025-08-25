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
import MuiButton from '@/components/MuiButton';
import { ScrollReveal, Parallax, ScrollProgress, Stagger } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
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
  const theme = LOCATION_THEME[location];
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
          <div className={cn(
            "animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4",
            isRomania ? "border-rose-500" : "border-emerald-500"
          )}></div>
          <p className={themeClasses.body('base', 'secondary')}>{t('wedding.verification.loading')}</p>
        </div>
      </div>
    );
  }

  // Invite verification
  if (!guestData) {
    return (
      <div className={cn("min-h-screen", themeClasses.gradientBg(theme.gradientBg))}>
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
      bgColor: 'from-slate-50 to-slate-100',
      timeColor: 'bg-slate-700',
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
      bgColor: 'from-blue-50 to-blue-100',
      timeColor: 'bg-blue-500',
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
      bgColor: 'from-blue-50 to-blue-100',
      timeColor: 'bg-blue-500',
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
      bgColor: 'from-slate-50 to-slate-100',
      timeColor: 'bg-slate-500',
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
      <div className={cn("min-h-screen", themeClasses.gradientBg(theme.gradientBg))}>
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
              <h2 className={cn(themeClasses.heading('h2', theme.variant), 'mb-8 text-center')}>
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
                      variant={index % 2 === 0 ? theme.variant : 'secondary'}
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
                <h2 className={cn(themeClasses.heading('h2', theme.variant), 'mb-4')}>
                  {t('rsvp.title', { location: locationName })}
                </h2>
                
                <p className={cn(themeClasses.body('large'), 'text-gray-700 mb-8')}>
                  {t('rsvp.modal.welcome', { name: guestData.full_name })}
                </p>

                {/* RSVP Status */}
                {guestData.rsvp.includes(location) ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <h3 className={cn(themeClasses.heading('h4', 'primary'), 'text-green-800')}>
                        {t('rsvp.already.title')}
                      </h3>
                    </div>
                    <p className={cn(themeClasses.body('base'), 'text-green-700 mb-4')}>
                      {t('rsvp.already.message', { location: locationName })}
                    </p>
                    <MuiButton
                      onClick={() => setShowRSVPModal(true)}
                      variant="outlined"
                      size="medium"
                      sx={{ 
                        borderColor: '#10b981',
                        color: '#047857',
                        '&:hover': {
                          backgroundColor: '#f0fdf4',
                          borderColor: '#059669'
                        }
                      }}
                    >
                      {t('common.modify')}
                    </MuiButton>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className={cn(themeClasses.heading('h4', 'secondary'), 'text-gray-700 mb-2')}>
                      {t('rsvp.please.title')}
                    </h3>
                    <p className={cn(themeClasses.body('base'), 'text-gray-600 mb-4')}>
                      {t('rsvp.please.message', { location: locationName })}
                    </p>
                  </div>
                )}

                {/* RSVP Button */}
                <MuiButton
                  onClick={() => setShowRSVPModal(true)}
                  size="large"
                  variant="contained"
                  weddingVariant={theme.variant === 'primary' ? 'romania' : 'vietnam'}
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
                </MuiButton>

                <p className={cn(themeClasses.body('small'), 'text-gray-500 mt-4')}>
                  {t('questions.text')}
                </p>
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
            variant={theme.variant}
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
            variant={theme.variant}
            emailSent={confirmationData.emailSent}
          />
        )}
      </div>
    </>
  );
}