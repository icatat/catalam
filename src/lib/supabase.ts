import { createClient } from '@supabase/supabase-js';
import { Location } from '@/models/RSVP';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Guest {
  invite_id: string;
  full_name: string;
  location: Location[];
  properties: Record<string, unknown>;
  email?: string;
  phone?: string;
  rsvp_timestamp?: string;
}

export interface RSVPFormData {
  email: string;
  phone: string;
  properties: {
    dietary_restrictions?: string;
    travel_plans?: string;
    accommodation?: string;
    guests_count?: number;
    special_requests?: string;
    [key: string]: unknown;
  };
}

export interface TimelineEvent {
  event_id: string;
  event: string; // This will be the title
  image: string; // Blob storage URL
  date: string | null; // Date string from database
  description: string | null;
  location: string | null;
  tag: string | null; // For people tagging
  from: string | null; // Who uploaded/shared this memory
}