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
      width: '2px',
      background: theme.palette.primary.main,
      transform: { xs: 'none', md: 'translateX(-1px)' },
      zIndex: 1,
      opacity: 0.3
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
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      height: 32,
                      minWidth: 65,
                      border: 'none'
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
                    sx={{
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: 2,
                      boxShadow: 'none',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: '"Arizonia", cursive',
                          color: theme.palette.primary.dark,
                          fontWeight: 400,
                          mb: 1,
                          fontSize: '2rem',
                          lineHeight: 1.2
                        }}
                      >
                        {event.title}
                      </Typography>

                      {event.subtitle && (
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                            mb: 1.5,
                            fontSize: '1.125rem'
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
                            textDecoration: 'underline',
                            display: 'block',
                            mb: 1,
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            '&:hover': {
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
                            fontSize: '1.05rem',
                            fontWeight: 500
                          }}
                        >
                          {event.location}
                        </Typography>
                      )}

                      {event.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '1.05rem',
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
