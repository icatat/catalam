import { ItineraryEvent } from '@/types/wedding';

export class Event implements ItineraryEvent {
  time: string;
  title: string;
  subtitle?: string;
  location: string;
  description?: string;

  constructor(
    time: string,
    title: string,
    location: string,
    subtitle?: string,
    description?: string
  ) {
    this.time = time;
    this.title = title;
    this.location = location;
    this.subtitle = subtitle;
    this.description = description;
  }

  // Convert to the format expected by ItineraryDay component
  toComponentFormat(): ItineraryEvent {
    return {
      time: this.time,
      title: this.title,
      subtitle: this.subtitle,
      location: this.location,
      description: this.description
    };
  }

  // Create events with bilingual support
  static createBilingual(
    time: string,
    titleEn: string,
    titleLocal: string,
    location: string,
    description?: string
  ): Event {
    return new Event(time, titleEn, location, titleLocal, description);
  }

  // Validation
  isValid(): boolean {
    return !!(this.time && this.title && this.location);
  }

  // Formatting helpers
  getDisplayTitle(): string {
    return this.subtitle ? `${this.title} / ${this.subtitle}` : this.title;
  }

  getDisplayLocation(): string {
    return this.location;
  }
}