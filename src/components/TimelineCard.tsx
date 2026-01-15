'use client';

import { motion } from 'framer-motion';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { Person } from '@mui/icons-material';
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

interface TimelineCardProps {
  event: TimelineEvent;
  side: 'left' | 'right';
  imageError: boolean;
  onImageError: () => void;
}

export default function TimelineCard({ event, side, imageError, onImageError }: TimelineCardProps) {
  const theme = useTheme();

  const generateGoogleMapsUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  const styles = {
    contentCard: {
      width: { xs: '100%', md: '45%' },
      ml: { xs: 0, md: side === 'left' ? 4 : 0 },
      mr: { xs: 0, md: side === 'left' ? 0 : 4 }
    },
    card: {
      boxShadow: theme.shadows[6],
      borderRadius: 3,
      overflow: 'hidden',
      position: 'relative',
      '&:hover': {
        boxShadow: theme.shadows[12]
      }
    },
    descriptionOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
      '&:hover': {
        opacity: 1
      }
    },
    textOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      p: 2
    },
    fallbackContent: {
      p: 3,
      bgcolor: theme.palette.background.paper,
      minHeight: 120,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  };

  return (
    <Box sx={styles.contentCard}>
      <Card
        component={motion.div}
        whileHover={{ scale: 1.02, y: -4 }}
        sx={styles.card}
      >
        {/* Image with overlays - this IS the card content */}
        {event.image && !imageError ? (
          <>
            <Image
              src={event.image}
              alt={event.title}
              width={0}
              height={0}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={onImageError}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            
            {/* Description Overlay (shows on hover) */}
            {event.description && (
              <Box sx={styles.descriptionOverlay}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 500,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    lineHeight: 1.4
                  }}
                >
                  {event.description}
                </Typography>
              </Box>
            )}

            {/* Title and Location Overlay (always visible) */}
            <Box sx={styles.textOverlay}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: 0.5,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {event.title}
              </Typography>
              
              {event.location && (
                <Typography
                  component="a"
                  href={generateGoogleMapsUrl(event.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{
                    color: 'white',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                    display: 'block',
                    textAlign: 'center',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  📍 {event.location}
                </Typography>
              )}

              {event.tag && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <Person sx={{ color: 'white', fontSize: '1rem' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1
                    }}
                  >
                    From {event.tag}
                  </Typography>
                </Box>
              )}

              {event.from && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    display: 'block',
                    textAlign: 'center',
                    mt: 1,
                    fontStyle: 'italic',
                    opacity: 0.9,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  Shared by {event.from}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          /* Fallback for events without images */
          <Box sx={styles.fallbackContent}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 1,
                textAlign: 'center'
              }}
            >
              {event.title}
            </Typography>
            
            {event.description && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.4,
                  textAlign: 'center',
                  mb: 1
                }}
              >
                {event.description}
              </Typography>
            )}

            {event.location && (
              <Typography
                component="a"
                href={generateGoogleMapsUrl(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  display: 'block',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                📍 {event.location}
              </Typography>
            )}

            {event.tag && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <Person sx={{ color: theme.palette.info.main, fontSize: '1rem' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.info.main,
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    backgroundColor: theme.palette.info.light + '20',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1
                  }}
                >
                  {event.tag}
                </Typography>
              </Box>
            )}

            {event.from && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  fontStyle: 'italic',
                  opacity: 0.8
                }}
              >
                Shared by {event.from}
              </Typography>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
}