'use client';

import { useState, useEffect } from 'react';
import { RSVPFormData } from '@/types/wedding';
import { Location, GuestData } from '@/models/RSVP';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ROMANIAN_RSVP_OPTIONS } from '@/lib/constants';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RSVPFormData) => Promise<void>;
  guestData: GuestData;
  location: Location;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function RSVPModal({
  isOpen,
  onClose,
  onSubmit,
  guestData,
  location,
  variant = 'primary'
}: RSVPModalProps) {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    phone: '',
    rsvp: '',
    guestCount: '1',
    dietaryRestrictions: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRomania = location === Location.ROMANIA;
  const hasExistingRSVP = guestData.rsvp.includes(location);
  const rsvpOptions = isRomania ? ROMANIAN_RSVP_OPTIONS : [
    { value: 'true', label: 'Yes, I&apos;ll be there!' },
    { value: 'false', label: 'Sorry, I can&apos;t make it' }
  ];

  // Prefill form with guest data
  useEffect(() => {
    if (guestData) {
      setFormData(prev => ({
        ...prev,
        name: guestData.full_name,
        rsvp: hasExistingRSVP ? 'true' : ''
      }));
    }
  }, [guestData, hasExistingRSVP]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
        themeClasses.card('base')
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className={cn(themeClasses.heading('h3', variant), 'mb-1')}>
              {hasExistingRSVP ? 'Modify Your RSVP' : 'RSVP'}
              {isRomania && (hasExistingRSVP ? ' / Modifică Răspunsul' : ' / Confirmarea Presenței')}
            </h2>
            <p className={cn(themeClasses.body('small'), 'text-gray-600')}>
              {location === Location.ROMANIA ? 'Romania Wedding' : 'Vietnam Wedding'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status indicator */}
          {hasExistingRSVP && (
            <div className={cn(
              "p-4 rounded-lg border",
              "bg-green-50 border-green-200 text-green-800"
            )}>
              <p className={themeClasses.body('small')}>
                ✓ You have already RSVP&apos;d for this wedding. You can modify your response below.
                {isRomania && ' / Ai confirmat deja prezența. Poți modifica răspunsul mai jos.'}
              </p>
            </div>
          )}

          {/* Welcome message */}
          <div className="text-center">
            <p className={cn(themeClasses.body('large'), 'text-gray-700')}>
              Welcome {guestData.full_name}! 
              {isRomania && ` / Bun venit ${guestData.full_name}!`}
            </p>
            <p className={cn(themeClasses.body('base'), 'text-gray-600 mt-2')}>
              Please let us know if you&apos;ll be joining us for our special day in {location === Location.ROMANIA ? 'Romania' : 'Vietnam'}
              {isRomania && ' / Te rugăm să ne spui dacă vei fi alături de noi în ziua noastră specială din România'}
            </p>
          </div>

          {/* Name Field (prefilled, readonly) */}
          <div>
            <label htmlFor="name" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
              Full Name / Nume Complet *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              readOnly
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
              Email Address / Adresa de Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
              Phone Number / Număr de Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="+40 / +84 / +1..."
            />
          </div>

          {/* RSVP Field */}
          <div>
            <label className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
              Will you be attending? / Vei participa? *
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
              Number of Guests / Numărul de Invitați
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
              Dietary Restrictions / Restricții Alimentare
            </label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              placeholder={isRomania ? "Vegetarian, alergii, etc. / Vegetarian, allergies, etc." : "Vegetarian, allergies, etc."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
              Message for the Couple / Mesaj pentru Cuplu
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              placeholder={isRomania ? "Mesaj pentru cuplul ... (Special message for the happy couple...)" : "Any special message for the couple..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel / Anulează
            </Button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className={cn(
                'flex-1 font-medium text-white transition-all duration-200',
                variant === 'primary' && 'bg-rose-500 hover:bg-rose-600',
                variant === 'secondary' && 'bg-emerald-500 hover:bg-emerald-600',
                variant === 'accent' && 'bg-amber-500 hover:bg-amber-600',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRomania ? 'Se trimite...' : 'Submitting...'}
                </>
              ) : (
                hasExistingRSVP 
                  ? (isRomania ? 'Update RSVP / Actualizează' : 'Update RSVP')
                  : (isRomania ? 'Submit RSVP / Trimite' : 'Submit RSVP')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}