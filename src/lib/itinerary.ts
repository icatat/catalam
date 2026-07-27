import { ItineraryEvent } from '@/types/wedding';

export function extractLeadingEmoji(text: string): { emoji: string | null; rest: string } {
  if (!text) return { emoji: null, rest: '' };
  const match = text.match(/^(\p{Extended_Pictographic}(?:‍\p{Extended_Pictographic})*️?)\s*(.*)$/u);
  if (match) {
    return { emoji: match[1], rest: match[2] };
  }
  return { emoji: null, rest: text };
}

export function stripLeadingPin(location: string): string {
  if (!location) return '';
  return location.replace(/^📍\s*/, '');
}

export function parseDayOfWeek(date: string): string | null {
  if (!date) return null;
  const cleaned = date.replace(/(\d+)(st|nd|rd|th)/gi, '$1');
  const parsed = new Date(cleaned);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(undefined, { weekday: 'long' });
}

export function isMainEvent(event: ItineraryEvent): boolean {
  return !event.type || event.type === 'Event';
}

export function hasAnyMainEvents(events: ItineraryEvent[]): boolean {
  return events.some(isMainEvent);
}

function normalizeForCompare(text: string): string {
  return text
    .toLowerCase()
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function isSubtitleRedundant(subtitle: string | undefined, events: ItineraryEvent[]): boolean {
  if (!subtitle || !events?.length) return false;
  const normSub = normalizeForCompare(subtitle);
  if (!normSub) return false;
  return events.some(event => {
    const normTitle = normalizeForCompare(event.title || '');
    if (!normTitle) return false;
    return normTitle.includes(normSub) || normSub.includes(normTitle);
  });
}
