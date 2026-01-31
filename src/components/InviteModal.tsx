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
}

export function InviteModal({ isOpen, onClose, onVerified }: InviteModalProps) {
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
        setError('Invalid access code. Please check and try again.');
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
      setError('Invalid access code. Please check and try again.');
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

          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
            Please enter your access code to view wedding details and RSVP
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 3, display: 'block' }}>
            Don't have an access code? Contact us for assistance
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
