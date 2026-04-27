'use client';

import { Box, Card, Chip, Typography, Link, useTheme, Dialog, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

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

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const theme = useTheme();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const handleImageError = (eventId: string) => {
    setImageErrors(prev => new Set([...prev, eventId]));
  };

  const generateGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const styles = {
    container: {
      position: 'relative',
      maxWidth: { xs: '100%', sm: 600, md: 900 },
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 0 }
    },
    timelineLine: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: '2px',
      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
      transform: 'translateX(-1px)',
      zIndex: 0
    },
    eventsContainer: {
      pt: 2,
      pb: 2
    }
  };

  return (
    <>
      <Box sx={styles.container}>
        {/* Timeline Line */}
        <Box sx={styles.timelineLine} />

        {/* Timeline Events */}
        <Box sx={styles.eventsContainer}>
          {events.map((event, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const hasImage = event.image && !imageErrors.has(event.id);

            return (
              <Box
                key={event.id}
                sx={{
                  display: 'flex',
                  mb: 6,
                  position: 'relative',
                  flexDirection: { xs: 'column', md: side === 'left' ? 'row' : 'row-reverse' },
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* Date Badge */}
                <Box
                  sx={{
                    position: { xs: 'relative', md: 'absolute' },
                    left: { md: '50%' },
                    top: { md: 0 },
                    transform: { md: 'translateX(-50%)' },
                    zIndex: 2,
                    mb: { xs: 2, md: 0 }
                  }}
                >
                  <Chip
                    label={formatDate(event.date)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      height: 32,
                      px: 2,
                      border: 'none'
                    }}
                  />
                </Box>

                {/* Content Card */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: '90%', md: '45%' },
                    mt: { xs: 0, md: 6 },
                    ml: { xs: 0, md: side === 'left' ? 0 : 'auto' },
                    mr: { xs: 0, md: side === 'left' ? 'auto' : 0 }
                  }}
                >
                  <Card
                    component={motion.div}
                    whileHover={{ y: -2 }}
                    sx={{
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: 2,
                      boxShadow: 'none',
                      overflow: 'hidden',
                      position: 'relative',
                      zIndex: 1,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    {hasImage && (
                      <Box
                        onClick={() => setLightboxSrc(event.image!)}
                        sx={{
                          cursor: 'zoom-in',
                          width: '100%',
                          '&:hover img': { opacity: 0.92 },
                        }}
                      >
                        <Image
                          src={event.image!}
                          alt={event.title}
                          width={0}
                          height={0}
                          sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 45vw"
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                          onError={() => handleImageError(event.id)}
                        />
                      </Box>
                    )}

                    <Box sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: theme.palette.primary.dark, fontWeight: 600, mb: 1 }}
                      >
                        {event.title}
                      </Typography>

                      {event.location && (
                        <Link
                          href={generateGoogleMapsUrl(event.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'underline',
                            display: 'block',
                            mb: 1,
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            '&:hover': { color: theme.palette.primary.dark }
                          }}
                        >
                          📍 {event.location}
                        </Link>
                      )}

                      {event.description && (
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem', lineHeight: 1.6, mt: 1.5 }}
                        >
                          {event.description}
                        </Typography>
                      )}

                      {event.tag && (
                        <Chip
                          label={event.tag}
                          size="small"
                          sx={{
                            mt: 2,
                            bgcolor: theme.palette.primary.light + '30',
                            color: theme.palette.primary.main,
                            fontWeight: 500
                          }}
                        />
                      )}

                      {event.from && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            color: theme.palette.text.secondary,
                            fontStyle: 'italic'
                          }}
                        >
                          Shared by {event.from}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Lightbox */}
      <Dialog
        open={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            maxWidth: '95vw',
            maxHeight: '95vh',
            overflow: 'hidden',
          }
        }}
        slotProps={{
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.85)' } }
        }}
      >
        <IconButton
          onClick={() => setLightboxSrc(null)}
          aria-label="Close photo"
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
          }}
        >
          <Close />
        </IconButton>
        {lightboxSrc && (
          <Image
            src={lightboxSrc}
            alt="Full size photo"
            width={0}
            height={0}
            sizes="95vw"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '95vw',
              maxHeight: '95vh',
              display: 'block',
            }}
          />
        )}
      </Dialog>
    </>
  );
}
