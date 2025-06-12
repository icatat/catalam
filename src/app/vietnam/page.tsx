'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VietnamWedding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: '',
    guestCount: '1',
    dietaryRestrictions: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Vietnam RSVP:', formData);
    alert('Thank you for your RSVP! We will contact you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-serif text-slate-800">
              Cata & Lam
            </Link>
            <div className="flex space-x-8">
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/vietnam" className="text-blue-600 font-medium">
                Vietnam Wedding
              </Link>
              <Link href="/romania" className="text-slate-700 hover:text-blue-600 transition-colors">
                Romania Wedding
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
       <div 
        className="relative py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/photo_0.png)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif text-slate-800 mb-4">Vietnam Wedding Celebration</h1>
          <div className="bg-white/70 rounded-lg p-6 inline-block">
            <div className="text-2xl font-semibold text-slate-800 mb-2">September 26th, 2026</div>
            <div className="text-2xl font-semibold text-slate-800 mb-2">September 26th, 2026</div>
            <div className="text-lg text-slate-600">Hanoi, Vietnam</div>
          </div>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-slate-800 mb-12 text-center">Wedding Itinerary</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Day 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">Saturday, September 26th, 2026</h3>
            </div>

            {/* Day 2 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">Sunday, September 27th, 2026</h3>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-serif text-slate-800 mb-8 text-center">RSVP for Vietnam Wedding</h2>
          <p className="text-center text-slate-600 mb-8">
            Please let us know if you&apos;ll be joining us for our special day in Vietnam
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Will you attend? *</label>
                <select
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Please select</option>
                  <option value="yes">Yes, I&apos;ll be there!</option>
                  <option value="no">Sorry, I can&apos;t make it</option>
                  <option value="maybe">Maybe</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Number of Guests</label>
                <select
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">Just me</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5+">5+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Dietary Restrictions</label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="Vegetarian, allergies, etc."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-slate-700 font-medium mb-2">Special Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any special message for the couple..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg"
              >
                Submit RSVP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}