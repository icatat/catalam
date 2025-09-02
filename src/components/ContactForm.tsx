'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Collapse,
  Fade,
} from '@mui/material';
import { Send, CheckCircle } from '@mui/icons-material';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from './Button';
import { useTheme } from '@mui/material';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  onSuccess: () => void;
}

export default function ContactForm({ onSubmit, onSuccess }: ContactFormProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const subjectOptions = [
    { key: 'contact.subject.rsvp', value: 'rsvp' },
    { key: 'contact.subject.romania', value: 'romania' },
    { key: 'contact.subject.vietnam', value: 'vietnam' },
    { key: 'contact.subject.travel', value: 'travel' },
    { key: 'contact.subject.dietary', value: 'dietary' },
    { key: 'contact.subject.gifts', value: 'gifts' },
    { key: 'contact.subject.general', value: 'general' },
    { key: 'contact.subject.other', value: 'other' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.name.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.email.invalid');
    }

    if (!formData.subject) {
      newErrors.subject = t('validation.subject.required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('validation.message.required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('validation.message.minLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
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
      setShowSuccess(true);
      
      // Auto-hide success message and call onSuccess after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card 
      elevation={3}
      sx={{ 
        borderRadius: 3,
        overflow: 'visible',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            {t('contact.form.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('contact.description')}
          </Typography>
        </Box>

        <Collapse in={showSuccess}>
          <Alert 
            icon={<CheckCircle fontSize="inherit" />}
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('contact.sent.message')}
            </Typography>
          </Alert>
        </Collapse>

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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              type="email"
              label={`${t('common.email')} *`}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Subject Field */}
            <FormControl fullWidth error={!!errors.subject}>
              <InputLabel>{t('contact.form.subject')} *</InputLabel>
              <Select
                value={formData.subject}
                onChange={handleInputChange('subject')}
                label={`${t('contact.form.subject')} *`}
                disabled={isSubmitting}
                sx={{ borderRadius: 2 }}
              >
                {subjectOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.key)}
                  </MenuItem>
                ))}
              </Select>
              {errors.subject && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                  {errors.subject}
                </Typography>
              )}
            </FormControl>

            {/* Message Field */}
            <TextField
              fullWidth
              multiline
              rows={6}
              label={`${t('contact.form.message')} *`}
              value={formData.message}
              onChange={handleInputChange('message')}
              error={!!errors.message}
              helperText={errors.message}
              placeholder={t('contact.form.placeholder.message')}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Submit Button */}
            <Fade in={!showSuccess}>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  weddingVariant="primary"
                  loading={isSubmitting}
                  loadingText={t('contact.form.sending')}
                  icon={!isSubmitting ? <Send /> : undefined}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {t('contact.form.send')}
                </Button>
              </Box>
            </Fade>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}