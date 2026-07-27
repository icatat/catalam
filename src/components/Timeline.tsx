'use client';

import { Box, Chip, Typography, Link, useTheme, Dialog, IconButton, Tooltip } from '@mui/material';
import { Close } from '@mui/icons-material';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { getUnifiedColors } from '@/lib/mui-theme';

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
  /** When true, renders per-entry edit/delete controls (admin only). */
  isAdmin?: boolean;
  onEdit?: (event: TimelineEvent) => void;
  onDelete?: (event: TimelineEvent) => void;
}

export default function Timeline({ events, isAdmin = false, onEdit, onDelete }: TimelineProps) {
  const theme = useTheme();
  const colors = getUnifiedColors();
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

  return (
    <>
      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, md: 3 } }}>
        {events.map((event, index) => {
          const hasImage = !!(event.image && !imageErrors.has(event.id));
          const photoOnRight = index % 2 === 0;
          const isLast = index === events.length - 1;

          return (
            <Box
              key={event.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: hasImage
                  ? { xs: '1fr', md: photoOnRight ? '4fr 5fr' : '5fr 4fr' }
                  : '1fr',
                gap: { xs: 3, md: 6 },
                alignItems: 'center',
                pb: { xs: 6, md: 8 },
                pt: index === 0 ? 0 : { xs: 6, md: 8 },
                borderBottom: isLast
                  ? 'none'
                  : `1px solid ${colors.ornament.light}`,
              }}
            >
              {/* Photo */}
              {hasImage && (
                <Box
                  sx={{
                    order: { xs: 0, md: photoOnRight ? 2 : 1 },
                    cursor: 'zoom-in',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 12px 28px -14px rgba(32, 72, 91, 0.22)',
                    '& img': {
                      transition: 'transform 0.6s ease, opacity 0.3s ease',
                    },
                    '&:hover img': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => setLightboxSrc(event.image!)}
                >
                  <Image
                    src={event.image!}
                    alt={event.title}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 55vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                    onError={() => handleImageError(event.id)}
                  />
                </Box>
              )}

              {/* Content */}
              <Box
                sx={{
                  order: { xs: 1, md: hasImage ? (photoOnRight ? 1 : 2) : 1 },
                  px: hasImage ? 0 : { xs: 0, md: 4 },
                  maxWidth: hasImage ? 'none' : 640,
                  mx: hasImage ? 0 : 'auto',
                  textAlign: hasImage ? 'left' : 'center',
                }}
              >
                {/* Admin controls */}
                {isAdmin && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      mb: 1.5,
                      justifyContent: hasImage ? 'flex-start' : 'center',
                    }}
                  >
                    <Tooltip title="Edit this memory">
                      <IconButton
                        size="small"
                        onClick={() => onEdit?.(event)}
                        sx={{ color: colors.accent.dark }}
                        aria-label="Edit memory"
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete this memory">
                      <IconButton
                        size="small"
                        onClick={() => onDelete?.(event)}
                        sx={{ color: theme.palette.error.main }}
                        aria-label="Delete memory"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {/* Date eyebrow */}
                <Typography
                  sx={{
                    fontFamily: '"Thasadith", sans-serif',
                    color: colors.accent.dark,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.32em',
                    mb: 1.5,
                  }}
                >
                  {formatDate(event.date)}
                </Typography>

                {/* Title */}
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    lineHeight: 1.15,
                    letterSpacing: '-0.005em',
                    mb: event.description || event.location ? 2 : 0,
                  }}
                >
                  {event.title}
                </Typography>

                {/* Description */}
                {event.description && (
                  <Typography
                    sx={{
                      fontFamily: '"Thasadith", sans-serif',
                      color: theme.palette.text.primary,
                      fontSize: '1.0625rem',
                      lineHeight: 1.7,
                      mb: event.location || event.tag || event.from ? 2 : 0,
                    }}
                  >
                    {event.description}
                  </Typography>
                )}

                {/* Location */}
                {event.location && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      mb: event.tag || event.from ? 2 : 0,
                    }}
                  >
                    <MapPin
                      size={14}
                      style={{ color: colors.accent.main, flexShrink: 0 }}
                    />
                    <Link
                      href={generateGoogleMapsUrl(event.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontStyle: 'italic',
                        fontSize: '1.05rem',
                        color: theme.palette.primary.dark,
                        textDecoration: 'none',
                        borderBottom: `1px solid ${colors.accent.light}`,
                        pb: '1px',
                        '&:hover': {
                          color: colors.accent.dark,
                          borderBottomColor: colors.accent.main,
                        },
                      }}
                    >
                      {event.location}
                    </Link>
                  </Box>
                )}

                {/* Tag */}
                {event.tag && (
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={event.tag}
                      size="small"
                      sx={{
                        bgcolor: colors.ornament.light,
                        color: colors.ornament.dark,
                        fontFamily: '"Thasadith", sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        height: 26,
                        border: 'none',
                      }}
                    />
                  </Box>
                )}

                {/* From */}
                {event.from && (
                  <Typography
                    sx={{
                      display: 'block',
                      mt: 2.5,
                      pt: 1.5,
                      borderTop: `1px solid ${colors.ornament.light}`,
                      color: theme.palette.text.secondary,
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontSize: '0.95rem',
                    }}
                  >
                    Shared by {event.from}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
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
