'use client';

import { useState } from 'react';
import { RSVPFormData, RSVPOption } from '@/types/wedding';

interface RSVPFormProps {
  title: string;
  subtitle: string;
  submitText?: string;
  onSubmit?: (data: RSVPFormData) => void;
  rsvpOptions?: RSVPOption[];
  placeholderMessage?: string;
  bgColor?: string;
}

export type { RSVPFormData };

export default function RSVPForm({
  title,
  subtitle,
  submitText = 'Submit RSVP',
  onSubmit,
  rsvpOptions = [
    { value: 'yes', label: 'Yes, I\'ll be there!' },
    { value: 'no', label: 'Sorry, I can\'t make it' },
    { value: 'maybe', label: 'Maybe' }
  ],
  placeholderMessage = 'Any special message for the couple...',
  bgColor = 'from-blue-50 to-blue-100'
}: RSVPFormProps) {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    phone: '',
    rsvp: '',
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
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('RSVP Data:', formData);
      alert('Thank you for your RSVP! We will contact you soon.');
    }
  };

  return (
    <div className={`bg-gradient-to-br ${bgColor} py-16`}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-slate-800 mb-8 text-center">{title}</h2>
        <p className="text-center text-slate-600 mb-8">
          {subtitle}
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
                name="rsvp"
                value={formData.rsvp}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Please select</option>
                {rsvpOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
              placeholder={placeholderMessage}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}