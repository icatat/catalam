'use client';

import { useState } from 'react';
import { Location, GuestData } from '@/models/RSVP';
import { RSVPFormData, NewGuestCreated } from '@/types/wedding';
import { handleReconfirmation, submitRSVP, createEmailPromise, RSVPHandlerOptions } from './rsvpUtils';
import { MESSAGES } from './constants';

interface ConfirmationData {
  attending: boolean;
  email: string;
  emailSent: boolean;
}

export function useRSVPHandler(
  guestData: GuestData | null,
  location: Location,
  setGuestData: (data: GuestData) => void
) {
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
    attending: false,
    email: '',
    emailSent: false,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRSVP = async (formData: RSVPFormData): Promise<{ newGuests?: NewGuestCreated[] }> => {
    if (!guestData) return {};

    try {
      const options: RSVPHandlerOptions = { guestData, formData, location, setGuestData };

      const isReconfirmation = await handleReconfirmation(options);
      if (isReconfirmation) {
        setConfirmationData({ attending: formData.rsvp === 'true', email: formData.email, emailSent: true });
        setShowConfirmation(true);
        return {};
      }

      const rsvpResult = await submitRSVP(options);

      if (rsvpResult.success) {
        try {
          const res = await fetch('/api/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invite_id: guestData.invite_id }),
          });
          if (res.ok) {
            const updated = await res.json();
            setGuestData({
              invite_id: guestData.invite_id,
              first_name: updated.first_name,
              last_name: updated.last_name,
              vietnam: updated.vietnam,
              romania: updated.romania,
              group: updated.group,
              has_rsvp_romania: updated.has_rsvp_romania,
              has_rsvp_vietnam: updated.has_rsvp_vietnam,
              group_members: updated.group_members || [],
            });
          }
        } catch (refreshError) {
          // Non-fatal: RSVP was saved, status will reflect on next page load
          console.error('Failed to refresh guest data:', refreshError);
        }
      }

      const newGuests = rsvpResult.new_guests_created;

      if (!newGuests || newGuests.length === 0) {
        const emailPromise = createEmailPromise({
          name: formData.name || `${guestData.first_name} ${guestData.last_name}`,
          email: formData.email,
          attending: formData.rsvp === 'true',
          location,
        });

        setConfirmationData({ attending: formData.rsvp === 'true', email: formData.email, emailSent: false });
        setShowConfirmation(true);

        try {
          const emailResult = await emailPromise;
          const emailData = await emailResult.json();
          setConfirmationData(prev => ({ ...prev, emailSent: emailData.success }));
        } catch {
          setConfirmationData(prev => ({ ...prev, emailSent: false }));
        }
      }

      return { newGuests };
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert(error instanceof Error ? error.message : MESSAGES.RSVP_ERROR(location));
      return {};
    }
  };

  return { handleRSVP, confirmationData, showConfirmation, setShowConfirmation };
}
