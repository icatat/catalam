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
import MuiButton from './MuiButton';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface MuiContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  onSuccess: () => void;
}

export default function MuiContactForm({ onSubmit, onSuccess }: MuiContactFormProps) {
  const { t } = useLanguage();
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
    'RSVP Help',
    'Romania Wedding',
    'Vietnam Wedding',
    'Travel & Accommodation',
    'Dietary Requirements',
    'Gift Registry',
    'General Question',
    'Other'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
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
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
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
                  <MenuItem key={option} value={option}>
                    {option}
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
                <MuiButton
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  weddingVariant="romania"
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
                </MuiButton>
              </Box>
            </Fade>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}