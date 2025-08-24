'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm, { RSVPFormData } from '@/components/RSVPForm';
import { WeddingItineraryFactory } from '@/models/Itinerary';
import { ItineraryDayData, RSVPSubmissionData, RSVPApiResponse } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ScrollReveal, Parallax, ScrollProgress, Stagger } from '@/components/ui/scroll-reveal';

export default function VietnamWedding() {
  const handleRSVP = async (data: RSVPFormData): Promise<void> => {
    try {
      const submissionData: RSVPSubmissionData = {
        ...data,
        wedding: 'vietnam',
        timestamp: new Date().toISOString()
      };

      const res = await fetch('/api/server/backend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      
      const result: RSVPApiResponse = await res.json();
      
      if (result.success) {
        alert('Thank you for your RSVP! We will contact you soon.');
      } else {
        alert('Sorry, there was an error submitting your RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Sorry, there was an error submitting your RSVP. Please try again.');
    }
  };

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
            subtitle="Please let us know if you'll be joining us for our special day in Vietnam"
            onSubmit={handleRSVP}
            variant="secondary"
          />
        </ScrollReveal>
      </div>
    </>
  );
}