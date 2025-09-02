'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Key } from 'lucide-react';
import { Box, Typography, TextField, useTheme, Alert, CircularProgress } from '@mui/material';
import { TextCard } from '@/components/ui/photo-card';
import Cookies from 'js-cookie';
import { Location } from '@/models/RSVP';
import { useLanguage } from '@/contexts/LanguageContext';
import CustomButton from '@/components/Button';

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
  const { t } = useLanguage();
  const theme = useTheme();
  const [inviteId, setInviteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId.trim()) {
      setError(t('invite.error.empty'));
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
        throw new Error(data.error || t('invite.error.invalid'));
      }

      // Check if guest is invited to this location
      if (!data.location.includes(location)) {
        setError(t('invite.error.location', { location: location.toLowerCase() }));
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
      setError(err instanceof Error ? err.message : t('invite.error.invalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        sx={{ width: '100%', maxWidth: 'md' }}
      >
        <TextCard size="large" variant="primary">
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component={motion.div}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              sx={{ mb: 6 }}
            >
              <Key style={{ width: 64, height: 64, color: theme.palette.primary.main }} />
            </Box>
            
            <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 4 }}>
              {t('invite.welcome.title', { location: location === Location.ROMANIA ? 'Romanian' : 'Vietnamese' })}
            </Typography>
            
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 6 }}>
              {t('invite.welcome.description')}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                type="text"
                value={inviteId}
                onChange={(e) => setInviteId(e.target.value.toUpperCase())}
                placeholder={t('invite.field.placeholder')}
                disabled={loading}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                    '& fieldset': {
                      borderRadius: 2,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '12px 16px',
                  },
                }}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <CustomButton
                  type="submit"
                  disabled={loading || !inviteId.trim()}
                  variant="contained"
                  size="large"
                  weddingVariant="primary"
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Heart />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? t('invite.button.verifying') : t('invite.button.continue')}
                </CustomButton>
              </motion.div>
            </Box>

            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 3, textAlign: 'center' }}>
              {t('invite.help')}
            </Typography>
          </Box>
        </TextCard>
      </Box>
    </Box>
  );
}