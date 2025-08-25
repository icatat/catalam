import { ItineraryEvent } from '@/types/wedding';
import { Card, CardContent, Typography, Box, Avatar, useTheme } from '@mui/material';
import { getUnifiedColors } from '@/lib/mui-theme';

interface ItineraryDayProps {
  title: string;
  subtitle?: string;
  events: ItineraryEvent[];
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function ItineraryDay({
  title,
  subtitle,
  events,
  variant = 'primary'
}: ItineraryDayProps) {
  const theme = useTheme();
  const colors = getUnifiedColors();
  // Use unified emerald colors with slight variations for visual interest
  const variantColors = {
    primary: variant === 'primary' ? colors.primary.main : colors.primary.light,
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          component="h3" 
          gutterBottom 
          sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="h6" 
            component="h4" 
            sx={{ color: theme.palette.text.secondary, mb: 3 }}
          >
            {subtitle}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {events.map((event, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: variantColors.primary,
                  width: 48,
                  height: 48,
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {event.time}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body1" 
                  component="h4" 
                  sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5 }}
                >
                  {event.title}
                </Typography>
                {event.subtitle && (
                  <Typography 
                    variant="body2" 
                    component="h5" 
                    sx={{ color: theme.palette.text.secondary, fontWeight: 500, mb: 0.5 }}
                  >
                    {event.subtitle}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  {event.location}
                </Typography>
                {event.description && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                    {event.description}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}