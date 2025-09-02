import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { invite_id } = await request.json();

    if (!invite_id) {
      return NextResponse.json(
        { error: 'Invite ID is required' },
        { status: 400 }
      );
    }

    // Fetch guest data from Supabase
    const { data: guest, error } = await supabase
      .from('rsvp')
      .select('invite_id, full_name, location, rsvp')
      .eq('invite_id', invite_id)
      .single();

    if (error || !guest) {
      return NextResponse.json(
        { error: 'Invalid invite ID. Please check your invitation and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      invite_id: guest.invite_id,
      full_name: guest.full_name,
      location: guest.location,
      rsvp: guest.rsvp || [],
    });
  } catch (error) {
    console.error('Error fetching guest:', error);
    return NextResponse.json(
      { error: 'Failed to verify invite' },
      { status: 500 }
    );
  }
}