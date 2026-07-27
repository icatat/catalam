
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
  // Sub-event titles this guest is invited to for the wedding being viewed.
  // `undefined`/`null` means invited to every event (backward-compatible default).
  invited_events?: string[] | null;
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
  tentative_arrival_date?: string;
  event_attendance?: Record<string, boolean>;
  special_message?: string;
  // Sub-event titles this guest is invited to. Absent = invited to all events.
  invited_events?: string[];
  // True when the row exists only to carry `invited_events` set by an admin
  // before the guest actually responded — i.e. NOT a real RSVP response.
  invitation_only?: boolean;
}

