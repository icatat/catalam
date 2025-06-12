'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ItineraryDay from '@/components/ItineraryDay';
import RSVPForm from '@/components/RSVPForm';

export default function RomaniaWedding() {
  const handleRSVP = (data: {
    name: string;
    email: string;
    phone: string;
    attendance: string;
    guestCount: string;
    dietaryRestrictions: string;
    message: string;
  }) => {
    console.log('Romania RSVP:', data);
    alert('Mulțumim pentru confirmare! We will contact you soon.');
  };

  const romanianAttendanceOptions = [
    { value: 'yes', label: 'Da, I\'ll be there! (Yes)' },
    { value: 'no', label: 'Nu, I can\'t make it (No)' },
    { value: 'maybe', label: 'Poate (Maybe)' }
  ];

  const day1Events = [
    {
      time: '6:00 PM',
      title: 'Welcome Dinner',
      subtitle: 'Cina de întâmpinare',
      location: 'Restaurant Capitolium, Oradea',
      description: 'Meet and greet with family and friends'
    }
  ];

  const day2Events = [
    {
      time: '3:00 PM',
      title: 'Civil Wedding Ceremony',
      subtitle: 'Cununia Civilă',
      location: 'Oradea City Hall',
      description: 'Primăria Oradea'
    },
    {
      time: '6:00 PM',
      title: 'Wedding Celebration',
      subtitle: 'Celebrarea Nunții',
      location: 'Camelot Resort, Oradea',
      description: 'Traditional Romanian wedding reception'
    }
  ];

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
          <h2 className="text-4xl font-serif text-slate-800 mb-8 text-center">Wedding Itinerary</h2>
          <h3 className="text-2xl font-body text-slate-600 mb-12 text-center italic">Itinerariul nunții</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ItineraryDay
              title="Thursday, September 10th, 2026"
              subtitle="Joi, 10 Septembrie, 2026"
              events={day1Events}
              bgColor="from-slate-50 to-slate-100"
              timeColor="bg-slate-700"
            />
            
            <ItineraryDay
              title="Friday, September 11th, 2026"
              subtitle="Vineri, 11 Septembrie, 2026"
              events={day2Events}
              bgColor="from-blue-50 to-blue-100"
              timeColor="bg-blue-500"
            />
          </div>
        </div>
      </div>

      <RSVPForm
        title="RSVP for Romania Wedding"
        subtitle="Please let us know if you'll be joining us for our special day in Romania"
        onSubmit={handleRSVP}
        attendanceOptions={romanianAttendanceOptions}
        placeholderMessage="Mesaj special pentru cuplul fericit... (Special message for the happy couple...)"
        bgColor="from-slate-50 to-slate-100"
        submitText="Submit RSVP"
      />
    </div>
  );
}