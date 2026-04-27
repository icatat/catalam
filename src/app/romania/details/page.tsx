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

export default function RomaniaDetails() {
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
        if (data.romania) {
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
          } as any);
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
    fetch('/api/romania-faq')
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
            sx={{ borderBottom: `2px solid ${theme.palette.primary.main}` }}
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Loading...</Typography>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Fixed Background Layer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(135deg, rgba(239, 217, 223, 0.15) 0%, rgba(239, 217, 223, 0.15) 25%, rgba(239, 217, 223, 0.2) 50%, rgba(239, 217, 223, 0.1) 75%, rgba(239, 217, 223, 0.15) 100%), url(/background-main.webp)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          zIndex: -1
        }}
      />

      <Navigation currentPage="romania" showRomania={true} showVietnam={(guestData as any)?.vietnam} />

      <Container maxWidth="lg">
        <Box sx={{ pt: { xs: 8, md: 10 }, pb: 2 }}>
          <IconButton
            onClick={() => router.push('/romania')}
            sx={{ color: theme.palette.primary.main, mb: 2 }}
          >
            <ArrowLeft />
          </IconButton>
        </Box>

        <ScrollReveal direction="up" delay={0.1}>
          <Box sx={{ pb: 8 }}>
            <Typography variant="h2" component="h1" sx={{
              fontFamily: '"Arizonia", cursive',
              color: theme.palette.primary.dark,
              fontWeight: 400,
              mb: 6,
              textAlign: 'center',
              fontSize: { xs: '3rem', md: '4rem' }
            }}>
              Details & FAQ
            </Typography>

            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                p: { xs: 3, md: 5 },
                boxShadow: theme.shadows[4],
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mt: 3,
                  mb: 2,
                },
                '& p': {
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  mb: 2,
                },
                '& a': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                  '&:hover': { color: theme.palette.primary.dark },
                },
                '& ul, & ol': {
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  pl: 3,
                  mb: 2,
                },
                '& blockquote': {
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  pl: 2,
                  ml: 0,
                  my: 2,
                  fontStyle: 'italic',
                  color: theme.palette.text.secondary,
                },
                '& code': {
                  backgroundColor: theme.palette.grey[100],
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontSize: '0.9em',
                  fontFamily: 'monospace',
                },
                '& pre': {
                  backgroundColor: theme.palette.grey[100],
                  p: 2,
                  borderRadius: 2,
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
