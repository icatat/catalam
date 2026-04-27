import { Location, GuestData } from '@/models/RSVP';
import { RSVPFormData, NewGuestCreated } from '@/types/wedding';
import { MESSAGES } from './constants';

export interface RSVPHandlerOptions {
  guestData: GuestData;
  formData: RSVPFormData;
  location: Location;
  setGuestData: (data: GuestData) => void;
}

export async function handleReconfirmation({ guestData, formData, location }: RSVPHandlerOptions): Promise<boolean> {
  return false;
}

export function updateGuestRSVPStatus(_options: RSVPHandlerOptions): void {
  // Status is stored in separate RSVP tables, not in GuestData
}

export async function submitRSVP({ guestData, formData, location }: Omit<RSVPHandlerOptions, 'setGuestData'>): Promise<{ success: boolean; new_guests_created?: NewGuestCreated[]; error?: string }> {
  const nameParts = formData.name ? formData.name.trim().split(' ') : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : guestData.first_name;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : guestData.last_name;

  const response = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invite_id: guestData.invite_id,
      first_name: firstName,
      last_name: lastName,
      location,
      email: formData.email,
      phone: formData.phone,
      attending: formData.rsvp === 'true',
      properties: {
        dietary_restrictions: formData.dietaryRestrictions,
        guests_count: parseInt(formData.guestCount, 10),  // H1: store as number
        special_message: formData.message,
        tentative_arrival_date: formData.arrivalDate || undefined,
        event_attendance: formData.eventAttendance || undefined,
      },
      group_member_rsvps: formData.groupMemberRSVPs,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to submit RSVP');
  }
  return result;
}

export function createEmailPromise(data: {
  name: string;
  email: string;
  attending: boolean;
  location: Location;
}): Promise<Response> {
  return fetch('/api/send-rsvp-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
