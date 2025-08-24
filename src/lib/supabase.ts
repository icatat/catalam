import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Guest {
  invite_id: string;
  full_name: string;
  location: ('ROMANIA' | 'VIETNAM')[];
  properties: Record<string, any>;
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
    [key: string]: any;
  };
}