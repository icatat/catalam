'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Button } from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Timeline from '@/components/Timeline';
import TimelineUpload from '@/components/TimelineUpload';
import { Heart, ArrowUpDown, Upload } from 'lucide-react';
import Image from 'next/image';

interface TimelineEvent {
  id: string;
  date: string | null;
  title: string;
  description: string | null;
  image?: string;
  location?: string | null;
  tag?: string | null;
}

export default function AboutPage() {
  const { t } = useLanguage();
  const theme = useTheme();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchTimelineData();
  }, []);

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
        background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/landmarks.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
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
            {t('about.title')}
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
            {t('about.description')}
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
            {reverseOrder ? t('timeline.newest') : t('timeline.oldest')} {t('common.first')}
          </Button>
          
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
          >
            Add Memory
          </Button>
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
                {t('common.loading')}
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
                {t('timeline.empty.title')}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 400
                }}
              >
                {t('timeline.empty.message')}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* Upload Modal */}
      <TimelineUpload 
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </Box>
  );
}