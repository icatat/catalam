
export enum Location {
  ROMANIA = "ROMANIA",
  VIETNAM = "VIETNAM"
}

export interface GuestData {
  invite_id: string;
  first_name: string;
  last_name: string;
  group?: string;
  vietnam: boolean;
  romania: boolean;
}

export interface RsvpData {
  invite_id: string;
  first_name: string;
  last_name: string;
  confirmed?: boolean;
  properties: RSVPProperties;
  phone?: string | null;
  email?: string;
  updated_at?: string; // timestamp
}

export interface RSVPProperties {
  dietary_restrictions?: string;
  travel_plans?: string;
  accommodation?: string;
  guests_count?: number;
  special_requests?: string;
}

