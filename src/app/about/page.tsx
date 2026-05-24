'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Button } from '@mui/material';
import Navigation from '@/components/Navigation';
import Timeline from '@/components/Timeline';
import TimelineUpload from '@/components/TimelineUpload';
import { Heart, ArrowUpDown, Upload } from 'lucide-react';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';
import { useInviteAccess } from '@/hooks/useInviteAccess';

interface TimelineEvent {
  id: string;
  date: string | null;
  title: string;
  description: string | null;
  image?: string;
  location?: string | null;
  tag?: string | null;
  from?: string | null;
}

export default function AboutPage() {
  const theme = useTheme();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const { showRomania, showVietnam } = useInviteAccess();

  useEffect(() => {
    fetchTimelineData();
    verifyGuestAccess();
  }, []);

  const verifyGuestAccess = async () => {
    try {
      const savedInviteId = Cookies.get('invite_id');
      if (savedInviteId) {
        const response = await fetch('/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invite_id: savedInviteId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          // Check if guest has RSVPed for any location
          if (data.rsvp && data.rsvp.length > 0) {
            setGuestData({
              invite_id: savedInviteId,
              first_name: data.first_name,
              last_name: data.last_name,
              vietnam: data.vietnam,
              romania: data.romania
            });
          }
        }
      }
    } catch (error) {
      console.error('Error verifying guest access:', error);
    } finally {
      // Verification complete
    }
  };

  const handleToggleOrder = () => {
    setReverseOrder(!reverseOrder);
  };

  const handleUploadSuccess = () => {
    // Refresh timeline events after successful upload
    fetchTimelineData();
  };

  const fetchTimelineData = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data = await response.json();
      setTimelineEvents(data);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setTimelineEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedEvents = reverseOrder 
    ? [...timelineEvents].reverse() 
    : timelineEvents;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: theme.spacing(2), md: theme.spacing(3) },
        position: 'relative'
      }}
    >
      {/* Subtle textured background — image only */}
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

      <Navigation currentPage="about" showRomania={showRomania} showVietnam={showVietnam} />
      
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 } }}>
        {/* Header */}
        <Box
          component={motion.div}
          sx={{ textAlign: 'center', mb: 8 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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
            variant="h1"
            component="h1"
            sx={{
              fontFamily: '"Arizonia", cursive',
              color: theme.palette.primary.dark,
              fontWeight: 400,
              mb: 1.5,
              fontSize: { xs: '3.5rem', md: '5rem' },
              lineHeight: 1.05,
            }}
          >
            Our Story
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Thasadith", sans-serif',
              color: '#8e645d',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
            }}
          >
            A timeline of us
          </Typography>
        </Box>

        {/* Timeline Controls */}
        <Box
          component={motion.div}
          sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            onClick={handleToggleOrder}
            startIcon={<ArrowUpDown />}
            variant="outlined"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {reverseOrder ? 'Newest' : 'Oldest'} First
          </Button>

          {guestData && (
            <Button
              onClick={() => setShowUpload(true)}
              startIcon={<Upload />}
              variant="contained"
              title="Have a memory together? Please share it on our timeline!"
            >
              Share a memory
            </Button>
          )}
        </Box>

        {/* Timeline */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Loading...
              </Typography>
            </Box>
          ) : timelineEvents.length > 0 ? (
            <Timeline events={sortedEvents} />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
              <Heart
                size={36}
                style={{
                  color: '#b88880',
                  marginBottom: theme.spacing(3),
                  strokeWidth: 1.25,
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  color: theme.palette.primary.dark,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: 500,
                  mb: 1.5,
                  textAlign: 'center',
                }}
              >
                Our story begins here
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 420,
                }}
              >
                Check back soon for moments and memories from our journey.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* Upload Modal */}
      {guestData && (
        <TimelineUpload 
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUploadSuccess={handleUploadSuccess}
          defaultFromValue={guestData.first_name + ' ' + guestData.last_name}
        />
      )}
    </Box>
  );
}