import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ItineraryEvent, ItineraryDayData } from '@/types/wedding';

export interface TimelineData {
  days: ItineraryDayData[];
}

export function loadRomaniaTimeline(): TimelineData {
  const filePath = path.join(process.cwd(), 'src/content/RomaniaWeddingTimeline.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents) as TimelineData;
  return data;
}

export function flattenTimelineEvents(timeline: TimelineData): ItineraryEvent[] {
  return (timeline.days || []).flatMap(day => day.events || []);
}
