'use client';

import { Box, Typography, useTheme, Link } from '@mui/material';
import { MapPin } from 'lucide-react';
import { parseDayOfWeek, stripLeadingPin } from '@/lib/itinerary';
import { getUnifiedColors } from '@/lib/mui-theme';

interface ItineraryDayBannerProps {
  date: string;
  subtitle?: string;
  location?: string;
  locationUrl?: string;
}

export default function ItineraryDayBanner({
  date,
  subtitle,
  location,
  locationUrl,
}: ItineraryDayBannerProps) {
  const theme = useTheme();
  const colors = getUnifiedColors();
  const dayOfWeek = parseDayOfWeek(date);
  const venueText = location ? stripLeadingPin(location) : null;

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        borderRadius: '12px 12px 0 0',
        bgcolor: 'background.paper',
        borderTop: `1px solid ${colors.accent.light}`,
        borderLeft: `1px solid rgba(32, 72, 91, 0.08)`,
        borderRight: `1px solid rgba(32, 72, 91, 0.08)`,
        textAlign: 'center',
        py: { xs: 4, md: 5 },
        px: { xs: 3, md: 6 },
      }}
    >
      <Typography
        aria-hidden="true"
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          color: colors.ornament.main,
          fontStyle: 'italic',
          fontSize: { xs: '1.1rem', md: '1.3rem' },
          letterSpacing: '0.4em',
          mb: { xs: 1.5, md: 2 },
          opacity: 0.9,
        }}
      >
        ·   ·   ·
      </Typography>

      {dayOfWeek && (
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Arizonia", cursive',
            color: colors.ink.deep,
            fontWeight: 400,
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            lineHeight: 1.05,
            mb: { xs: 0.5, md: 0.75 },
          }}
        >
          {dayOfWeek}
        </Typography>
      )}

      <Typography
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          color: colors.ink.mid,
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: { xs: '1.05rem', md: '1.25rem' },
          letterSpacing: '0.02em',
        }}
      >
        {date}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            color: colors.accent.dark,
            fontFamily: '"Thasadith", sans-serif',
            fontSize: { xs: '0.7rem', md: '0.75rem' },
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            mt: { xs: 2, md: 2.5 },
          }}
        >
          {subtitle}
        </Typography>
      )}

      {venueText && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            mt: { xs: 1.5, md: 2 },
            pt: { xs: 1.5, md: 2 },
            borderTop: `1px solid ${colors.ornament.light}`,
            px: 3,
          }}
        >
          <MapPin
            size={14}
            style={{
              color: theme.palette.text.secondary,
              opacity: 0.7,
            }}
          />
          {locationUrl ? (
            <Link
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: colors.ink.deep,
                textDecoration: 'none',
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontStyle: 'italic',
                fontWeight: 500,
                borderBottom: `1px solid ${colors.accent.light}`,
                '&:hover': {
                  color: colors.accent.dark,
                  borderBottomColor: colors.accent.main,
                },
              }}
            >
              {venueText}
            </Link>
          ) : (
            <Typography
              sx={{
                color: colors.ink.deep,
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontStyle: 'italic',
                fontWeight: 500,
              }}
            >
              {venueText}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
