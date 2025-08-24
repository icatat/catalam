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
    guestCount: 1,
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
      console.log("FORM DATA: ", formData)
      onSubmit(formData);
    } else {
      console.log('RSVP Data:', formData);
      alert('Thank you for your RSVP! We will contact you soon.');
    }
  };

  return (
    <div className={cn(themeClasses.gradientBg(variant), themeClasses.section('base'))}>
      <div className={themeClasses.container()}>
        <h2 className={cn(themeClasses.heading('h3', 'primary'), 'mb-8 text-center')}>
          {title}
        </h2>
        <p className={cn(themeClasses.body('base', 'secondary'), 'text-center mb-8')}>
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className={themeClasses.card('base')}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={themeClasses.inputLabel()}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={themeClasses.input()}
              />
            </div>

            <div>
              <label className={themeClasses.inputLabel()}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={themeClasses.input()}
              />
            </div>

            <div>
              <label className={themeClasses.inputLabel()}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={themeClasses.input()}
              />
            </div>

            <div>
              <label className={themeClasses.inputLabel()}>Will you attend? *</label>
              <select
                name="rsvp"
                value={formData.rsvp}
                onChange={handleInputChange}
                required
                className={themeClasses.input()}
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
              <label className={themeClasses.inputLabel()}>Number of Guests</label>
              <select
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                className={themeClasses.input()}
              >
                <option value="1">Just me</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5+">5+ people</option>
              </select>
            </div>

            <div>
              <label className={themeClasses.inputLabel()}>Dietary Restrictions</label>
              <input
                type="text"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                placeholder="Vegetarian, allergies, etc."
                className={themeClasses.input()}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={themeClasses.inputLabel()}>Special Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder={placeholderMessage}
              className={themeClasses.input()}
            />
          </div>

          <div className="mt-8 text-center">
            <Button
              type="submit"
              variant={variant === 'primary' ? 'default' : 'secondary'}
              size="lg"
            >
              {submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}