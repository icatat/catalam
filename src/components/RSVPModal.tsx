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
import {
  Close,
  Person,
  Email,
  Phone,
  Group,
  Restaurant,
  Message,
  CheckCircle,
  PersonAdd,
  DeleteOutline,
  CalendarToday,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { RSVPFormData, NewGuestCreated, ItineraryEvent } from '@/types/wedding';
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

interface AdditionalGuest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phonePrefix: string;
  arrivalDate: string;
}

interface GroupMemberDetail {
  email: string;
  phone: string;
  phonePrefix: string;
  arrivalDate: string;
}

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RSVPFormData) => Promise<{ newGuests?: NewGuestCreated[] }>;
  guestData: GuestData;
  location: Location;
  variant?: 'primary' | 'secondary' | 'accent';
  rsvpableEvents?: ItineraryEvent[];
}

const phoneOptions = [
  { code: '+40', flag: '🇷🇴' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+39', flag: '🇮🇹' },
  { code: '+34', flag: '🇪🇸' },
  { code: '+84', flag: '🇻🇳' },
  { code: '+86', flag: '🇨🇳' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+30', flag: '🇬🇷' },
  { code: '+359', flag: '🇧🇬' },
  { code: '+381', flag: '🇷🇸' },
  { code: '+977', flag: '🇳🇵' },
  { code: '+91', flag: '🇮🇳' },
];

export default function RSVPModal({
  isOpen,
  onClose,
  onSubmit,
  guestData,
  location,
  variant = 'primary',
  rsvpableEvents = [],
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
    arrivalDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RSVPFormData>>({});
  const [phonePrefix, setPhonePrefix] = useState<string>(
    location === Location.ROMANIA ? '+40' : '+84'
  );
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<Record<string, boolean>>({});
  const [groupMemberDetails, setGroupMemberDetails] = useState<Record<string, GroupMemberDetail>>({});
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>([]);
  const [additionalGuestErrors, setAdditionalGuestErrors] = useState<Record<string, Partial<Record<keyof AdditionalGuest, string>>>>({});
  const [newGuestCodes, setNewGuestCodes] = useState<NewGuestCreated[]>([]);
  const [eventAttendance, setEventAttendance] = useState<Record<string, boolean>>({});

  const locationName = location === Location.ROMANIA ? 'Romania' : 'Vietnam';
  const hasExistingRSVP = location === Location.ROMANIA
    ? guestData.has_rsvp_romania
    : guestData.has_rsvp_vietnam;
  const weddingVariant = 'primary';

  const defaultMemberPhonePrefix = location === Location.ROMANIA ? '+40' : '+84';

  const eligibleGroupMembers = useMemo(() => {
    return (guestData.group_members || []).filter(
      (member) => member.invite_id !== guestData.invite_id &&
      (location === Location.ROMANIA ? member.romania : member.vietnam)
    );
  }, [guestData.group_members, guestData.invite_id, location]);

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
        arrivalDate: '',
        message: ''
      });
      setPhonePrefix(location === Location.ROMANIA ? '+40' : '+84');
      setErrors({});

      const initialSelections: Record<string, boolean> = {};
      eligibleGroupMembers.forEach(member => {
        initialSelections[member.invite_id] = false;
      });
      setSelectedGroupMembers(initialSelections);
      setGroupMemberDetails({});
      setAdditionalGuests([]);
      setAdditionalGuestErrors({});
      setNewGuestCodes([]);

      // Default all rsvpable events to attending (true)
      const initialAttendance: Record<string, boolean> = {};
      rsvpableEvents.forEach(e => { initialAttendance[e.title] = true; });
      setEventAttendance(initialAttendance);
    }
  }, [isOpen, guestData.first_name, guestData.last_name, location]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = (): boolean => {
    const newErrors: Partial<RSVPFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.rsvp) {
      newErrors.rsvp = 'Required';
    }

    // Validate additional guests (M2: partial name, M3: email format)
    const newGuestErrors: Record<string, Partial<Record<keyof AdditionalGuest, string>>> = {};
    additionalGuests.forEach(guest => {
      const errs: Partial<Record<keyof AdditionalGuest, string>> = {};
      const hasFirst = guest.first_name.trim().length > 0;
      const hasLast = guest.last_name.trim().length > 0;
      if (hasFirst && !hasLast) errs.last_name = 'Required';
      if (!hasFirst && hasLast) errs.first_name = 'Required';
      if (guest.email.trim() && !emailRegex.test(guest.email.trim())) {
        errs.email = 'Please enter a valid email';
      }
      if (Object.keys(errs).length > 0) newGuestErrors[guest.id] = errs;
    });
    setAdditionalGuestErrors(newGuestErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newGuestErrors).length === 0;
  };

  const handleInputChange = (field: keyof RSVPFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'rsvp' && value === 'false') {
      setAdditionalGuests([]);
      setGroupMemberDetails({});
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddGuest = () => {
    setAdditionalGuests(prev => [...prev, {
      id: crypto.randomUUID(),
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      phonePrefix: defaultMemberPhonePrefix,
      arrivalDate: '',
    }]);
  };

  const handleRemoveGuest = (id: string) => {
    setAdditionalGuests(prev => prev.filter(g => g.id !== id));
    setAdditionalGuestErrors(prev => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleAdditionalGuestChange = (id: string, field: keyof AdditionalGuest, value: string) => {
    setAdditionalGuests(prev =>
      prev.map(g => g.id === id ? { ...g, [field]: value } : g)
    );
    setAdditionalGuestErrors(prev => {
      const guestErrors = { ...prev[id] };
      if (field === 'first_name' || field === 'last_name') {
        delete guestErrors['first_name'];
        delete guestErrors['last_name'];
      } else if (field === 'email') {
        delete guestErrors['email'];
      }
      return { ...prev, [id]: guestErrors };
    });
  };

  const handleGroupMemberDetailChange = (inviteId: string, field: keyof GroupMemberDetail, value: string) => {
    setGroupMemberDetails(prev => {
      const existing = prev[inviteId];
      return {
        ...prev,
        [inviteId]: {
          email: existing?.email ?? '',
          phone: existing?.phone ?? '',
          phonePrefix: existing?.phonePrefix ?? defaultMemberPhonePrefix,
          arrivalDate: existing?.arrivalDate ?? '',
          [field]: value,
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const groupMemberRSVPs = eligibleGroupMembers
        .filter(member => selectedGroupMembers[member.invite_id])
        .map(member => {
          const details = groupMemberDetails[member.invite_id] || {};
          return {
            invite_id: member.invite_id,
            first_name: member.first_name,
            last_name: member.last_name,
            attending: true,
            email: details.email?.trim() || undefined,
            phone: details.phone ? `${details.phonePrefix || defaultMemberPhonePrefix} ${details.phone}` : undefined,
            arrival_date: details.arrivalDate?.trim() || undefined,
          };
        });

      const additionalGuestRSVPs = additionalGuests
        .filter(g => g.first_name.trim() && g.last_name.trim())
        .map(g => ({
          first_name: g.first_name.trim(),
          last_name: g.last_name.trim(),
          attending: true,
          is_new_guest: true as const,
          invite_id: undefined,
          email: g.email.trim() || undefined,
          phone: g.phone ? `${g.phonePrefix} ${g.phone}` : undefined,
          arrival_date: g.arrivalDate.trim() || undefined,
        }));

      const allGroupMemberRSVPs = [...groupMemberRSVPs, ...additionalGuestRSVPs];

      const computedGuestCount = 1 + allGroupMemberRSVPs.length;

      const formDataWithFullPhone = {
        ...formData,
        phone: formData.phone ? `${phonePrefix} ${formData.phone}` : '',
        guestCount: String(computedGuestCount),
        groupMemberRSVPs: allGroupMemberRSVPs.length > 0 ? allGroupMemberRSVPs : undefined,
        eventAttendance: rsvpableEvents.length > 0 && formData.rsvp === 'true' ? eventAttendance : undefined,
      };

      const result = await onSubmit(formDataWithFullPhone);

      if (result?.newGuests && result.newGuests.length > 0) {
        setNewGuestCodes(result.newGuests);
        // Keep modal open to display invite codes
      } else {
        onClose();
      }
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
              {newGuestCodes.length > 0 ? 'New Guest Invite Codes' : hasExistingRSVP ? 'Modify Your RSVP' : 'RSVP'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {`${locationName} Wedding RSVP`}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }} aria-label="Close RSVP form">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Invite codes screen — shown after submission creates new guests */}
        {newGuestCodes.length > 0 ? (
          <Box>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              RSVP submitted! Share these invite codes with your new guests so they can access the wedding site.
            </Alert>
            {newGuestCodes.map(g => (
              <Paper key={g.invite_id} variant="outlined" sx={{ p: 2, mb: 1.5, borderRadius: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {g.first_name} {g.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Invite code: <strong style={{ letterSpacing: '0.05em' }}>{g.invite_id}</strong>
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          /* Main RSVP form */
          <>
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
                      {phoneOptions.map((o) => (<MenuItem key={o.code} value={o.code}><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><span>{o.flag}</span><span>{o.code}</span></Box></MenuItem>))}
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

                {/* Group Members + Add Someone Else Section */}
                {(eligibleGroupMembers.length > 0 || formData.rsvp === 'true') && (
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
                    {/* Existing group members */}
                    {eligibleGroupMembers.length > 0 && (
                      <>
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
                            const isSelected = selectedGroupMembers[member.invite_id] || false;
                            const details = groupMemberDetails[member.invite_id] || {
                              email: '', phone: '', phonePrefix: defaultMemberPhonePrefix, arrivalDate: ''
                            };

                            return (
                              <Box
                                key={member.invite_id}
                                sx={{
                                  backgroundColor: 'background.paper',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1.5,
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                                    <Checkbox
                                      checked={isSelected}
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

                                {/* Expanded contact/date fields when member is selected */}
                                {isSelected && formData.rsvp === 'true' && (
                                  <Box sx={{ px: 2, pb: 2, display: 'grid', gap: 1.5, borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                                    <TextField
                                      label="Their email (optional)"
                                      size="small"
                                      fullWidth
                                      type="email"
                                      value={details.email}
                                      onChange={(e) => handleGroupMemberDetailChange(member.invite_id, 'email', e.target.value)}
                                      disabled={isSubmitting}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                          value={details.phonePrefix || defaultMemberPhonePrefix}
                                          onChange={(e) => handleGroupMemberDetailChange(member.invite_id, 'phonePrefix', e.target.value)}
                                          disabled={isSubmitting}
                                          label="Country"
                                        >
                                          {phoneOptions.map((o) => (<MenuItem key={o.code} value={o.code}><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><span>{o.flag}</span><span>{o.code}</span></Box></MenuItem>))}
                                        </Select>
                                      </FormControl>
                                      <TextField
                                        label="Their phone (optional)"
                                        size="small"
                                        fullWidth
                                        value={details.phone}
                                        onChange={(e) => handleGroupMemberDetailChange(member.invite_id, 'phone', e.target.value)}
                                        disabled={isSubmitting}
                                      />
                                    </Box>
                                    <TextField
                                      label="Tentative arrival date (optional)"
                                      size="small"
                                      fullWidth
                                      value={details.arrivalDate}
                                      onChange={(e) => handleGroupMemberDetailChange(member.invite_id, 'arrivalDate', e.target.value)}
                                      placeholder="e.g. Sept 10, 2025"
                                      disabled={isSubmitting}
                                      InputProps={{
                                        startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />,
                                      }}
                                    />
                                  </Box>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </>
                    )}

                    {formData.rsvp !== 'true' && (
                      <Alert severity="info" sx={{ mt: eligibleGroupMembers.length > 0 ? 2 : 0 }}>
                        Select &quot;Yes, I&apos;ll be there!&quot; above to RSVP for group members
                      </Alert>
                    )}

                    {/* Add Someone Else section */}
                    {formData.rsvp === 'true' && (
                      <Box sx={{ mt: eligibleGroupMembers.length > 0 ? 2 : 0 }}>
                        {additionalGuests.length > 0 && (
                          <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
                            Please inform Cata and Lam about this
                          </Alert>
                        )}

                        {additionalGuests.map((guest) => {
                          const guestErrs = additionalGuestErrors[guest.id] || {};
                          return (
                          <Paper
                            key={guest.id}
                            variant="outlined"
                            sx={{ p: 2, mb: 1.5, borderRadius: 1, backgroundColor: 'background.paper' }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Additional Guest
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveGuest(guest.id)}
                                disabled={isSubmitting}
                                aria-label="Remove guest"
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                              <TextField
                                label="First name *"
                                size="small"
                                fullWidth
                                value={guest.first_name}
                                onChange={(e) => handleAdditionalGuestChange(guest.id, 'first_name', e.target.value)}
                                disabled={isSubmitting}
                                error={!!guestErrs.first_name}
                                helperText={guestErrs.first_name}
                              />
                              <TextField
                                label="Last name *"
                                size="small"
                                fullWidth
                                value={guest.last_name}
                                onChange={(e) => handleAdditionalGuestChange(guest.id, 'last_name', e.target.value)}
                                disabled={isSubmitting}
                                error={!!guestErrs.last_name}
                                helperText={guestErrs.last_name}
                              />
                            </Box>

                            <TextField
                              label="Their email (optional)"
                              size="small"
                              fullWidth
                              type="email"
                              value={guest.email}
                              onChange={(e) => handleAdditionalGuestChange(guest.id, 'email', e.target.value)}
                              disabled={isSubmitting}
                              error={!!guestErrs.email}
                              helperText={guestErrs.email}
                              sx={{ mb: 1.5 }}
                            />

                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Country</InputLabel>
                                <Select
                                  value={guest.phonePrefix}
                                  onChange={(e) => handleAdditionalGuestChange(guest.id, 'phonePrefix', e.target.value)}
                                  disabled={isSubmitting}
                                  label="Country"
                                >
                                  {phoneOptions.map((o) => (<MenuItem key={o.code} value={o.code}><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><span>{o.flag}</span><span>{o.code}</span></Box></MenuItem>))}
                                </Select>
                              </FormControl>
                              <TextField
                                label="Their phone (optional)"
                                size="small"
                                fullWidth
                                value={guest.phone}
                                onChange={(e) => handleAdditionalGuestChange(guest.id, 'phone', e.target.value)}
                                disabled={isSubmitting}
                              />
                            </Box>

                            <TextField
                              label="Tentative arrival date (optional)"
                              size="small"
                              fullWidth
                              value={guest.arrivalDate}
                              onChange={(e) => handleAdditionalGuestChange(guest.id, 'arrivalDate', e.target.value)}
                              placeholder="e.g. Sept 10, 2025"
                              disabled={isSubmitting}
                              InputProps={{
                                startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />,
                              }}
                            />
                          </Paper>
                        ); })}

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleAddGuest}
                          disabled={isSubmitting}
                          sx={{ mt: additionalGuests.length > 0 ? 0 : 0 }}
                        >
                          <PersonAdd sx={{ mr: 0.5, fontSize: '1rem' }} />
                          Add Someone Else
                        </Button>
                      </Box>
                    )}
                  </Paper>
                )}

                {formData.rsvp === 'true' && rsvpableEvents.length > 0 && (
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="primary" fontSize="small" />
                      Which events do you plan to attend?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Let us know your tentative plans — you can always update later
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {rsvpableEvents.map((event) => (
                        <Box
                          key={event.title}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Checkbox
                            checked={eventAttendance[event.title] ?? true}
                            onChange={(e) =>
                              setEventAttendance(prev => ({ ...prev, [event.title]: e.target.checked }))
                            }
                            disabled={isSubmitting}
                            color="primary"
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {event.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {event.date ? `${event.date} · ` : ''}{event.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}

                {formData.rsvp === 'true' && (
                  <>
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

                    {/* Tentative Arrival Date */}
                    <TextField
                      fullWidth
                      label="Tentative Arrival Date (optional)"
                      value={formData.arrivalDate}
                      onChange={handleInputChange('arrivalDate')}
                      placeholder="e.g. Sept 10, 2025"
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1 }} />,
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
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        {newGuestCodes.length > 0 ? (
          <Button
            onClick={onClose}
            variant="contained"
            weddingVariant={weddingVariant}
            sx={{ minWidth: 120 }}
          >
            Done
          </Button>
        ) : (
          <>
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
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
