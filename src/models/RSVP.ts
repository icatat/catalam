
export enum Location {
  ROMANIA = "ROMANIA",
  VIETNAM = "VIETNAM"
}
export interface GuestData {
  invite_id: string;
  full_name: string;
  location: Location[];
  rsvp: Location[]
}
