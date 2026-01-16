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
} from '@mui/material';
import { Location } from '@/models/RSVP';
import CustomButton from '@/components/Button';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (guestData: {
    invite_id: string;
    full_name: string;
    location: Location[];
    rsvp: Location[];
  }) => void;
  onSkip: () => void;
}

export function InviteModal({ isOpen, onClose, onVerified, onSkip }: InviteModalProps) {
  const theme = useTheme();
  const [inviteId, setInviteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId.trim()) {
      setError('Please enter your invite code');
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
        setError('Invalid invite code. Please check and try again, or skip to continue browsing.');
        setLoading(false);
        return;
      }

      onVerified({
        invite_id: inviteId.trim(),
        full_name: data.full_name,
        location: data.location,
        rsvp: data.rsvp || [],
      });
    } catch (err) {
      setError('Invalid invite code. Please check and try again, or skip to continue browsing.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onClose();
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

          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
            Please enter your invitation code to access wedding details and RSVP
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

              <CustomButton
                onClick={handleSkip}
                variant="text"
                size="medium"
                fullWidth
                sx={{
                  py: 1,
                  fontSize: '0.9rem',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                Skip for now
              </CustomButton>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 3, display: 'block' }}>
            Don't have an invite code? Contact us for assistance
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
