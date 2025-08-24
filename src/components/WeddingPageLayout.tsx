'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm, { RSVPFormData } from '@/components/RSVPForm';
import { InviteVerification } from '@/components/InviteVerification';
import { WeddingItineraryFactory } from '@/models/Itinerary';
import { ItineraryDayData } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ScrollReveal, Parallax, ScrollProgress, Stagger } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { Location, GuestData } from '@/models/RSVP';
import { 
  handleReconfirmation, 
  updateGuestRSVPStatus, 
  submitRSVP, 
  handleRSVPPromiseChain,
  createEmailPromise,
  RSVPHandlerOptions 
} from '@/lib/rsvpUtils';
import { WEDDING_INFO, LOCATION_THEME, ROMANIAN_RSVP_OPTIONS, MESSAGES } from '@/lib/constants';

interface WeddingPageProps {
  location: Location;
}

export default function WeddingPageLayout({ location }: WeddingPageProps) {
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const weddingInfo = WEDDING_INFO[location];
  const theme = LOCATION_THEME[location];
  const isRomania = location === Location.ROMANIA;

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
      if (isReconfirmation) return;

      // Update guest RSVP status
      updateGuestRSVPStatus(options);

      // Submit RSVP and prepare email
      const response = await submitRSVP(options);
      const emailPromise = createEmailPromise({
        name: formData.name || guestData.full_name,
        email: formData.email,
        attending: formData.rsvp === 'true',
        location
      });

      // Handle promise chain
      handleRSVPPromiseChain(response, emailPromise, guestData, formData, location);
      
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
          <p className={themeClasses.body('base', 'secondary')}>{MESSAGES.VERIFICATION_LOADING}</p>
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

  // Create itinerary
  const itinerary = isRomania 
    ? WeddingItineraryFactory.createRomanianWedding()
    : WeddingItineraryFactory.createVietnameseWedding();
  const days: ItineraryDayData[] = itinerary.getDaysForComponent();

  return (
    <>
      <ScrollProgress />
      <div className={cn("min-h-screen", themeClasses.gradientBg(theme.gradientBg))}>
        <Navigation currentPage={isRomania ? "romania" : "vietnam"} />
      
        <HeroSection
          title={`${weddingInfo.name} Wedding Celebration`}
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
                {itinerary.title}
              </h2>
              {itinerary.subtitle && (
                <h3 className={cn(themeClasses.heading('h4', 'secondary'), 'mb-12 text-center italic')}>
                  {itinerary.subtitle}
                </h3>
              )}
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

        <ScrollReveal direction="up" delay={0.2}>
          <RSVPForm
            title={isRomania 
              ? `RSVP for Romania Wedding / Confirmarea Presenței la nunta din România`
              : `RSVP for Vietnam Wedding`
            }
            subtitle={`Welcome ${guestData.full_name}! Please let us know if you'll be joining us for our special day in ${weddingInfo.name}`}
            onSubmit={handleRSVP}
            rsvpOptions={isRomania ? ROMANIAN_RSVP_OPTIONS : undefined}
            placeholderMessage={isRomania 
              ? "Mesaj pentru cuplul ... (Special message for the happy couple...)"
              : undefined
            }
            variant={theme.rsvpVariant}
            submitText={isRomania 
              ? "Submit RSVP / Trimite Răspunsul"
              : undefined
            }
          />
        </ScrollReveal>
      </div>
    </>
  );
}