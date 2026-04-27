// Core event interface
export interface ItineraryEvent {
  time: string;
  title: string;
  subtitle?: string;
  location: string;
  locationUrl?: string;
  description?: string;
  type?: string;
  date?: string;
}

// Day configuration for components
export interface ItineraryDayData {
  date: string;
  title: string;
  subtitle?: string;
  events: ItineraryEvent[];
}

// RSVP form data structure
export interface RSVPFormData {
  name: string;
  email: string;
  phone: string;
  rsvp: string;
  guestCount: string;
  dietaryRestrictions: string;
  arrivalDate: string;
  message: string;
  eventAttendance?: Record<string, boolean>;
  groupMemberRSVPs?: Array<{
    invite_id?: string;
    first_name: string;
    last_name: string;
    attending: boolean;
    email?: string;
    phone?: string;
    arrival_date?: string;
    is_new_guest?: boolean;
  }>;
}

export interface NewGuestCreated {
  invite_id: string;
  first_name: string;
  last_name: string;
}

// RSVP option structure
export interface RSVPOption {
  value: string;
  label: string;
}

// API request structure
export interface RSVPSubmissionData extends RSVPFormData {
  wedding: 'vietnam' | 'romania';
  timestamp: string;
}

// API response structure
export interface RSVPApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Wedding theme colors
export type WeddingTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

// Wedding location
export interface WeddingLocation {
  city: string;
  country: string;
  venue?: string;
  address?: string;
}

// Wedding dates
export interface WeddingDates {
  start: string;
  end?: string;
  timezone?: string;
}