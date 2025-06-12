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
      title: 'Traditional Tea Ceremony (Lễ ăn hỏi)',
      location: 'Bride\'s Family Home',
      description: 'Traditional Vietnamese engagement ceremony with family'
    },
    {
      time: '11:00',
      title: 'Wedding Ceremony',
      location: 'Sacred Heart Church, District 3',
      description: 'Catholic wedding ceremony'
    },
    {
      time: '13:00',
      title: 'Wedding Reception',
      location: 'Park Hyatt Saigon',
      description: 'Traditional Vietnamese wedding banquet with live music and dancing'
    },
    {
      time: '18:00',
      title: 'Evening Celebration',
      location: 'Rooftop Bar - Chill Skybar',
      description: 'Cocktails and dancing with city views'
    }
  ];

  const day2Events = [
    {
      time: '9:00',
      title: 'City Tour',
      location: 'Ho Chi Minh City',
      description: 'Visit Cu Chi Tunnels and local markets'
    },
    {
      time: '12:30',
      title: 'Traditional Lunch',
      location: 'Local Vietnamese Restaurant',
      description: 'Authentic Vietnamese cuisine experience'
    },
    {
      time: '15:00',
      title: 'Mekong Delta Trip',
      location: 'Day trip to Mekong Delta',
      description: 'Boat rides and local culture'
    },
    {
      time: '19:00',
      title: 'Farewell Dinner',
      location: 'Riverside Restaurant',
      description: 'Final celebration by the Saigon River'
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

      {/* Additional Info */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-slate-800 mb-8">Travel Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Accommodation</h3>
              <p className="text-slate-600 mb-2">
                We recommend staying at Park Hyatt Saigon or nearby hotels in District 1.
              </p>
              <p className="text-slate-600">
                Special group rates available - contact us for details.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Transportation</h3>
              <p className="text-slate-600 mb-2">
                Fly into Tan Son Nhat International Airport (SGN).
              </p>
              <p className="text-slate-600">
                We&apos;ll arrange airport transfers for all guests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}