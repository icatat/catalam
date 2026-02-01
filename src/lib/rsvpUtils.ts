import { Location, GuestData } from '@/models/RSVP';
import { RSVPFormData } from '@/types/wedding';
import { sendRSVPConfirmationEmail } from './emailUtils';
import { MESSAGES } from './constants';

export interface RSVPHandlerOptions {
  guestData: GuestData;
  formData: RSVPFormData;
  location: Location;
  setGuestData: (data: GuestData) => void;
}

export async function handleReconfirmation({ guestData, formData, location }: RSVPHandlerOptions): Promise<boolean> {
  // Note: RSVP status check should be done at a higher level since we no longer have rsvp array in GuestData
  // This function is kept for future reconfirmation logic
  return false; // Not handled, continue with normal flow
}

export function updateGuestRSVPStatus({ guestData, formData, location, setGuestData }: RSVPHandlerOptions): void {
  // No longer tracking RSVP status in guest data - status is stored in separate rsvp tables
  // This function is kept for backwards compatibility but does nothing
}

export async function submitRSVP({ guestData, formData, location }: Omit<RSVPHandlerOptions, 'setGuestData'>): Promise<Response> {
  // Split name into first and last name if provided in form, otherwise use from guestData
  const nameParts = formData.name ? formData.name.trim().split(' ') : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : guestData.first_name;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : guestData.last_name;

  return fetch('/api/rsvp', {
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
        guests_count: formData.guestCount,
        special_message: formData.message,
      },
      group_member_rsvps: formData.groupMemberRSVPs,
    }),
  });
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
    body: JSON.stringify(data)
  });
}

export function handleRSVPPromiseChain(
  response: Response,
  emailPromise: Promise<Response>,
  _guestData: GuestData,
  formData: RSVPFormData
): void {
  response.json()
    .then(result => {
      if (result.success) {
        // alert(MESSAGES.RSVP_SUCCESS(guestData.full_name, location));
        return emailPromise;
      } else {
        // alert(MESSAGES.RSVP_ERROR(location));
        return emailPromise;
      }
    })
    .then(emailResponse => emailResponse.json())
    .then(emailResult => {
      if (emailResult.success) {
        alert(MESSAGES.EMAIL_SUCCESS(formData.email));
      } else {
        alert(MESSAGES.EMAIL_ERROR(formData.email));
      }
    })
    .catch(error => {
      console.error('Error in promise chain:', error);
      alert(MESSAGES.EMAIL_ERROR(formData.email));
    });
}