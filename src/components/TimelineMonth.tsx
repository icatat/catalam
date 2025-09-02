'use client';

import { motion } from 'framer-motion';
import { Box, Avatar, useTheme } from '@mui/material';
import TimelineCard from './TimelineCard';

interface TimelineEvent {
  id: string;
  date: string | null;
  title: string;
  description: string | null;
  image?: string;
  location?: string | null;
  tag?: string | null;
}

interface TimelineMonthProps {
  monthKey: string;
  events: Array<{ event: TimelineEvent; side: 'left' | 'right' }>;
  monthIndex: number;
  imageErrors: Set<string>;
  onImageError: (eventId: string) => void;
}

export default function TimelineMonth({ 
  monthKey, 
  events, 
  monthIndex, 
  imageErrors, 
  onImageError 
}: TimelineMonthProps) {
  const theme = useTheme();

  const styles = {
    monthContainer: {
      position: 'relative',
      mb: 8
    },
    eventContainer: (side: 'left' | 'right') => ({
      position: 'relative',
      mb: 4,
      display: 'flex',
      alignItems: 'center',
      flexDirection: { xs: 'row', md: side === 'left' ? 'row-reverse' : 'row' }
    }),
    timelineDot: {
      position: 'absolute',
      left: { xs: '-80px', md: '50%' },
      transform: { xs: 'none', md: 'translateX(-50%)' },
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1
    },
    dateDisplay: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      px: 2,
      py: 1,
      borderRadius: 2,
      fontSize: '0.8rem',
      fontWeight: 600,
      textAlign: 'center',
      minWidth: '80px',
      boxShadow: theme.shadows[4]
    },
    avatar: {
      width: 16,
      height: 16,
      bgcolor: theme.palette.primary.main,
      border: `4px solid ${theme.palette.background.paper}`,
      boxShadow: theme.shadows[4]
    }
  };

  return (
    <Box sx={styles.monthContainer}>
      {/* Month Date Display */}
      <Box sx={styles.timelineDot}>
        <Box sx={styles.dateDisplay}>
          {monthKey}
        </Box>
        <Avatar sx={styles.avatar}>
          <Box sx={{ width: 4, height: 4, bgcolor: 'white', borderRadius: '50%' }} />
        </Avatar>
      </Box>

      {/* Events for this month */}
      {events.map((eventItem, eventIndex) => (
        <motion.div
          key={eventItem.event.id}
          initial={{ opacity: 0, x: eventItem.side === 'left' ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: (monthIndex * events.length + eventIndex) * 0.1 }}
        >
          <Box sx={styles.eventContainer(eventItem.side)}>
            <TimelineCard
              event={eventItem.event}
              side={eventItem.side}
              imageError={imageErrors.has(eventItem.event.id)}
              onImageError={() => onImageError(eventItem.event.id)}
            />
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}