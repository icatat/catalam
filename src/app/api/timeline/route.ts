import { NextResponse } from 'next/server';
import { supabase, TimelineEvent } from '@/lib/supabase';

export async function GET() {
  try {
    // Query the timeline table from Supabase
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .order('date', { ascending: false }); // Newest first as requested

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json([]);
    }

    // Transform the data to match the frontend interface
    const transformedEvents = data.map((item: TimelineEvent) => ({
      id: item.event_id,
      title: item.event,
      description: item.description,
      image: item.image,
      date: item.date,
      location: item.location,
      tag: item.tag // For people tagging
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline data', details: error },
      { status: 500 }
    );
  }
}