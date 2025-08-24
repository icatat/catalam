'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm, { RSVPFormData } from '@/components/RSVPForm';
import { InviteVerification } from '@/components/InviteVerification';
import { WeddingItineraryFactory } from '@/models/Itinerary';
import { ItineraryDayData, RSVPOption } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ScrollReveal, Parallax, ScrollProgress, Stagger } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { Location, GuestData } from '@/models/RSVP';
import { sendRSVPConfirmationEmail, sendRSVPConfirmationEmailAsync } from '@/lib/emailUtils';


export default function RomaniaWedding() {
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
          if (data.location?.includes(Location.ROMANIA)) {
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
      if(formData.rsvp === 'true'  &&  guestData.rsvp.includes(Location.ROMANIA)) {
        // Send email for re-confirmation
        const result = await sendRSVPConfirmationEmail({
          name: formData.name || guestData.full_name,
          email: formData.email,
          attending: formData.rsvp === 'true',
          location: Location.ROMANIA
        });

        if (result.success) {
          alert(`Thank you for re-confirming your attendance! ${result.message}`);
        } else {
          alert(`Thank you for re-confirming your attendance! We will contact you soon.`);
        }
        return;
      }
      if (formData.rsvp ==='false' && guestData.rsvp.includes(Location.ROMANIA)) {
        // They previously accepted and changed their mind
        setGuestData({...guestData, rsvp: guestData.rsvp.filter(r => r !== Location.ROMANIA)})
      } else if (formData.rsvp === 'true' && !guestData.rsvp.includes(Location.ROMANIA)) {
        setGuestData({...guestData, rsvp: [...guestData.rsvp,Location.ROMANIA]})
      }

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_id: guestData.invite_id,
          name: formData.name || guestData.full_name,
          location: Location.ROMANIA,
          email: formData.email,
          phone: formData.phone,
          rsvp: guestData.rsvp,
          properties: {
            dietary_restrictions: formData.dietaryRestrictions,
            guests_count: formData.guestCount,
            special_message: formData.message,
          },
        }),
      });
      
      // Always send email confirmation regardless of database result
      const emailPromise = sendRSVPConfirmationEmailAsync({
        name: formData.name || guestData.full_name,
        email: formData.email,
        attending: formData.rsvp === 'true',
        location: Location.ROMANIA
      });

      response.json()
        .then(result => {
          if (result.success) {
            alert(`Thank you ${guestData.full_name} for confirming! Mulțumim pentru confirmare!`);
            
            // Process email confirmation
            return emailPromise;
          } else {
            alert('Sorry, there was an error. Please try again. / Eroare - vă rugăm să încercați din nou!');
            
            // Still send email even if database fails
            return emailPromise;
          }
        })
        .then(emailResponse => {
          return emailResponse.json();
        })
        .then(emailResult => {
          if (emailResult.success) {
            alert(`A confirmation email was sent to ${formData.email}`);
          } else {
            alert(`An error occurred when trying to send you a confirmation email to ${formData.email}. Please try again or contact Cata & Lam directly.`);
          }
        })
        .catch(error => {
          console.error('Error in promise chain:', error);
          alert(`An error occurred when trying to send you a confirmation email to ${formData.email}. Please try again or contact Cata & Lam directly.`);
        });
      
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Sorry, there was an error submitting your RSVP. Please try again.');
    }
  };

  const romanianRsvpOptions: RSVPOption[] = [
    { value: 'true', label: 'Da, I\'ll be there! (Yes)' },
    { value: 'false', label: 'Nu, I can\'t make it (No)' }
  ];

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  // Show invite verification if not verified
  if (!guestData) {
    return (
      <div className={cn("min-h-screen", themeClasses.gradientBg('primary'))}>
        <InviteVerification 
          location={Location.ROMANIA}
          onVerified={handleInviteVerified}
        />
      </div>
    );
  }

  // Create itinerary using the factory
  const itinerary = WeddingItineraryFactory.createRomanianWedding();
  const days: ItineraryDayData[] = itinerary.getDaysForComponent();

  return (
    <>
      <ScrollProgress />
      <div className={cn("min-h-screen", themeClasses.gradientBg('primary'))}>
        <Navigation currentPage="romania" />
      
        <HeroSection
          title="Romania Wedding Celebration"
          date="September 11th, 2026 - September 12th, 2026"
          subtitle="11 Septembrie 2026 - 12 Septembrie 2026"
          location="Oradea, Romania"
          backgroundImage="/photo_3.png"
        />

        {/* Itinerary Section */}
        <section className={cn("bg-white", themeClasses.section('base'))}>
          <div className={themeClasses.container()}>
            <ScrollReveal direction="up">
              <h2 className={cn(themeClasses.heading('h2', 'primary'), 'mb-8 text-center')}>
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
                      variant={index % 2 === 0 ? 'primary' : 'secondary'}
                    />
                  </Parallax>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        <ScrollReveal direction="up" delay={0.2}>
          <RSVPForm
            title={`RSVP for Romania Wedding / Confirmarea Presenței la nunta din România`}
            subtitle={`Welcome ${guestData.full_name}! Please let us know if you'll be joining us for our special day in Romania`}
            onSubmit={handleRSVP}
            rsvpOptions={romanianRsvpOptions}
            placeholderMessage="Mesaj pentru cuplul ... (Special message for the happy couple...)"
            variant="accent"
            submitText="Submit RSVP / Trimite Răspunsul"
          />
        </ScrollReveal>
      </div>
    </>
  );
}