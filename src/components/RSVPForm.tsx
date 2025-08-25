'use client';

import { useState } from 'react';
import { RSVPFormData, RSVPOption } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RSVPFormProps {
  title: string;
  subtitle: string;
  submitText?: string;
  onSubmit?: (data: RSVPFormData) => void;
  rsvpOptions?: RSVPOption[];
  placeholderMessage?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export type { RSVPFormData };

export default function RSVPForm({
  title,
  subtitle,
  submitText = 'Submit RSVP',
  onSubmit,
  rsvpOptions = [
    { value: 'true' , label: 'Yes, I&apos;ll be there!' },
    { value: 'false', label: 'Sorry, I can&apos;t make it' }
  ],
  placeholderMessage = 'Any special message for the couple...',
  variant = 'primary'
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
    }
  };

  return (
    <section className={cn("py-16", themeClasses.section('base'))}>
      <div className={themeClasses.container()}>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h2 className={cn(themeClasses.heading('h2', variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'accent'), 'mb-4 text-center')}>
            {title}
          </h2>
          <p className={cn(themeClasses.body('large'), 'text-gray-600 mb-8 text-center')}>
            {subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* RSVP Field */}
            <div>
              <label className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Will you be attending? *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {rsvpOptions.map((option) => (
                  <label key={option.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="rsvp"
                      value={option.value}
                      checked={formData.rsvp === option.value}
                      onChange={handleInputChange}
                      className="mr-3 text-blue-500 focus:ring-blue-500"
                      required
                    />
                    <span className={themeClasses.body('base')}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Guest Count Field */}
            <div>
              <label htmlFor="guestCount" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Number of Guests
              </label>
              <select
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num.toString()}>{num}</option>
                ))}
              </select>
            </div>

            {/* Dietary Restrictions Field */}
            <div>
              <label htmlFor="dietaryRestrictions" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Dietary Restrictions
              </label>
              <input
                type="text"
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                placeholder="Vegetarian, allergies, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                Message for the Couple
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder={placeholderMessage}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className={cn(
                  'px-8 py-3 font-medium text-white rounded-lg transition-all duration-200 hover:scale-105',
                  variant === 'primary' && 'bg-rose-500 hover:bg-rose-600',
                  variant === 'secondary' && 'bg-emerald-500 hover:bg-emerald-600',
                  variant === 'accent' && 'bg-amber-500 hover:bg-amber-600'
                )}
              >
                {submitText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}