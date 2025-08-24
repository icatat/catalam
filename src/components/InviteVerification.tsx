'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Key, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/lib/theme';
import { TextCard } from '@/components/ui/photo-card';
import Cookies from 'js-cookie';
import { Location } from '@/models/RSVP';

interface InviteVerificationProps {
  location: Location;
  onVerified: (guestData: {
    invite_id: string;
    full_name: string;
    location: Location[];
    rsvp: Location[];
  }) => void;
}

export function InviteVerification({ location, onVerified }: InviteVerificationProps) {
  const [inviteId, setInviteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId.trim()) {
      setError('Please enter your invite ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invite_id: inviteId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify invite');
      }

      // Check if guest is invited to this location
      if (!data.location.includes(location)) {
        setError(`Your invitation doesn't include the ${location.toLowerCase()} wedding. Please check with the couple if you have multiple invitations.`);
        return;
      }

      // Store invite_id in cookies for future use
      Cookies.set('invite_id', inviteId.trim(), { expires: 30 });

      onVerified({
        invite_id: inviteId.trim(),
        full_name: data.full_name,
        location: data.location,
        rsvp: data.rsvp || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify invite ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <TextCard size="large" variant="primary">
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Key className="w-16 h-16 mx-auto mb-6 text-rose-500" />
            </motion.div>
            
            <h1 className={cn(themeClasses.heading('h3', 'primary'), 'mb-4')}>
              Welcome to Our {location === Location.ROMANIA ? 'Romanian' : 'Vietnamese'} Wedding
            </h1>
            
            <p className={cn(themeClasses.body('base', 'secondary'), 'mb-6')}>
              Please enter your invite ID to continue. You should have received this unique code with your invitation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={inviteId}
                  onChange={(e) => setInviteId(e.target.value.toUpperCase())}
                  placeholder="Enter your invite ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading || !inviteId.trim()}
                className={cn(
                  'w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200',
                  'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Continue to Wedding
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-xs text-gray-500">
              <p>Don&apos;t have an invite ID? Please contact the couple.</p>
            </div>
          </div>
        </TextCard>
      </motion.div>
    </div>
  );
}