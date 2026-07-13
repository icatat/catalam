'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Key } from 'lucide-react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { TextCard } from '@/components/ui/photo-card';
import Cookies from 'js-cookie';
import { Location, GuestData } from '@/models/RSVP';
import CustomButton from '@/components/Button';

interface InviteVerificationProps {
  location: Location;
  onVerified: (guestData: GuestData & {
    has_rsvp_romania?: boolean;
    has_rsvp_vietnam?: boolean;
  }) => void;
}

type LookupMode = 'code' | 'name';

export function InviteVerification({ location, onVerified }: InviteVerificationProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<LookupMode>('code');
  const [inviteId, setInviteId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    mode === 'code' ? inviteId.trim().length > 0 : firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError(mode === 'code' ? 'Please enter your invite code' : 'Please enter your first and last name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const body =
        mode === 'code'
          ? { invite_id: inviteId.trim() }
          : { first_name: firstName.trim(), last_name: lastName.trim() };

      const response = await fetch('/api/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid invitation');
      }

      // Check if guest is invited to this location based on boolean flags
      const hasAccess = location === Location.ROMANIA ? data.romania : data.vietnam;
      if (!hasAccess) {
        setError(`This invitation is not valid for the ${location.toLowerCase()} wedding`);
        return;
      }

      // Store resolved invite_id in cookies for future use
      Cookies.set('invite_id', data.invite_id, { expires: 30 });

      onVerified({
        invite_id: data.invite_id,
        first_name: data.first_name,
        last_name: data.last_name,
        vietnam: data.vietnam,
        romania: data.romania,
        group: data.group,
        has_rsvp_romania: data.has_rsvp_romania,
        has_rsvp_vietnam: data.has_rsvp_vietnam,
        group_members: data.group_members || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid invitation');
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
              Welcome to our {location === Location.ROMANIA ? 'Romanian' : 'Vietnamese'} Wedding!
            </Typography>

            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
              Please enter your invitation code or your name to continue
            </Typography>

            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, next: LookupMode | null) => {
                if (!next) return;
                setMode(next);
                setError('');
              }}
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton value="code" sx={{ textTransform: 'none', px: 3 }}>
                Invite code
              </ToggleButton>
              <ToggleButton value="name" sx={{ textTransform: 'none', px: 3 }}>
                Name & surname
              </ToggleButton>
            </ToggleButtonGroup>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {mode === 'code' ? (
                <TextField
                  type="text"
                  value={inviteId}
                  onChange={(e) => setInviteId(e.target.value.toUpperCase())}
                  placeholder="Enter your invite code"
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
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    disabled={loading}
                    variant="outlined"
                    fullWidth
                    autoComplete="given-name"
                  />
                  <TextField
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    disabled={loading}
                    variant="outlined"
                    fullWidth
                    autoComplete="family-name"
                  />
                </Box>
              )}

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
                  disabled={loading || !canSubmit}
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
                  {loading ? 'Verifying...' : 'Continue'}
                </CustomButton>
              </motion.div>
            </Box>

            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 3, textAlign: 'center' }}>
              Need help? Contact us
            </Typography>
          </Box>
        </TextCard>
      </Box>
    </Box>
  );
}
