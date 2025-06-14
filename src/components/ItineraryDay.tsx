import { ItineraryEvent } from '@/types/wedding';

interface ItineraryDayProps {
  title: string;
  subtitle?: string;
  events: ItineraryEvent[];
  bgColor?: string;
  timeColor?: string;
}

export default function ItineraryDay({
  title,
  subtitle,
  events,
  bgColor = 'from-blue-50 to-blue-100',
  timeColor = 'bg-blue-500'
}: ItineraryDayProps) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} p-8 rounded-lg shadow-sm`}>
      <h3 className="text-2xl font-semibold text-slate-800 mb-2">{title}</h3>
      {subtitle && (
        <h4 className="text-lg font-medium text-slate-600 mb-6">{subtitle}</h4>
      )}
      
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={`${timeColor} text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-sm`}>
              {event.time}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{event.title}</h4>
              {event.subtitle && (
                <h5 className="font-medium text-slate-600">{event.subtitle}</h5>
              )}
              <p className="text-slate-600">{event.location}</p>
              {event.description && (
                <p className="text-sm text-slate-500">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}