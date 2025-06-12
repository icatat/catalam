'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm from '@/components/RSVPForm';

export default function VietnamWedding() {
  const handleRSVP = (data: {
    name: string;
    email: string;
    phone: string;
    attendance: string;
    guestCount: string;
    dietaryRestrictions: string;
    message: string;
  }) => {
    console.log('Vietnam RSVP:', data);
    alert('Thank you for your RSVP! We will contact you soon.');
  };

  const day1Events = [
    {
      time: '8:00',
      title: 'Placeholder',
      location: 'Placeholder',
      description: 'Placeholder'
    }
  ];

  const day2Events = [
       {
      time: '8:00',
      title: 'Placeholder',
      location: 'Placeholder',
      description: 'Placeholder'
    }
  ];

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
          <h2 className="text-4xl font-serif text-slate-800 mb-12 text-center">Wedding Itinerary</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ItineraryDay
              title="Saturday, September 26th, 2026"
              events={day1Events}
              bgColor="from-blue-50 to-blue-100"
              timeColor="bg-blue-500"
            />
            
            <ItineraryDay
              title="Sunday, September 27th, 2026 (Optional)"
              events={day2Events}
              bgColor="from-slate-50 to-slate-100"
              timeColor="bg-slate-500"
            />
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