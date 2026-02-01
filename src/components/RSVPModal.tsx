'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Divider,
  Slide,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  Paper,
  Chip,
} from '@mui/material';
import { Close, Person, Email, Phone, Group, Restaurant, Message, CheckCircle, Cancel } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { RSVPFormData } from '@/types/wedding';
import { Location, GuestData, GroupMemberData } from '@/models/RSVP';
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
  const theme = useTheme();
  const fullName = `${guestData.first_name} ${guestData.last_name}`;
  const [formData, setFormData] = useState<RSVPFormData>({
    name: fullName || '',
    email: '',
    phone: '',
    rsvp: '',
    guestCount: '1',
    dietaryRestrictions: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RSVPFormData>>({});
  const [phonePrefix, setPhonePrefix] = useState<string>(
    location === Location.ROMANIA ? '+40' : '+84'
  );
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<Record<string, boolean>>({});

  const locationName = location === Location.ROMANIA ? 'Romania' : 'Vietnam';
  const hasExistingRSVP = location === Location.ROMANIA
    ? (guestData as any).has_rsvp_romania
    : (guestData as any).has_rsvp_vietnam;
  const weddingVariant = 'primary'; // Use unified theme

  // Phone prefix options based on common countries for each wedding
  const phoneOptions =  [
    { code: '+40', country: '🇷🇴 Romania', flag: '🇷🇴' },
    { code: '+1', country: '🇺🇸 US/Canada', flag: '🇺🇸' },
    { code: '+44', country: '🇬🇧 UK', flag: '🇬🇧' },
    { code: '+49', country: '🇩🇪 Germany', flag: '🇩🇪' },
    { code: '+33', country: '🇫🇷 France', flag: '🇫🇷' },
    { code: '+39', country: '🇮🇹 Italy', flag: '🇮🇹' },
    { code: '+34', country: '🇪🇸 Spain', flag: '🇪🇸' },
    { code: '+84', country: '🇻🇳 Vietnam', flag: '🇻🇳' },
    { code: '+86', country: '🇨🇳 China', flag: '🇨🇳' },
    { code: '+61', country: '🇦🇺 Australia', flag: '🇦🇺' },
    { code: '+30', country: '🇬🇷 Greece', flag: '🇬🇷' },
    { code: '+359', country: '🇧🇬 Bulgaria', flag: '🇧🇬' },
    { code: '+381', country: '🇷🇸 Serbia', flag: '🇷🇸' },
    { code: '+977', country: '🇳🇵 Nepal', flag: '🇳🇵' },
    { code: '+91', country: '🇮🇳 India', flag: '🇮🇳' },

  ];

  // Get group members eligible for this location (excluding current user)
  const eligibleGroupMembers = useMemo(() => {
    return (guestData.group_members || []).filter(
      (member) => member.invite_id !== guestData.invite_id &&
      (location === Location.ROMANIA ? member.romania : member.vietnam)
    );
  }, [guestData.group_members, guestData.invite_id, location]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const fullName = `${guestData.first_name} ${guestData.last_name}`;
      setFormData({
        name: fullName || '',
        email: '',
        phone: '',
        rsvp: '',
        guestCount: '1',
        dietaryRestrictions: '',
        message: ''
      });
      setPhonePrefix(location === Location.ROMANIA ? '+40' : '+84');
      setErrors({});

      // Initialize group member selections
      const initialSelections: Record<string, boolean> = {};
      eligibleGroupMembers.forEach(member => {
        initialSelections[member.invite_id] = false;
      });
      setSelectedGroupMembers(initialSelections);
    }
  }, [isOpen, guestData.first_name, guestData.last_name, location]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RSVPFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.rsvp) {
      newErrors.rsvp = 'Required';
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
      // Build group member RSVPs array
      const groupMemberRSVPs = eligibleGroupMembers
        .filter(member => selectedGroupMembers[member.invite_id])
        .map(member => ({
          invite_id: member.invite_id,
          first_name: member.first_name,
          last_name: member.last_name,
          attending: true, // They're only included if attending
        }));

      // Combine phone prefix with phone number for submission
      const formDataWithFullPhone = {
        ...formData,
        phone: formData.phone ? `${phonePrefix} ${formData.phone}` : '',
        groupMemberRSVPs: groupMemberRSVPs.length > 0 ? groupMemberRSVPs : undefined,
      };
      await onSubmit(formDataWithFullPhone);
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
              {hasExistingRSVP ? 'Modify Your RSVP' : 'RSVP'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {`${locationName} Wedding RSVP`}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {hasExistingRSVP && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            You&apos;ve already RSVP&apos;d for this event
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'grid', gap: 3 }}>
            {/* Name Field */}
            <TextField
              fullWidth
              label="Name *"
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
              label="Email *"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />

            {/* Phone Field with Country Prefix */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Country</InputLabel>
                <Select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  disabled={isSubmitting}
                  label="Country"
                >
                  {phoneOptions.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{option.flag}</span>
                        <span>{option.code}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                disabled={isSubmitting}
                placeholder="Your phone number"
                InputProps={{
                  startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Box>

            {/* Attendance Selection */}
            <FormControl error={!!errors.rsvp}>
              <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Will you be attending? *
              </FormLabel>
              <RadioGroup
                value={formData.rsvp}
                onChange={handleInputChange('rsvp')}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color={variant === 'primary' ? 'primary' : 'secondary'} />}
                  label="Yes, I&apos;ll be there!"
                  disabled={isSubmitting}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color={variant === 'primary' ? 'primary' : 'secondary'} />}
                  label="Sorry, I can&apos;t make it"
                  disabled={isSubmitting}
                />
              </RadioGroup>
              {errors.rsvp && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.rsvp}
                </Typography>
              )}
            </FormControl>

            {/* Group Members Section */}
            {eligibleGroupMembers.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  backgroundColor: 'action.hover',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group color="primary" />
                  Your Group Members
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  RSVP on behalf of other members in your group
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {eligibleGroupMembers.map((member) => {
                    const hasRSVP = location === Location.ROMANIA
                      ? member.has_rsvp_romania
                      : member.has_rsvp_vietnam;

                    return (
                      <Box
                        key={member.invite_id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          backgroundColor: 'background.paper',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                          <Checkbox
                            checked={selectedGroupMembers[member.invite_id] || false}
                            onChange={(e) => {
                              setSelectedGroupMembers(prev => ({
                                ...prev,
                                [member.invite_id]: e.target.checked
                              }));
                            }}
                            disabled={isSubmitting || formData.rsvp !== 'true'}
                            color="primary"
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {member.first_name} {member.last_name}
                          </Typography>
                        </Box>
                        {hasRSVP && (
                          <Chip
                            size="small"
                            icon={<CheckCircle />}
                            label="RSVP'd"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
                {formData.rsvp !== 'true' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Select &quot;Yes, I&apos;ll be there!&quot; above to RSVP for group members
                  </Alert>
                )}
              </Paper>
            )}

            {formData.rsvp === 'true' && (
              <>
                {/* Guest Count */}
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Guests"
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
                  label="Dietary Restrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange('dietaryRestrictions')}
                  placeholder="Let us know about any dietary restrictions"
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
              label="Message"
              value={formData.message}
              onChange={handleInputChange('message')}
              placeholder="Any special requests or messages for us?"
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          weddingVariant={weddingVariant}
          loading={isSubmitting}
          loadingText="Submitting..."
          sx={{ minWidth: 120 }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}