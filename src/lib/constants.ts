import { Location } from '@/models/RSVP';

// Wedding dates and locations
export const WEDDING_INFO = {
  [Location.ROMANIA]: {
    date: '11 — 12 September 2026',
    dateShort: 'September 11–12, 2026',
    location: 'Oradea, Romania',
    subtitle: '11 — 12 Septembrie 2026',
    heroImage: '/scratch.png',
    heroImageUrl: 'https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/main/photo_3.png',
    theme: 'World Tour',
    name: 'Romania',
  },
  [Location.VIETNAM]: {
    date: '24 — 25 September 2026',
    dateShort: 'September 24–25, 2026',
    location: 'Cam Ranh, Vietnam',
    subtitle: 'Our Vietnamese celebration',
    heroImage: '/scratch.png',
    heroImageUrl: 'https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/main/photo_0.png',
    theme: 'World Tour',
    name: 'Vietnam',
  }
} as const;

// Common messages
export const MESSAGES = {
  VERIFICATION_LOADING: 'Verifying your invitation...',
  RSVP_SUCCESS: (name: string, location: Location) =>
    location === Location.ROMANIA
      ? `Thank you, ${name} — your RSVP is in. Mulțumim pentru confirmare.`
      : `Thank you, ${name}. Your RSVP is in — we\'ll be in touch.`,
  RSVP_ERROR: (location: Location) =>
    location === Location.ROMANIA
      ? 'Something went wrong. Please try again. / A apărut o eroare — vă rugăm să încercați din nou.'
      : 'Something went wrong submitting your RSVP. Please try again.',
  RECONFIRM_SUCCESS: (name: string, email?: string) =>
    email
      ? `Thank you for re-confirming — a confirmation was sent to ${email}.`
      : `Thank you for re-confirming. We\'ll be in touch.`,
  EMAIL_SUCCESS: (email: string) => `A confirmation email was sent to ${email}`,
  EMAIL_ERROR: (email: string) => `An error occurred when trying to send you a confirmation email to ${email}. Please try again or contact Cata & Lam directly.`,
  EMAIL_ERROR_GENERIC: 'An error occurred with the confirmation email. Please try again or contact Cata & Lam directly.',
  CONTACT_INFO: 'Please try again or contact Cata & Lam directly.',
} as const;

// Romanian RSVP options
export const ROMANIAN_RSVP_OPTIONS = [
  { value: 'true', label: 'Da — I\'ll be there' },
  { value: 'false', label: 'Nu — can\'t make it' }
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