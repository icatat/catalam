'use client';

import { useState } from 'react';
import { Location } from '@/models/RSVP';
import { themeClasses } from '@/lib/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import CustomButton from '@/components/Button';
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
  const { t } = useLanguage();
  const [showEmailDetails, setShowEmailDetails] = useState(false);

  if (!isVisible) return null;

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
              ? t('confirmation.title.confirmed')
              : t('confirmation.title.updated')
            }
          </h2>

          <p className={cn(themeClasses.body('large'), 'text-gray-700 mb-6')}>
            {attending 
              ? t('confirmation.message.attending', { name: guestName, location: locationName })
              : t('confirmation.message.not.attending', { name: guestName, location: locationName })
            }
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
                  ? t('confirmation.email.sent')
                  : t('confirmation.email.sending')
                }
              </span>
            </div>
            
            <button
              onClick={() => setShowEmailDetails(!showEmailDetails)}
              className={cn(themeClasses.body('small'), 'text-blue-600 hover:text-blue-700 underline')}
            >
              {showEmailDetails ? t('confirmation.email.hide') : t('confirmation.email.details')}
            </button>

            {showEmailDetails && (
              <div className="mt-3 text-left">
                <p className={cn(themeClasses.body('small'), 'text-gray-600')}>
                  <strong>{t('confirmation.email.to')}:</strong> {email}
                </p>
                <p className={cn(themeClasses.body('small'), 'text-gray-600')}>
                  <strong>{t('confirmation.email.subject')}:</strong> Wedding RSVP Confirmation - {locationName}
                </p>
                {emailSent ? (
                  <p className={cn(themeClasses.body('small'), 'text-green-600 mt-2')}>
                    ✓ {t('confirmation.email.check')}
                  </p>
                ) : (
                  <p className={cn(themeClasses.body('small'), 'text-orange-600 mt-2')}>
                    ⏳ {t('confirmation.email.arrive')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <CustomButton
              onClick={onModify}
              variant="outlined"
              size="medium"
              className="flex-1 flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t('common.modify')}
            </CustomButton>
            <CustomButton
              onClick={onClose}
              variant="contained"
              size="medium"
              className={cn(
                'flex-1 font-medium text-white transition-all duration-200',
                variant === 'primary' && 'bg-rose-500 hover:bg-rose-600',
                variant === 'secondary' && 'bg-emerald-500 hover:bg-emerald-600',
                variant === 'accent' && 'bg-amber-500 hover:bg-amber-600'
              )}
            >
              {t('common.done')}
            </CustomButton>
          </div>

          {/* Contact info */}
          <p className={cn(themeClasses.body('small'), 'text-gray-500 mt-4')}>
            {t('questions.text')}
          </p>
        </div>
      </div>
    </div>
  );
}