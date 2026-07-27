'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Box, useTheme, Container, Typography, IconButton } from '@mui/material';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';

export default function VietnamDetails() {
  const theme = useTheme();
  const router = useRouter();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [faqContent, setFaqContent] = useState<string>('');

  useEffect(() => {
    const savedInviteId = Cookies.get('invite_id');
    if (!savedInviteId) {
      router.push('/');
      return;
    }

    fetch('/api/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_id: savedInviteId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.vietnam) {
          setGuestData({
            invite_id: savedInviteId,
            first_name: data.first_name,
            last_name: data.last_name,
            vietnam: data.vietnam,
            romania: data.romania,
            group: data.group,
            has_rsvp_romania: data.has_rsvp_romania,
            has_rsvp_vietnam: data.has_rsvp_vietnam,
            group_members: data.group_members || [],
          } as GuestData);
          setIsVerifying(false);
        } else {
          router.push('/');
        }
      })
      .catch(() => {
        Cookies.remove('invite_id');
        router.push('/');
      });
  }, [router]);

  useEffect(() => {
    fetch('/api/vietnam-faq')
      .then(response => response.json())
      .then(data => {
        setFaqContent(data.content || '');
      })
      .catch(error => {
        console.error('Error loading FAQ:', error);
      });
  }, []);

  if (isVerifying || !guestData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Box
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            sx={{ borderBottom: `2px solid ${theme.palette.primary.dark}` }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Loading...</Typography>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: 'background.default' }}>
      {/* Subtle textured background — image only */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Navigation currentPage="vietnam" showRomania={guestData?.romania} showVietnam={true} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ pt: { xs: 8, md: 10 }, pb: 2 }}>
          <IconButton
            onClick={() => router.push('/vietnam')}
            sx={{ color: theme.palette.primary.dark, mb: 2 }}
            aria-label="Back to Vietnam"
          >
            <ArrowLeft />
          </IconButton>
        </Box>

        <ScrollReveal direction="up" delay={0.1}>
          <Box sx={{ pb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
              <Typography
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
                Details &amp; FAQ
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
                Cam Ranh, Vietnam
              </Typography>
            </Box>

            <Box sx={{
              bgcolor: 'background.paper',
              borderRadius: '12px',
              border: '1px solid rgba(32, 72, 91, 0.08)',
              boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 12px 28px -16px rgba(32, 72, 91, 0.18)',
              overflow: 'hidden',
            }}>
              <Box sx={{ p: { xs: 3.5, md: 5 } }}>
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
                  About Cam Ranh
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                    fontSize: { xs: '1.75rem', md: '2.1rem' },
                    lineHeight: 1.2,
                    mb: 2.5,
                  }}
                >
                  A coastal celebration
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary, lineHeight: 1.7, mb: 4 }}>
                  Celebrate with us in Cam Ranh for our Vietnamese wedding ceremony — a coastal city of warm sand,
                  clear water, and quiet evenings that will host our gathering.
                </Typography>

                <Box sx={{
                  pt: 3,
                  borderTop: '1px solid #d8c8a8',
                }}>
                  <Typography
                    sx={{
                      color: '#8e645d',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3em',
                      mb: 0.75,
                    }}
                  >
                    Venue
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontSize: '1.4rem',
                      color: theme.palette.primary.dark,
                      mb: 0.5,
                    }}
                  >
                    Axi Plaza
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
                    Long Beach, Cam Ranh
                  </Typography>
                </Box>
              </Box>

              {/* Google Maps Embed */}
              <Box
                sx={{
                  borderTop: '1px solid rgba(32, 72, 91, 0.08)',
                  '& iframe': {
                    width: '100%',
                    height: { xs: '300px', md: '420px' },
                    border: 0,
                    display: 'block',
                  },
                }}
              >
                <iframe
                  title="Axi Plaza — Cam Ranh, Vietnam"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.1816907666766!2d109.19066187549655!3d12.099710933392787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31708b0007fcb571%3A0x54f3fd6333ad65b2!2sAxi%20Plaza!5e0!3m2!1sen!2sus!4v1779581693797!5m2!1sen!2sus"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Box>

            <Box
              sx={{
                mt: 5,
                bgcolor: 'background.paper',
                borderRadius: '12px',
                p: { xs: 3.5, md: 6 },
                border: '1px solid rgba(32, 72, 91, 0.08)',
                boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 12px 28px -16px rgba(32, 72, 91, 0.18)',
                '& h1, & h2, & h3': {
                  fontFamily: '"Cormorant Garamond", serif',
                  color: theme.palette.primary.dark,
                  fontWeight: 500,
                  mt: 4,
                  mb: 1.5,
                  lineHeight: 1.2,
                  '&:first-of-type': { mt: 0 },
                },
                '& h2': { fontSize: { xs: '1.6rem', md: '1.9rem' } },
                '& h3': { fontSize: { xs: '1.3rem', md: '1.5rem' } },
                '& h4, & h5, & h6': {
                  fontFamily: '"Thasadith", sans-serif',
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  fontSize: { xs: '1.05rem', md: '1.1rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mt: 3,
                  mb: 1,
                },
                '& p': {
                  fontFamily: '"Thasadith", sans-serif',
                  color: theme.palette.text.primary,
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  mb: 1.5,
                },
                '& a': {
                  color: '#b88880',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(184, 136, 128, 0.4)',
                  textUnderlineOffset: '3px',
                  '&:hover': { color: '#8e645d', textDecorationColor: '#8e645d' },
                },
                '& ul, & ol': {
                  color: theme.palette.text.primary,
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  pl: 3,
                  mb: 2,
                  '& li': { mb: 0.5 },
                },
                '& blockquote': {
                  borderLeft: `3px solid #b88880`,
                  pl: 2.5,
                  ml: 0,
                  my: 2.5,
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontSize: '1.2rem',
                  color: theme.palette.text.secondary,
                },
                '& hr': {
                  border: 'none',
                  borderTop: '1px solid #d8c8a8',
                  my: 4,
                },
                '& code': {
                  backgroundColor: '#f5f1ed',
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontSize: '0.9em',
                  fontFamily: 'monospace',
                },
                '& pre': {
                  backgroundColor: '#f5f1ed',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  '& code': { backgroundColor: 'transparent', padding: 0 },
                },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {faqContent}
              </ReactMarkdown>
            </Box>
          </Box>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
