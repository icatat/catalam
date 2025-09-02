import { Location } from '@/models/RSVP';

export interface EmailConfirmationData {
  name: string;
  email: string;
  attending: boolean;
  location: Location;
}

export async function sendRSVPConfirmationEmail(data: EmailConfirmationData): Promise<{
  success: boolean;
  message?: string;
}> {
  
  try {
    // Validate email data
    if (!data.email || data.email.trim() === '') {
      return {
        success: false,
        message: `Invalid email address: ${data.email} . Please try again or contact Cata & Lam directly.`
      };
    }

    const response = await fetch('/api/send-rsvp-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        message: `A confirmation email was sent to ${data.email}`
      };
    } else {
      return {
        success: false,
        message: `An error occurred when trying to send you a confirmation email to ${data.email}. Please try again or contact Cata & Lam directly.`
      };
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      message: `An error occurred when trying to send you a confirmation email${data.email ? ` to ${data.email}` : ''}. Please try again or contact Cata & Lam directly.`
    };
  }
}

export function sendRSVPConfirmationEmailAsync(data: EmailConfirmationData): Promise<Response> {
  return fetch('/api/send-rsvp-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}