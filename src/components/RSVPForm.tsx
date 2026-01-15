'use client';

import { useState } from 'react';
import { RSVPFormData, RSVPOption } from '@/types/wedding';
import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Select, 
  MenuItem, 
  InputLabel, 
  useTheme,
  Container,
  Card,
  CardContent
} from '@mui/material';
import CustomButton from '@/components/Button';

interface RSVPFormProps {
  title: string;
  subtitle: string;
  submitText?: string;
  onSubmit?: (data: RSVPFormData) => void;
  rsvpOptions?: RSVPOption[];
  placeholderMessage?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export type { RSVPFormData };

export default function RSVPForm({
  title,
  subtitle,
  submitText,
  onSubmit,
  rsvpOptions,
  placeholderMessage,
  variant = 'primary'
}: RSVPFormProps) {

  // Set defaults
  const finalSubmitText = submitText || 'Submit';
  const finalRsvpOptions = rsvpOptions || [
    { value: 'true', label: "Yes, I'll be there!" },
    { value: 'false', label: "Sorry, I can't make it" }
  ];
  const finalPlaceholderMessage = placeholderMessage || 'Any special requests or messages for us?';
  const theme = useTheme();
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    phone: '',
    rsvp: '',
    guestCount: '1',
    dietaryRestrictions: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string; name?: string } }) => {
    const target = e.target;
    const name = target.name || '';
    const value = target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'secondary': return theme.palette.secondary.main;
      case 'accent': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[8] }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                color: getVariantColor(), 
                fontWeight: 600, 
                mb: 2, 
                textAlign: 'center' 
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary, 
                mb: 4, 
                textAlign: 'center',
                fontSize: '1.125rem'
              }}
            >
              {subtitle}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name Field */}
              <TextField
                label="Name *"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Email Field */}
              <TextField
                label="Email *"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Phone Field */}
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* RSVP Field */}
              <FormControl component="fieldset" required>
                <FormLabel component="legend" sx={{ color: theme.palette.text.primary, fontWeight: 500, mb: 2 }}>
                  Will you be attending? *
                </FormLabel>
                <RadioGroup
                  name="rsvp"
                  value={formData.rsvp}
                  onChange={handleInputChange}
                  sx={{ gap: 1 }}
                >
                  {finalRsvpOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio sx={{ color: getVariantColor() }} />}
                      label={option.label}
                      sx={{
                        m: 0,
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Guest Count Field */}
              <FormControl fullWidth>
                <InputLabel>Number of Guests</InputLabel>
                <Select
                  name="guestCount"
                  value={formData.guestCount}
                  label="Number of Guests"
                  onChange={handleInputChange}
                  sx={{ borderRadius: 2 }}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <MenuItem key={num} value={num.toString()}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dietary Restrictions Field */}
              <TextField
                label="Dietary Restrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                placeholder="Let us know about any dietary restrictions"
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Message Field */}
              <TextField
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder={finalPlaceholderMessage}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <CustomButton
                  type="submit"
                  variant="contained"
                  size="large"
                  weddingVariant={variant}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    minWidth: 200,
                  }}
                >
                  {finalSubmitText}
                </CustomButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}