import { NextResponse } from 'next/server';
import { loadVietnamTimeline } from '@/lib/timelineLoader';

export async function GET() {
  try {
    const timeline = loadVietnamTimeline();
    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Error loading Vietnam timeline:', error);
    return NextResponse.json(
      { error: 'Failed to load timeline data' },
      { status: 500 }
    );
  }
}
