'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import CustomButton from '@/components/Button';
import { Box, Card, CardContent, Typography, Grid, Container, Avatar, useTheme } from '@mui/material';
import { Email, LocationOn, CheckCircle } from '@mui/icons-material';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const theme = useTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (data: ContactFormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to send message. Please try again.');
    }
  };

  const handleSuccess = () => {
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/background-main.png)`, backgroundRepeat: 'repeat', backgroundSize: 'contain', backgroundAttachment: 'fixed', position: 'relative' }}>

        <Navigation currentPage="contact" />
        
        <Container maxWidth="md" sx={{ py: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card elevation={8} sx={{ maxWidth: 600, width: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: theme.palette.success.light, 
                    mx: 'auto', 
                    mb: 3 
                  }}
                >
                  <CheckCircle sx={{ fontSize: '2rem', color: theme.palette.success.main }} />
                </Avatar>
                
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                >
                  Message Sent!
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.secondary, mb: 4 }}
                >
                  Thank you for reaching out! We'll get back to you soon.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CustomButton
                    onClick={() => setShowConfirmation(false)}
                    variant="outlined"
                    size="medium"
                    sx={{ flex: 1 }}
                  >
                    Send Another Message
                  </CustomButton>
                  <CustomButton
                    onClick={() => {window.location.href = '/';}}
                    variant="contained"
                    size="medium"
                    sx={{ flex: 1 }}
                  >
                    Back to Home
                  </CustomButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/background-main.png)`, backgroundRepeat: 'repeat', backgroundSize: 'contain', backgroundAttachment: 'fixed', position: 'relative' }}>

      <Navigation currentPage="contact" />
      
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ color: theme.palette.primary.main, fontWeight: 700 }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, maxWidth: 600, mx: 'auto' }}
            >
              We'd love to hear from you! Send us a message and we'll respond as soon as possible.
            </Typography>
          </Box>

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
                        Contact Information
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Email sx={{ color: 'primary.main', fontSize: '1.25rem', mt: 0.25 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                              Email
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
                              Wedding Locations
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                              📍 Oradea, Romania
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              📍 Cam Ranh, Vietnam
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
        </Box>
      </Container>
    </Box>
  );
}