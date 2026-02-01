
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
  has_rsvp_romania?: boolean;
  has_rsvp_vietnam?: boolean;
  group_members?: GroupMemberData[];
}

export interface GroupMemberData {
  invite_id: string;
  first_name: string;
  last_name: string;
  vietnam: boolean;
  romania: boolean;
  group: string | null;
  has_rsvp_romania: boolean;
  has_rsvp_vietnam: boolean;
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
  rsvp_on_behalf?: string;
}

