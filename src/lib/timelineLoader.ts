import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ItineraryEvent } from '@/types/wedding';

export interface TimelineData {
  date: string;
  title: string;
  subtitle: string;
  events: ItineraryEvent[];
}

export function loadRomaniaTimeline(): TimelineData {
  const filePath = path.join(process.cwd(), 'src/content/RomaniaWeddingTimeline.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents) as TimelineData;

  return data;
}
