'use client';

import { Box, Card, Typography, useTheme, Link, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { ItineraryEvent } from '@/types/wedding';

interface WeddingTimelineProps {
  events: ItineraryEvent[];
  sectionTitle?: string;
}

export default function WeddingTimeline({ events, sectionTitle }: WeddingTimelineProps) {
  const theme = useTheme();

  const styles = {
    container: {
      position: 'relative',
      maxWidth: 1000,
      mx: 'auto'
    },
    timelineLine: {
      position: 'absolute',
      left: { xs: '32px', md: '50%' },
      top: 0,
      bottom: 0,
      width: '3px',
      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
      transform: { xs: 'none', md: 'translateX(-1.5px)' },
      zIndex: 1
    },
    eventsContainer: {
      pl: { xs: 10, md: 0 },
      pt: 2,
      pb: 2
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      {sectionTitle && (
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary.dark,
            fontWeight: 600,
            mb: 4,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          {sectionTitle}
        </Typography>
      )}

      <Box sx={styles.container}>
        {/* Timeline Line */}
        <Box sx={styles.timelineLine} />

        {/* Timeline Events */}
        <Box sx={styles.eventsContainer}>
          {events.map((event, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';

            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  mb: 6,
                  position: 'relative',
                  flexDirection: { xs: 'row', md: side === 'left' ? 'row' : 'row-reverse' },
                  justifyContent: { xs: 'flex-start', md: 'center' }
                }}
              >
                {/* Time Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: { xs: '-2px', md: '50%' },
                    top: 0,
                    transform: { xs: 'none', md: 'translateX(-50%)' },
                    zIndex: 2
                  }}
                >
                  <Chip
                    label={event.time}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      height: 36,
                      minWidth: 68,
                      boxShadow: theme.shadows[4],
                      border: `3px solid ${theme.palette.background.default}`
                    }}
                  />
                </Box>

                {/* Content Card */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '45%' },
                    mt: 6,
                    ml: { xs: 0, md: side === 'left' ? 0 : 'auto' },
                    mr: { xs: 0, md: side === 'left' ? 'auto' : 0 }
                  }}
                >
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.02, y: -4 }}
                    sx={{
                      boxShadow: theme.shadows[6],
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.shadows[12]
                      }
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          mb: 1,
                          fontSize: '1.25rem'
                        }}
                      >
                        {event.title}
                      </Typography>

                      {event.subtitle && (
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            mb: 1.5,
                            fontStyle: 'italic'
                          }}
                        >
                          {event.subtitle}
                        </Typography>
                      )}

                      {event.locationUrl ? (
                        <Link
                          href={event.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            display: 'block',
                            mb: 1,
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                              color: theme.palette.primary.dark
                            }
                          }}
                        >
                          {event.location}
                        </Link>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 1,
                            fontSize: '0.95rem'
                          }}
                        >
                          {event.location}
                        </Typography>
                      )}

                      {event.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.disabled,
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          {event.description}
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
    </Box>
  );
}
