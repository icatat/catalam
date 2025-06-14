'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm, { RSVPFormData } from '@/components/RSVPForm';
import { WeddingItineraryFactory } from '@/models/Itinerary';
import { ItineraryDayData, RSVPSubmissionData, RSVPApiResponse, RSVPOption } from '@/types/wedding';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation currentPage="romania" />
      
      <HeroSection
        title="Romania Wedding Celebration"
        date="September 11th, 2026 - September 12th, 2026"
        subtitle="11 Septembrie 2026 - 12 Septembrie 2026"
        location="Oradea, Romania"
        backgroundImage="/photo_3.png"
      />

      {/* Itinerary Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-slate-800 mb-8 text-center">{itinerary.title}</h2>
          {itinerary.subtitle && (
            <h3 className="text-2xl font-body text-slate-600 mb-12 text-center italic">{itinerary.subtitle}</h3>
          )}
          
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
        title="RSVP for Romania Wedding / Confirmarea Presenței la nunta din România"
        subtitle="Please let us know if you'll be joining us for our special day in Romania"
        onSubmit={handleRSVP}
        rsvpOptions={romanianRsvpOptions}
        placeholderMessage="Mesaj pentru cuplul ... (Special message for the happy couple...)"
        bgColor="from-slate-50 to-slate-100"
        submitText="Submit RSVP / Trimite Răspunsul"
      />
    </div>
  );
}