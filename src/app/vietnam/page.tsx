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

export default function VietnamWedding() {
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Check if we have a valid invite_id in cookies
    const savedInviteId = Cookies.get('invite_id');
    if (savedInviteId) {
      // Verify the saved invite_id is still valid
      fetch('/api/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_id: savedInviteId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.location?.includes(Location.VIETNAM)) {
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
          // If verification fails, clear the cookie and show verification screen
          Cookies.remove('invite_id');
          setIsVerifying(false);
        });
    } else {
      setIsVerifying(false);
    }
  }, []);

  const handleInviteVerified = (data: GuestData) => {
    setGuestData(data);
  };

  const handleRSVP = async (formData: RSVPFormData): Promise<void> => {
    if (!guestData) return;

    try {
      if(formData.rsvp  &&  !guestData.rsvp.includes(Location.VIETNAM)) {
        alert(`Thank you for re-confirming your attendance! Thank you ${guestData.full_name} for your RSVP! We will contact you soon.`)
        return;
      }
      if (formData.rsvp ==='false' && guestData.rsvp.includes(Location.VIETNAM)) {
        // They previously accepted and changed their mind
        setGuestData({...guestData, rsvp: guestData.rsvp.filter(r => r !== Location.VIETNAM)})
      } else if (formData.rsvp === 'true' && !guestData.rsvp.includes(Location.VIETNAM)) {
        setGuestData({...guestData, rsvp: [...guestData.rsvp,Location.VIETNAM]})
      }
     
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_id: guestData.invite_id,
          name: formData.name || guestData.full_name,
          location: Location.VIETNAM,
          email: [formData.email],
          phone: [formData.phone],
          rsvp: guestData.rsvp,
          properties: {
            dietary_restrictions: formData.dietaryRestrictions,
            guests_count: formData.guestCount,
            special_message: formData.message,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Thank you ${guestData.full_name} for your RSVP! We will contact you soon.`);
      } else {
        alert('Sorry, there was an error submitting your RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Sorry, there was an error submitting your RSVP. Please try again.');
    }
  };

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  // Show invite verification if not verified
  if (!guestData) {
    return (
      <div className={cn("min-h-screen", themeClasses.gradientBg('secondary'))}>
        <InviteVerification 
          location={Location.VIETNAM}
          onVerified={handleInviteVerified}
        />
      </div>
    );
  }

  // Create itinerary using the factory
  const itinerary = WeddingItineraryFactory.createVietnameseWedding();
  const days: ItineraryDayData[] = itinerary.getDaysForComponent();

  return (
    <>
      <ScrollProgress />
      <div className={cn("min-h-screen", themeClasses.gradientBg('secondary'))}>
        <Navigation currentPage="vietnam" />
      
        <HeroSection
          title="Vietnam Wedding Celebration"
          subtitle="Join us for a traditional Vietnamese wedding ceremony in the heart of Vietnam"
          date="September 26th, 2026"
          location="Hanoi, Vietnam"
          backgroundImage="/photo_0.png"
        />

        {/* Itinerary Section */}
        <section className={cn("bg-white", themeClasses.section('base'))}>
          <div className={themeClasses.container()}>
            <ScrollReveal direction="up">
              <h2 className={cn(themeClasses.heading('h2', 'primary'), 'mb-12 text-center')}>
                {itinerary.title}
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
                      variant={index % 2 === 0 ? 'secondary' : 'accent'}
                    />
                  </Parallax>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        <ScrollReveal direction="up" delay={0.2}>
          <RSVPForm
            title="RSVP for Vietnam Wedding"
            subtitle={`Welcome ${guestData.full_name}! Please let us know if you'll be joining us for our special day in Vietnam`}
            onSubmit={handleRSVP}
            variant="secondary"
          />
        </ScrollReveal>
      </div>
    </>
  );
}