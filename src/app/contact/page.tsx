'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import { themeClasses } from '@/lib/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import CustomButton from '@/components/Button';
import { Send } from 'lucide-react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { Email, LocationOn } from '@mui/icons-material';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (data: ContactFormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(t('error.contact'));
    }
  };

  const handleSuccess = () => {
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <>
        <div className={cn("min-h-screen", themeClasses.gradientBg('primary'))}>
          <Navigation currentPage="contact" />
          
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-xl p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className={cn(themeClasses.heading('h2', 'primary'), 'mb-4')}>
                  {t('contact.sent.title')}
                </h2>
                
                <p className={cn(themeClasses.body('large'), 'text-gray-700 mb-6')}>
                  {t('contact.sent.message')}
                </p>
                
                <div className="flex gap-3">
                  <CustomButton
                    onClick={() => setShowConfirmation(false)}
                    variant="outlined"
                    size="medium"
                    sx={{ flex: 1 }}
                  >
                    {t('contact.sent.another')}
                  </CustomButton>
                  <CustomButton
                    onClick={() => {window.location.href = '/';}}
                    variant="contained"
                    weddingVariant="romania"
                    size="medium"
                    sx={{ flex: 1 }}
                  >
                    {t('contact.sent.home')}
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cn("min-h-screen", themeClasses.gradientBg('primary'))}>
        <Navigation currentPage="contact" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className={cn(themeClasses.heading('h1', 'primary'), 'mb-4')}>
                {t('contact.title')}
              </h1>
              <p className={cn(themeClasses.body('large'), 'text-gray-700 max-w-2xl mx-auto')}>
                {t('contact.description')}
              </p>
            </div>

            <Grid container spacing={6}>
              {/* Contact Form */}
              <Grid item xs={12} lg={6}>
                <ContactForm
                  onSubmit={handleSubmit}
                  onSuccess={handleSuccess}
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} lg={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                        {t('contact.info.title')}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Email sx={{ color: 'primary.main', fontSize: '1.25rem', mt: 0.25 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                              {t('common.email')}
                            </Typography>
                            <Typography
                              component="a"
                              href="mailto:catalam@catalam.com"
                              variant="body1"
                              sx={{
                                color: 'primary.main',
                                textDecoration: 'underline',
                                '&:hover': { color: 'primary.dark' },
                              }}
                            >
                              catalam@catalam.com
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <LocationOn sx={{ color: 'secondary.main', fontSize: '1.25rem', mt: 0.25 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                              {t('contact.info.locations')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                              📍 {t('contact.info.romania')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              📍 {t('contact.info.vietnam')}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                        {t('contact.links.title')}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography
                          component="a"
                          href="/romania"
                          variant="body1"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'underline',
                            '&:hover': { color: 'primary.dark' },
                            display: 'block',
                          }}
                        >
                          → {t('contact.links.romania')}
                        </Typography>
                        <Typography
                          component="a"
                          href="/vietnam"
                          variant="body1"
                          sx={{
                            color: 'secondary.main',
                            textDecoration: 'underline',
                            '&:hover': { color: 'secondary.dark' },
                            display: 'block',
                          }}
                        >
                          → {t('contact.links.vietnam')}
                        </Typography>
                        <Typography
                          component={Link}
                          href="/"
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            textDecoration: 'underline',
                            '&:hover': { color: 'text.primary' },
                            display: 'block',
                          }}
                        >
                          → {t('contact.links.home')}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card 
                    elevation={1} 
                    sx={{ 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.6 }}>
                        &quot;{t('contact.quote')}&quot;
                        <br />
                        <Typography component="span" variant="caption" sx={{ color: 'text.disabled', mt: 1, display: 'block' }}>
                          - Catalina & Lam
                        </Typography>
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
}