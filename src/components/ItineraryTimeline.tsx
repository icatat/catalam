'use client';

import { Box } from '@mui/material';
import { ItineraryEvent } from '@/types/wedding';
import { hasAnyMainEvents, isMainEvent } from '@/lib/itinerary';
import ItineraryEventRow from './ItineraryEventRow';
import { getUnifiedColors } from '@/lib/mui-theme';

interface ItineraryTimelineProps {
  events: ItineraryEvent[];
}

export default function ItineraryTimeline({ events }: ItineraryTimelineProps) {
  if (!events || events.length === 0) return null;
  const colors = getUnifiedColors();
  const mixedMode = hasAnyMainEvents(events);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '0 0 12px 12px',
        borderLeft: `1px solid rgba(32, 72, 91, 0.08)`,
        borderRight: `1px solid rgba(32, 72, 91, 0.08)`,
        borderBottom: `1px solid ${colors.accent.light}`,
        px: { xs: 3, md: 5 },
        py: { xs: 1, md: 1.5 },
        boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 12px 28px -16px rgba(32, 72, 91, 0.18)',
      }}
    >
      {events.map((event, index) => (
        <ItineraryEventRow
          key={index}
          event={event}
          isMain={mixedMode ? isMainEvent(event) : true}
          isLast={index === events.length - 1}
        />
      ))}
    </Box>
  );
}
