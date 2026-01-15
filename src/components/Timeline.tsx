'use client';

import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import TimelineMonth from './TimelineMonth';

interface TimelineEvent {
  id: string;
  date: string | null;
  title: string;
  description: string | null;
  image?: string;
  location?: string | null;
  tag?: string | null;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const theme = useTheme();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleImageError = (eventId: string) => {
    setImageErrors(prev => new Set([...prev, eventId]));
  };

  // Group events by month/year and organize for left/right placement
  const organizeEventsByMonth = (events: TimelineEvent[]) => {
    const grouped: Record<string, TimelineEvent[]> = {};
    events.forEach(event => {
      const monthKey = formatDate(event.date);
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    return grouped;
  };

  const eventsByMonth = organizeEventsByMonth(events);
  
  // Create timeline items with left/right placement for same month events
  const createTimelineItems = () => {
    const timelineItems: Array<{
      monthKey: string;
      events: Array<{ event: TimelineEvent; side: 'left' | 'right' }>;
    }> = [];

    let monthIndex = 0;
    Object.entries(eventsByMonth).forEach(([monthKey, monthEvents]) => {
      let eventsWithSides;
      
      if (monthEvents.length === 1) {
        // Single event per month: alternate based on month index
        eventsWithSides = [{
          event: monthEvents[0],
          side: (monthIndex % 2 === 0 ? 'left' : 'right') as 'left' | 'right'
        }];
      } else {
        // Multiple events per month: fill both sides alternating within the month
        eventsWithSides = monthEvents.map((event, index) => ({
          event,
          side: (index % 2 === 0 ? 'left' : 'right') as 'left' | 'right'
        }));
      }
      
      timelineItems.push({
        monthKey,
        events: eventsWithSides
      });
      
      monthIndex++;
    });

    return timelineItems;
  };

  const timelineItems = createTimelineItems();

  const styles = {
    container: {
      position: 'relative',
      maxWidth: 900,
      mx: 'auto'
    },
    timelineLine: {
      position: 'absolute',
      left: { xs: '20px', md: '50%' },
      top: 0,
      bottom: 0,
      width: '2px',
      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
      transform: { xs: 'none', md: 'translateX(-1px)' },
      zIndex: 1
    },
    eventsContainer: {
      pl: { xs: 12, md: 0 }
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Timeline Line */}
      <Box sx={styles.timelineLine} />

      {/* Timeline Events */}
      <Box sx={styles.eventsContainer}>
        {timelineItems.map((monthItem, monthIndex) => (
          <TimelineMonth
            key={monthItem.monthKey}
            monthKey={monthItem.monthKey}
            events={monthItem.events}
            monthIndex={monthIndex}
            imageErrors={imageErrors}
            onImageError={handleImageError}
          />

))}
      </Box>
    </Box>
  );
}