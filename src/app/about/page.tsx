'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Button } from '@mui/material';
import { MainPageCard } from '@/components/MainPageCard';
import Navigation from '@/components/Navigation';
import Timeline from '@/components/Timeline';
import TimelineUpload from '@/components/TimelineUpload';
import { Heart, ArrowUpDown, Upload } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { GuestData } from '@/models/RSVP';

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
              full_name: data.full_name,
              location: data.location,
              rsvp: data.rsvp || []
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
        background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/background-main.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        backgroundAttachment: 'fixed',
        p: { xs: theme.spacing(2), md: theme.spacing(3) },
        position: 'relative'
      }}
    >

      <Navigation currentPage="about" />
      
      <Container maxWidth="xl" sx={{ py: 10 }}>
        {/* Header */}
        <Box
          component={motion.div}
          sx={{ textAlign: 'center', mb: 8 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ width: 32, height: 32, mx: 'auto', mb: theme.spacing(2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src="/favicon.ico"
              alt="Wedding icon"
              width={32}
              height={32}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              mb: 3
            }}
          >
            Our Story
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            A timeline of our journey together
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
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 500,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[6]
              },
              transition: 'all 0.3s ease'
            }}
          >
            {reverseOrder ? 'Newest' : 'Oldest'} First
          </Button>
          
          {guestData && (
            <Button
              onClick={() => setShowUpload(true)}
              startIcon={<Upload />}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '0.95rem',
                fontWeight: 500,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8]
                },
                transition: 'all 0.3s ease'
              }}
              title="Have a memory together? Please share it on our timeline!"
            >
              Share your memory!
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <Heart 
                size={48} 
                style={{ 
                  color: theme.palette.primary.main,
                  marginBottom: theme.spacing(2)
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.text.primary, 
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                Our Story Begins Here
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 400
                }}
              >
                Check back soon for special moments and memories from our journey
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
          defaultFromValue={guestData.full_name}
        />
      )}
    </Box>
  );
}