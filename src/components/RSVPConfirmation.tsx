'use client';

import { useState } from 'react';
import { Location } from '@/models/RSVP';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail, Edit } from 'lucide-react';

interface RSVPConfirmationProps {
  isVisible: boolean;
  attending: boolean;
  guestName: string;
  email: string;
  location: Location;
  onModify: () => void;
  onClose: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  emailSent?: boolean;
}

export default function RSVPConfirmation({
  isVisible,
  attending,
  guestName,
  email,
  location,
  onModify,
  onClose,
  variant = 'primary',
  emailSent = false
}: RSVPConfirmationProps) {
  const [showEmailDetails, setShowEmailDetails] = useState(false);

  if (!isVisible) return null;

  const isRomania = location === Location.ROMANIA;
  const locationName = location === Location.ROMANIA ? 'Romania' : 'Vietnam';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "bg-white rounded-xl shadow-2xl w-full max-w-md",
        themeClasses.card('base')
      )}>
        {/* Header with status icon */}
        <div className="text-center p-8">
          {attending ? (
            <CheckCircle className={cn(
              "h-16 w-16 mx-auto mb-4",
              variant === 'primary' && 'text-rose-500',
              variant === 'secondary' && 'text-emerald-500',
              variant === 'accent' && 'text-amber-500'
            )} />
          ) : (
            <XCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          )}

          <h2 className={cn(themeClasses.heading('h3', variant), 'mb-2')}>
            {attending 
              ? (isRomania ? 'RSVP Confirmed! / Confirmat!' : 'RSVP Confirmed!')
              : (isRomania ? 'RSVP Updated / Actualizat' : 'RSVP Updated')
            }
          </h2>

          <p className={cn(themeClasses.body('large'), 'text-gray-700 mb-6')}>
            {attending ? (
              <>
                Thank you {guestName}! We&apos;re excited to celebrate with you in {locationName}.
                {isRomania && (
                  <span className="block mt-2 text-gray-600">
                    Mulțumim {guestName}! Ne bucurăm să sărbătorim cu tine în România.
                  </span>
                )}
              </>
            ) : (
              <>
                Thank you {guestName} for letting us know. We&apos;ll miss you at our {locationName} celebration.
                {isRomania && (
                  <span className="block mt-2 text-gray-600">
                    Mulțumim {guestName} că ne-ai anunțat. O să ne lipsești la celebrarea din România.
                  </span>
                )}
              </>
            )}
          </p>

          {/* Email confirmation section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Mail className={cn(
                "h-5 w-5 mr-2",
                emailSent ? 'text-green-500' : 'text-orange-500'
              )} />
              <span className={cn(
                themeClasses.body('small'),
                emailSent ? 'text-green-700' : 'text-orange-700'
              )}>
                {emailSent 
                  ? (isRomania ? 'Email sent! / Email trimis!' : 'Confirmation email sent!')
                  : (isRomania ? 'Email sending... / Se trimite email...' : 'Sending confirmation email...')
                }
              </span>
            </div>
            
            <button
              onClick={() => setShowEmailDetails(!showEmailDetails)}
              className={cn(themeClasses.body('small'), 'text-blue-600 hover:text-blue-700 underline')}
            >
              {showEmailDetails ? 'Hide details' : 'Show email details'}
              {isRomania && ` / ${showEmailDetails ? 'Ascunde detalii' : 'Arată detalii'}`}
            </button>

            {showEmailDetails && (
              <div className="mt-3 text-left">
                <p className={cn(themeClasses.body('small'), 'text-gray-600')}>
                  <strong>To / Către:</strong> {email}
                </p>
                <p className={cn(themeClasses.body('small'), 'text-gray-600')}>
                  <strong>Subject / Subiect:</strong> Wedding RSVP Confirmation - {locationName}
                </p>
                {emailSent ? (
                  <p className={cn(themeClasses.body('small'), 'text-green-600 mt-2')}>
                    ✓ Please check your inbox and spam folder
                    {isRomania && ' / Te rugăm verifică inbox-ul și folderul spam'}
                  </p>
                ) : (
                  <p className={cn(themeClasses.body('small'), 'text-orange-600 mt-2')}>
                    ⏳ Email will arrive shortly
                    {isRomania && ' / Email-ul va sosi în curând'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onModify}
              variant="outline"
              size="default"
              className="flex-1 flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isRomania ? 'Modify / Modifică' : 'Modify RSVP'}
            </Button>
            <Button
              onClick={onClose}
              variant="default"
              size="default"
              className={cn(
                'flex-1 font-medium text-white transition-all duration-200',
                variant === 'primary' && 'bg-rose-500 hover:bg-rose-600',
                variant === 'secondary' && 'bg-emerald-500 hover:bg-emerald-600',
                variant === 'accent' && 'bg-amber-500 hover:bg-amber-600'
              )}
            >
              {isRomania ? 'Done / Gata' : 'Done'}
            </Button>
          </div>

          {/* Contact info */}
          <p className={cn(themeClasses.body('small'), 'text-gray-500 mt-4')}>
            Questions? Contact us: catalam@catalam.com
            {isRomania && ' / Întrebări? Contactează-ne: catalam@catalam.com'}
          </p>
        </div>
      </div>
    </div>
  );
}