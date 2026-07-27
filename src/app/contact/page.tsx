'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import CustomButton from '@/components/Button';
import { Box, Card, CardContent, Typography, Grid, Container, useTheme } from '@mui/material';
import { Email, LocationOn, CheckCircle } from '@mui/icons-material';
import { useInviteAccess } from '@/hooks/useInviteAccess';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function BackgroundTexture() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(/background-main.webp)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}

function Ornament() {
  return (
    <Typography
      aria-hidden="true"
      sx={{
        fontFamily: '"Cormorant Garamond", serif',
        fontStyle: 'italic',
        color: '#a8916b',
        fontSize: '1.25rem',
        letterSpacing: '0.4em',
        mb: 2,
      }}
    >
      ·   ·   ·
    </Typography>
  );
}

export default function ContactPage() {
  const theme = useTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showRomania, showVietnam } = useInviteAccess();

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
      <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <BackgroundTexture />
        <Navigation currentPage="contact" showRomania={showRomania} showVietnam={showVietnam} />

        <Container maxWidth="md" sx={{ py: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ maxWidth: 540, width: '100%' }}>
              <CardContent sx={{ p: { xs: 5, md: 7 }, textAlign: 'center' }}>
                <CheckCircle
                  sx={{
                    fontSize: '2.5rem',
                    color: '#b88880',
                    mb: 3,
                  }}
                />
                <Ornament />
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                    fontSize: { xs: '2rem', md: '2.4rem' },
                    lineHeight: 1.15,
                    mb: 1.5,
                  }}
                >
                  Message sent
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                    mb: 4,
                  }}
                >
                  Thank you for reaching out — we&apos;ll be in touch soon.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <CustomButton
                    onClick={() => setShowConfirmation(false)}
                    variant="outlined"
                  >
                    Send another
                  </CustomButton>
                  <CustomButton
                    onClick={() => { window.location.href = '/'; }}
                    variant="contained"
                  >
                    Back to home
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
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundTexture />
      <Navigation currentPage="contact" />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Ornament />
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Arizonia", cursive',
              color: theme.palette.primary.dark,
              fontWeight: 400,
              fontSize: { xs: '3.5rem', md: '5rem' },
              lineHeight: 1.05,
              mb: 1.5,
            }}
          >
            Get in touch
          </Typography>
          <Typography
            sx={{
              color: '#8e645d',
              fontFamily: '"Thasadith", sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
            }}
          >
            We&apos;d love to hear from you
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ maxWidth: 1100, mx: 'auto' }}>
          {/* Contact Form */}
          <Grid item xs={12} lg={7}>
            <ContactForm
              onSubmit={handleSubmit}
              onSuccess={handleSuccess}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={5}>
            <Card>
              <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                <Typography
                  sx={{
                    color: '#8e645d',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    mb: 1,
                  }}
                >
                  Direct
                </Typography>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.6rem',
                    fontWeight: 500,
                    color: theme.palette.primary.dark,
                    mb: 3.5,
                    lineHeight: 1.2,
                  }}
                >
                  Reach us directly
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Email sx={{ color: '#b88880', fontSize: '1.25rem', mt: 0.5 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#8e645d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.25em',
                          mb: 0.5,
                        }}
                      >
                        Email
                      </Typography>
                      <Typography
                        component="a"
                        href="mailto:catalam@catalam.com"
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontStyle: 'italic',
                          fontSize: '1.15rem',
                          color: theme.palette.primary.dark,
                          textDecoration: 'none',
                          borderBottom: '1px solid #d9b9b2',
                          '&:hover': {
                            color: '#b88880',
                            borderBottomColor: '#b88880',
                          },
                        }}
                      >
                        catalam@catalam.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOn sx={{ color: '#b88880', fontSize: '1.25rem', mt: 0.5 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#8e645d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.25em',
                          mb: 0.5,
                        }}
                      >
                        Locations
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontStyle: 'italic',
                          fontSize: '1.1rem',
                          color: theme.palette.text.primary,
                          mb: 0.25,
                        }}
                      >
                        Oradea, Romania
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontStyle: 'italic',
                          fontSize: '1.1rem',
                          color: theme.palette.text.primary,
                        }}
                      >
                        Cam Ranh, Vietnam
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
