import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { invite_id, location, email, phone, attending, properties, name } = await request.json();

    if (!invite_id || !location || !name || !email || !phone || attending === undefined) {
      return NextResponse.json(
        { error: 'Invite ID, location, name, email, phone, and attending status are required.' },
        { status: 400 }
      );
    }

    const normalizedInviteId = invite_id.trim().toUpperCase();

    // Fetch the guest record to verify invite_id exists and get allowed locations
    const { data: existingGuest, error: fetchError } = await supabase
      .from('rsvp')
      .select('*')
      .eq('invite_id', normalizedInviteId)
      .single();

    if (fetchError || !existingGuest) {
      console.error('Error checking existing guest:', fetchError);
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    const allowedLocations = existingGuest.location || [];

    // Verify the location is allowed for this invite
    if (!allowedLocations.includes(location)) {
      return NextResponse.json(
        { error: `This invite code does not grant access to the ${location.toLowerCase()} wedding.` },
        { status: 403 }
      );
    }

    // Update the existing guest record with RSVP information
    const currentRsvp = existingGuest.rsvp || [];
    const rsvpArray = attending
      ? [...new Set([...currentRsvp, location])] // Add location if attending (avoid duplicates)
      : currentRsvp.filter((loc: string) => loc !== location); // Remove location if not attending

    const propertiesObject = {
      ...existingGuest.properties,
      [location]: {
        ...existingGuest.properties?.[location],
        ...properties,
        rsvp_submitted: true,
        rsvp_timestamp: new Date().toISOString(),
        attending: attending,
      }
    };

    const { data: updatedData, error: updateError } = await supabase
      .from('rsvp')
      .update({
        full_name: name || existingGuest.full_name,
        email: email || existingGuest.email,
        phone: phone || existingGuest.phone,
        rsvp: rsvpArray,
        properties: propertiesObject,
        rsvp_timestamp: new Date().toISOString(),
      })
      .eq('invite_id', normalizedInviteId)
      .select();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update RSVP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully',
      data: updatedData[0]
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}