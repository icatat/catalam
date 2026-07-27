'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Alert,
  CircularProgress,
  Dialog,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';
import CustomButton from '@/components/Button';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (guestData: GuestData & {
    has_rsvp_romania?: boolean;
    has_rsvp_vietnam?: boolean;
  }) => void;
}

type LookupMode = 'code' | 'name';

export function InviteModal({ isOpen, onClose, onVerified }: InviteModalProps) {
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
      setError(mode === 'code' ? 'Please enter your access code' : 'Please enter your first and last name');
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
        setError(data.error || 'We could not find that invitation. Please check and try again.');
        setLoading(false);
        return;
      }

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
    } catch {
      setError('We could not verify your invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: -16,
            top: -16,
            color: 'text.secondary',
          }}
        >
          <X size={24} />
        </IconButton>

        <Box sx={{ textAlign: 'center' }}>

          <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 2 }}>
            Welcome to Our Wedding!
          </Typography>

          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Please enter your access code or your name to view wedding details and RSVP
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
              Access code
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
                placeholder="Enter your access code"
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

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

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
                startIcon={loading && <CircularProgress size={20} color="inherit" /> }
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

          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 3, display: 'block' }}>
            Don&apos;t have an access code? Contact us for assistance
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
