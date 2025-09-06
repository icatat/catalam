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
  if (formData.rsvp === 'true' && guestData.rsvp.includes(location)) {
    await sendRSVPConfirmationEmail({
      name: formData.name || guestData.full_name,
      email: formData.email,
      attending: formData.rsvp === 'true',
      location
    });

    // const message = result.success 
    //   ? MESSAGES.RECONFIRM_SUCCESS(guestData.full_name, formData.email)
    //   : MESSAGES.RECONFIRM_SUCCESS(guestData.full_name);

    // alert(message);
    return true; // Handled, exit early
  }
  return false; // Not handled, continue with normal flow
}

export function updateGuestRSVPStatus({ guestData, formData, location, setGuestData }: RSVPHandlerOptions): void {
  if (formData.rsvp === 'false' && guestData.rsvp.includes(location)) {
    // They previously accepted and changed their mind
    setGuestData({
      ...guestData, 
      rsvp: guestData.rsvp.filter(r => r !== location)
    });
  } else if (formData.rsvp === 'true' && !guestData.rsvp.includes(location)) {
    setGuestData({
      ...guestData, 
      rsvp: [...guestData.rsvp, location]
    });
  }
}

export async function submitRSVP({ guestData, formData, location }: Omit<RSVPHandlerOptions, 'setGuestData'>): Promise<Response> {
  return fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invite_id: guestData.invite_id,
      name: formData.name || guestData.full_name,
      location,
      email: formData.email,
      phone: formData.phone,
      attending: formData.rsvp === 'true', // Send the actual RSVP response as boolean
      properties: {
        dietary_restrictions: formData.dietaryRestrictions,
        guests_count: formData.guestCount,
        special_message: formData.message,
      },
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
  guestData: GuestData,
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