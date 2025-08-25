import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { invite_id, location, email, phone, attending, properties } = await request.json();

    if (!invite_id || !location || attending === undefined) {
      return NextResponse.json(
        { error: 'Invite ID, location, and attending status are required' },
        { status: 400 }
      );
    }
    // First, verify that the guest exists and is invited to this location
    const { data: existingGuest, error: fetchError } = await supabase
      .from('rsvp')
      .select('invite_id, location, properties, rsvp')
      .eq('invite_id', invite_id)
      .single();

    if (fetchError || !existingGuest) {
      return NextResponse.json(
        { error: 'Invalid invite ID' },
        { status: 404 }
      );
    }

    if (!existingGuest.location.includes(location)) {
      return NextResponse.json(
        { error: `We were not able to find a record for the ${location.toLowerCase()} wedding. Please contact Cata & Lam directly.` },
        { status: 403 }
      );
    }

    // Calculate the updated RSVP array based on attending status
    const currentRsvpArray = existingGuest.rsvp || [];
    let updatedRsvpArray;

    if (attending) {
      // User is attending - add location to RSVP array if not already present
      updatedRsvpArray = currentRsvpArray.includes(location) 
        ? currentRsvpArray 
        : [...currentRsvpArray, location];
    } else {
      // User is not attending - remove location from RSVP array
      updatedRsvpArray = currentRsvpArray.filter((loc: string) => loc !== location);
    }

    // Merge existing properties with new ones, organizing by location
    const updatedProperties = {
      ...existingGuest.properties,
      [location]: {
        ...existingGuest.properties?.[location],
        ...properties,
        rsvp_submitted: true,
        rsvp_timestamp: new Date().toISOString(),
        attending: attending,
      }
    };

    // Update the guest record
    const { data, error } = await supabase
      .from('rsvp')
      .update({
        email,
        phone,
        rsvp: updatedRsvpArray,
        properties: updatedProperties,
        rsvp_timestamp: new Date().toISOString(),
      })
      .eq('invite_id', invite_id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit RSVP' },
        { status: 500 }
      );
    }
    return NextResponse.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}