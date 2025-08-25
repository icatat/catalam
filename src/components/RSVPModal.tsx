'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
  Slide,
  Alert,
} from '@mui/material';
import { Close, Person, Email, Phone, Group, Restaurant, Message } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { useLanguage } from '@/contexts/LanguageContext';
import { RSVPFormData } from '@/types/wedding';
import { Location, GuestData } from '@/models/RSVP';
import Button from './Button';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RSVPFormData) => Promise<void>;
  guestData: GuestData;
  location: Location;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function RSVPModal({
  isOpen,
  onClose,
  onSubmit,
  guestData,
  location,
  variant = 'primary'
}: RSVPModalProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  const [formData, setFormData] = useState<RSVPFormData>({
    name: guestData.full_name || '',
    email: '',
    phone: '',
    rsvp: '',
    guestCount: '1',
    dietaryRestrictions: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RSVPFormData>>({});

  const locationName = location === Location.ROMANIA ? 'Romania' : 'Vietnam';
  const hasExistingRSVP = guestData.rsvp.includes(location);
  const weddingVariant = 'primary'; // Use unified theme

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: guestData.full_name || '',
        email: '',
        phone: '',
        rsvp: '',
        guestCount: '1',
        dietaryRestrictions: '',
        message: ''
      });
      setErrors({});
    }
  }, [isOpen, guestData.full_name]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RSVPFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('common.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('common.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.rsvp) {
      newErrors.rsvp = t('common.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RSVPFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {hasExistingRSVP ? t('rsvp.modal.title.modify') : t('rsvp.modal.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('wedding.hero.title', { location: locationName })}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Close />
          </IconButton>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Chip 
            icon={<Person />}
            label={`${t('rsvp.modal.welcome', { name: guestData.full_name })}`}
            variant="outlined"
            color={variant === 'primary' ? 'primary' : 'secondary'}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {hasExistingRSVP && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            {t('rsvp.modal.already.message')}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'grid', gap: 3 }}>
            {/* Name Field */}
            <TextField
              fullWidth
              label={`${t('common.name')} *`}
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              type="email"
              label={`${t('rsvp.field.email')} *`}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />

            {/* Phone Field */}
            <TextField
              fullWidth
              label={t('rsvp.field.phone')}
              value={formData.phone}
              onChange={handleInputChange('phone')}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />

            {/* Attendance Selection */}
            <FormControl error={!!errors.rsvp}>
              <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {t('rsvp.field.attending')} *
              </FormLabel>
              <RadioGroup
                value={formData.rsvp}
                onChange={handleInputChange('rsvp')}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color={variant === 'primary' ? 'primary' : 'secondary'} />}
                  label={t('rsvp.option.yes')}
                  disabled={isSubmitting}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color={variant === 'primary' ? 'primary' : 'secondary'} />}
                  label={t('rsvp.option.no')}
                  disabled={isSubmitting}
                />
              </RadioGroup>
              {errors.rsvp && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.rsvp}
                </Typography>
              )}
            </FormControl>

            {formData.rsvp === 'true' && (
              <>
                {/* Guest Count */}
                <TextField
                  fullWidth
                  type="number"
                  label={t('rsvp.field.guestCount')}
                  value={formData.guestCount}
                  onChange={handleInputChange('guestCount')}
                  disabled={isSubmitting}
                  inputProps={{ min: 1, max: 10 }}
                  InputProps={{
                    startAdornment: <Group sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />

                {/* Dietary Restrictions */}
                <TextField
                  fullWidth
                  label={t('rsvp.field.dietary')}
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange('dietaryRestrictions')}
                  placeholder={t('rsvp.placeholder.dietary')}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: <Restaurant sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </>
            )}

            {/* Message Field */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('rsvp.field.message')}
              value={formData.message}
              onChange={handleInputChange('message')}
              placeholder={t('rsvp.placeholder.message')}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <Message sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                ),
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{ mr: 1 }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          weddingVariant={weddingVariant}
          loading={isSubmitting}
          loadingText={t('rsvp.submitting')}
          sx={{ minWidth: 120 }}
        >
          {t('common.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}