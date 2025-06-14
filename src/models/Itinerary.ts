import { Event } from './Event';
import { ItineraryEvent, ItineraryDayData } from '@/types/wedding';

export class ItineraryDay {
  title: string;
  subtitle?: string;
  events: Event[];
  bgColor: string;
  timeColor: string;

  constructor(
    title: string,
    events: Event[] = [],
    subtitle?: string,
    bgColor: string = 'from-blue-50 to-blue-100',
    timeColor: string = 'bg-blue-500'
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.events = events;
    this.bgColor = bgColor;
    this.timeColor = timeColor;
  }

  // Add an event to the day
  addEvent(event: Event): void {
    this.events.push(event);
  }

  // Remove an event
  removeEvent(index: number): void {
    if (index >= 0 && index < this.events.length) {
      this.events.splice(index, 1);
    }
  }

  // Get events in component format
  getEventsForComponent(): ItineraryEvent[] {
    return this.events.map(event => event.toComponentFormat());
  }

  // Sort events by time
  sortEventsByTime(): void {
    this.events.sort((a, b) => {
      // Simple time comparison (assumes HH:MM format)
      const timeA = a.time.replace(/[^\d:]/g, '');
      const timeB = b.time.replace(/[^\d:]/g, '');
      return timeA.localeCompare(timeB);
    });
  }

  // Validation
  isValid(): boolean {
    return !!(this.title && this.events.every(event => event.isValid()));
  }
}

export class Itinerary {
  days: ItineraryDay[];
  title: string;
  subtitle?: string;

  constructor(title: string, subtitle?: string) {
    this.title = title;
    this.subtitle = subtitle;
    this.days = [];
  }

  // Add a day to the itinerary
  addDay(day: ItineraryDay): void {
    this.days.push(day);
  }

  // Get a specific day
  getDay(index: number): ItineraryDay | undefined {
    return this.days[index];
  }

  // Get all days in component format
  getDaysForComponent(): ItineraryDayData[] {
    return this.days.map(day => ({
      title: day.title,
      subtitle: day.subtitle,
      events: day.getEventsForComponent(),
      bgColor: day.bgColor,
      timeColor: day.timeColor
    }));
  }

  // Get total number of events across all days
  getTotalEvents(): number {
    return this.days.reduce((total, day) => total + day.events.length, 0);
  }

  // Find all events by title
  findEventsByTitle(title: string): Event[] {
    return this.days
      .flatMap(day => day.events)
      .filter(event => event.title.toLowerCase().includes(title.toLowerCase()));
  }

  // Validation
  isValid(): boolean {
    return !!(this.title && this.days.every(day => day.isValid()));
  }
}

// Factory methods for common wedding itineraries
export class WeddingItineraryFactory {
  static createRomanianWedding(): Itinerary {
    const itinerary = new Itinerary(
      'Wedding Itinerary', 
      'Itinerariul nunții'
    );

    // Day 1 - Welcome
    const day1 = new ItineraryDay(
      'Thursday, September 10th, 2026',
      [],
      'Joi, 10 Septembrie, 2026',
      'from-slate-50 to-slate-100',
      'bg-slate-700'
    );

    day1.addEvent(Event.createBilingual(
      '6:00 PM',
      'Welcome Dinner',
      'Cina de întâmpinare',
      'Restaurant Capitolium, Oradea',
      'Meet and greet with family and friends'
    ));

    // Day 2 - Wedding
    const day2 = new ItineraryDay(
      'Friday, September 11th, 2026',
      [],
      'Vineri, 11 Septembrie, 2026',
      'from-blue-50 to-blue-100',
      'bg-blue-500'
    );

    day2.addEvent(Event.createBilingual(
      '3:00 PM',
      'Civil Wedding Ceremony',
      'Cununia Civilă',
      'Oradea City Hall',
      'Primăria Oradea'
    ));

    day2.addEvent(Event.createBilingual(
      '6:00 PM',
      'Wedding Celebration',
      'Celebrarea Nunții',
      'Camelot Resort, Oradea',
      'Traditional Romanian wedding reception'
    ));

    itinerary.addDay(day1);
    itinerary.addDay(day2);

    return itinerary;
  }

  static createVietnameseWedding(): Itinerary {
    const itinerary = new Itinerary('Wedding Itinerary');

    // Day 1 - Main Wedding
    const day1 = new ItineraryDay(
      'Saturday, September 26th, 2026',
      [],
      undefined,
      'from-blue-50 to-blue-100',
      'bg-blue-500'
    );

    day1.addEvent(new Event(
      '8:00',
      'Traditional Tea Ceremony (Lễ ăn hỏi)',
      'Bride\'s Family Home',
      undefined,
      'Traditional Vietnamese engagement ceremony with family'
    ));

    day1.addEvent(new Event(
      '11:00',
      'Wedding Ceremony',
      'Sacred Heart Church, District 3',
      undefined,
      'Catholic wedding ceremony'
    ));

    day1.addEvent(new Event(
      '13:00',
      'Wedding Reception',
      'Park Hyatt Saigon',
      undefined,
      'Traditional Vietnamese wedding banquet with live music and dancing'
    ));

    day1.addEvent(new Event(
      '18:00',
      'Evening Celebration',
      'Rooftop Bar - Chill Skybar',
      undefined,
      'Cocktails and dancing with city views'
    ));

    // Day 2 - Optional Activities
    const day2 = new ItineraryDay(
      'Sunday, September 27th, 2026 (Optional)',
      [],
      undefined,
      'from-slate-50 to-slate-100',
      'bg-slate-500'
    );

    day2.addEvent(new Event(
      '9:00',
      'City Tour',
      'Ho Chi Minh City',
      undefined,
      'Visit Cu Chi Tunnels and local markets'
    ));

    day2.addEvent(new Event(
      '12:30',
      'Traditional Lunch',
      'Local Vietnamese Restaurant',
      undefined,
      'Authentic Vietnamese cuisine experience'
    ));

    day2.addEvent(new Event(
      '15:00',
      'Mekong Delta Trip',
      'Day trip to Mekong Delta',
      undefined,
      'Boat rides and local culture'
    ));

    day2.addEvent(new Event(
      '19:00',
      'Farewell Dinner',
      'Riverside Restaurant',
      undefined,
      'Final celebration by the Saigon River'
    ));

    itinerary.addDay(day1);
    itinerary.addDay(day2);

    return itinerary;
  }
}