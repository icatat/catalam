import { Location } from '@/models/RSVP';

// Wedding dates and locations
export const WEDDING_INFO = {
  [Location.ROMANIA]: {
    date: 'September 11th, 2026 - September 12th, 2026',
    dateShort: 'September 11-12, 2026',
    location: 'Oradea, Romania',
    subtitle: '11 Septembrie 2026 - 12 Septembrie 2026',
    heroImage: '/scratch.png',
    heroImageUrl: 'https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/main/photo_3.png',
    theme: 'World Tour ✈️',
    name: 'Romania',
  },
  [Location.VIETNAM]: {
    date: 'September 26th, 2026',
    dateShort: 'September 26, 2026',
    location: 'Cam Rahn, Vietnam',
    subtitle: 'Join us for a our  Vietnamese Wedding!',
    heroImage: '/scratch.png',
    heroImageUrl: 'https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/main/photo_0.png',
    theme: 'World Tour ✈️',
    name: 'Vietnam',
  }
} as const;

// Common messages
export const MESSAGES = {
  VERIFICATION_LOADING: 'Verifying your invitation...',
  RSVP_SUCCESS: (name: string, location: Location) => 
    location === Location.ROMANIA 
      ? `Thank you ${name} for confirming! Mulțumim pentru confirmare!`
      : `Thank you ${name} for your RSVP! We will contact you soon.`,
  RSVP_ERROR: (location: Location) =>
    location === Location.ROMANIA
      ? 'Sorry, there was an error. Please try again. / Eroare - vă rugăm să încercați din nou!'
      : 'Sorry, there was an error submitting your RSVP. Please try again.',
  RECONFIRM_SUCCESS: (name: string, email?: string) =>
    email 
      ? `Thank you for re-confirming your attendance! A confirmation email was sent to ${email}`
      : `Thank you for re-confirming your attendance! We will contact you soon.`,
  EMAIL_SUCCESS: (email: string) => `A confirmation email was sent to ${email}`,
  EMAIL_ERROR: (email: string) => `An error occurred when trying to send you a confirmation email to ${email}. Please try again or contact Cata & Lam directly.`,
  EMAIL_ERROR_GENERIC: 'An error occurred with the confirmation email. Please try again or contact Cata & Lam directly.',
  CONTACT_INFO: 'Please try again or contact Cata & Lam directly.',
} as const;

// Romanian RSVP options
export const ROMANIAN_RSVP_OPTIONS = [
  { value: 'true', label: 'Da, I\'ll be there! (Yes)' },
  { value: 'false', label: 'Nu, I can\'t make it (No)' }
];

// Theme variants by location
export const LOCATION_THEME = {
  [Location.ROMANIA]: {
    variant: 'primary' as const,
    color: '#efd9df',
    gradientBg: 'primary' as const,
    rsvpVariant: 'accent' as const,
  },
  [Location.VIETNAM]: {
    variant: 'secondary' as const,
    color: '#c2e1ee',
    gradientBg: 'secondary' as const,
    rsvpVariant: 'secondary' as const,
  }
} as const;