import { ItineraryEvent } from '@/types/wedding';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';

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
  const variantColors = {
    primary: { bg: 'bg-rose-500', text: 'text-white' },
    secondary: { bg: 'bg-emerald-500', text: 'text-white' },
    accent: { bg: 'bg-pink-500', text: 'text-white' }
  };

  return (
    <div className={cn(themeClasses.cardBg(variant))}>
      <h3 className={cn(themeClasses.heading('h3', 'primary'), 'mb-2')}>
        {title}
      </h3>
      {subtitle && (
        <h4 className={cn(themeClasses.heading('h5', 'secondary'), 'mb-6')}>
          {subtitle}
        </h4>
      )}
      
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={cn(
              variantColors[variant].bg,
              variantColors[variant].text,
              'rounded-full w-12 h-12 flex items-center justify-center font-semibold text-sm'
            )}>
              {event.time}
            </div>
            <div>
              <h4 className={cn(themeClasses.body('base', 'primary'), 'font-semibold')}>
                {event.title}
              </h4>
              {event.subtitle && (
                <h5 className={cn(themeClasses.body('base', 'secondary'), 'font-medium')}>
                  {event.subtitle}
                </h5>
              )}
              <p className={themeClasses.body('base', 'secondary')}>
                {event.location}
              </p>
              {event.description && (
                <p className={themeClasses.body('small', 'muted')}>
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}