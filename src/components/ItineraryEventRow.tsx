'use client';

import { Box, Typography, useTheme, Link } from '@mui/material';
import { MapPin } from 'lucide-react';
import { ItineraryEvent } from '@/types/wedding';
import { extractLeadingEmoji, stripLeadingPin } from '@/lib/itinerary';
import { getUnifiedColors } from '@/lib/mui-theme';

interface ItineraryEventRowProps {
  event: ItineraryEvent;
  isMain: boolean;
  isLast: boolean;
}

export default function ItineraryEventRow({
  event,
  isMain,
  isLast,
}: ItineraryEventRowProps) {
  const theme = useTheme();
  const colors = getUnifiedColors();
  const { rest: cleanedTitle } = extractLeadingEmoji(event.title);
  const titleText = cleanedTitle || event.title;
  const locationText = event.location ? stripLeadingPin(event.location) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 2.5, md: 4 },
        py: { xs: 2.5, md: 3 },
        borderBottom: isLast ? 'none' : `1px solid ${colors.ornament.light}`,
        opacity: isMain ? 1 : 0.9,
      }}
    >
      {/* Time column */}
      <Box
        sx={{
          width: { xs: 80, md: 110 },
          flexShrink: 0,
          pt: 0.25,
          textAlign: 'right',
          borderRight: `1px solid ${colors.ornament.light}`,
          pr: { xs: 2, md: 3 },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            color: colors.ink.deep,
            fontWeight: 500,
            fontStyle: 'italic',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            lineHeight: 1.2,
            letterSpacing: '0.01em',
          }}
        >
          {event.time}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component={isMain ? 'h3' : 'h4'}
          sx={{
            fontFamily: isMain
              ? '"Cormorant Garamond", serif'
              : '"Thasadith", sans-serif',
            color: colors.ink.deep,
            fontWeight: isMain ? 500 : 700,
            fontSize: isMain
              ? { xs: '1.35rem', md: '1.6rem' }
              : { xs: '1.05rem', md: '1.15rem' },
            lineHeight: 1.25,
            letterSpacing: isMain ? '-0.005em' : '0.005em',
            mb: event.subtitle || locationText || event.description ? 0.75 : 0,
          }}
        >
          {titleText}
        </Typography>

        {event.subtitle && (
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontFamily: '"Thasadith", sans-serif',
              fontSize: { xs: '0.95rem', md: '1rem' },
              fontWeight: 400,
              lineHeight: 1.55,
              mb: locationText || event.description ? 0.75 : 0,
            }}
          >
            {event.subtitle}
          </Typography>
        )}

        {locationText && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              mb: event.description ? 0.75 : 0,
            }}
          >
            <MapPin
              size={13}
              style={{
                color: colors.accent.main,
                flexShrink: 0,
              }}
            />
            {event.locationUrl ? (
              <Link
                href={event.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: colors.ink.deep,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${colors.accent.light}`,
                  fontSize: { xs: '0.875rem', md: '0.9rem' },
                  fontWeight: 500,
                  fontFamily: '"Thasadith", sans-serif',
                  pb: '1px',
                  '&:hover': {
                    color: colors.accent.dark,
                    borderBottomColor: colors.accent.main,
                  },
                }}
              >
                {locationText}
              </Link>
            ) : (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.875rem', md: '0.9rem' },
                  fontFamily: '"Thasadith", sans-serif',
                }}
              >
                {locationText}
              </Typography>
            )}
          </Box>
        )}

        {event.description && (
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              fontStyle: 'italic',
              lineHeight: 1.55,
              mt: 0.5,
            }}
          >
            {event.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
