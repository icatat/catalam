'use client';

import { useEffect } from 'react';

interface RSVPConfirmationProps {
  isVisible: boolean;
  isSuccess: boolean;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

export default function RSVPConfirmation({
  isVisible,
  isSuccess,
  message,
  onClose,
  autoCloseDelay = 5000
}: RSVPConfirmationProps) {
  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
        <div className="p-6">
          {/* Success/Error Icon */}
          <div className="flex items-center justify-center mb-4">
            {isSuccess ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-xl font-serif text-center mb-3 ${
            isSuccess ? 'text-green-800' : 'text-red-800'
          }`}>
            {isSuccess ? 'RSVP Confirmed!' : 'RSVP Error'}
          </h3>

          {/* Message */}
          <p className="text-slate-600 text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSuccess 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Close
            </button>
          </div>

          {/* Auto-close indicator */}
          {autoCloseDelay > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-400">
                This will close automatically in {Math.ceil(autoCloseDelay / 1000)} seconds
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                <div 
                  className={`h-1 rounded-full transition-all duration-1000 ease-linear ${
                    isSuccess ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: '100%',
                    animation: `shrink ${autoCloseDelay}ms linear forwards`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}