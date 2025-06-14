'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm, { RSVPFormData } from '@/components/RSVPForm';
import { WeddingItineraryFactory } from '@/models/Itinerary';
import { ItineraryDayData, RSVPSubmissionData, RSVPApiResponse } from '@/types/wedding';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation currentPage="vietnam" />
      
      <HeroSection
        title="Vietnam Wedding Celebration"
        subtitle="Join us for a traditional Vietnamese wedding ceremony in the heart of Vietnam"
        date="September 26th, 2026"
        location="Hanoi, Vietnam"
        backgroundImage="/photo_0.png"
      />

      {/* Itinerary Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-slate-800 mb-12 text-center">{itinerary.title}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {days.map((day, index) => (
              <ItineraryDay
                key={index}
                title={day.title}
                subtitle={day.subtitle}
                events={day.events}
                bgColor={day.bgColor}
                timeColor={day.timeColor}
              />
            ))}
          </div>
        </div>
      </div>

      <RSVPForm
        title="RSVP for Vietnam Wedding"
        subtitle="Please let us know if you'll be joining us for our special day in Vietnam"
        onSubmit={handleRSVP}
        bgColor="from-blue-50 to-blue-100"
      />
    </div>
  );
}