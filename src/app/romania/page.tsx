'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm, { RSVPFormData } from '@/components/RSVPForm';
import { WeddingItineraryFactory } from '@/models/Itinerary';
import { ItineraryDayData, RSVPSubmissionData, RSVPApiResponse, RSVPOption } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ScrollReveal, Parallax, ScrollProgress, Stagger } from '@/components/ui/scroll-reveal';

export default function RomaniaWedding() {
  const handleRSVP = async (data: RSVPFormData): Promise<void> => {
    console.log(data)
    try {
      const submissionData: RSVPSubmissionData = {
        ...data,
        wedding: 'romania',
        timestamp: new Date().toISOString()
      };

      const res = await fetch('/api/server/backend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      
      const result: RSVPApiResponse = await res.json();
      
      if (result.success) {
        alert('Thank you for confirming! Mulțumim pentru confirmare!');
      } else {
        alert('Sorry, there was an error. Please try again. / Eroare - vă rugăm să încercați din nou!');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Sorry, there was an error submitting your RSVP. Please try again.');
    }
  };

  const romanianRsvpOptions: RSVPOption[] = [
    { value: 'yes', label: 'Da, I\'ll be there! (Yes)' },
    { value: 'no', label: 'Nu, I can\'t make it (No)' },
    { value: 'maybe', label: 'Poate (Maybe)' }
  ];

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
        title="RSVP for Romania Wedding / Confirmarea Presenței la nunta din România"
        subtitle="Please let us know if you'll be joining us for our special day in Romania"
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