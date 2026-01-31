import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Location } from '@/models/RSVP';

export async function POST(request: Request) {
  try {
    const { invite_id } = await request.json();

    if (!invite_id) {
      return NextResponse.json(
        { error: 'Invite ID is required' },
        { status: 400 }
      );
    }

    // Normalize the input invite_id
    const normalizedInviteId = invite_id.trim().toUpperCase();

    // Query Supabase for the guest with this invite_id
    const { data: guest, error } = await supabase
      .from('rsvp')
      .select('*')
      .eq('invite_id', normalizedInviteId)
      .single();

    if (error || !guest) {
      console.error('Error fetching guest:', error);
      return NextResponse.json(
        { error: 'Invalid invite code. Please check and try again.' },
        { status: 404 }
      );
    }

    // Return guest information
    return NextResponse.json({
      invite_id: normalizedInviteId,
      full_name: guest.full_name || '',
      location: guest.location || [],
      rsvp: guest.rsvp || [],
    });
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return NextResponse.json(
      { error: 'Failed to verify invite code' },
      { status: 500 }
    );
  }
}