import { NextResponse } from 'next/server';
import { loadRomaniaTimeline } from '@/lib/timelineLoader';

export async function GET() {
  try {
    const timeline = loadRomaniaTimeline();
    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Error loading Romania timeline:', error);
    return NextResponse.json(
      { error: 'Failed to load timeline data' },
      { status: 500 }
    );
  }
}
