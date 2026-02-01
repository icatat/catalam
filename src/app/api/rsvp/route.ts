import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Location, RsvpData } from '@/models/RSVP';

export async function POST(request: Request) {
  try {
    const { invite_id, location, email, phone, attending, properties, first_name, last_name, group_member_rsvps } = await request.json();

    if (!invite_id || !location || !first_name || !last_name || !email || !phone || attending === undefined) {
      return NextResponse.json(
        { error: 'Invite ID, location, first name, last name, email, phone, and attending status are required.' },
        { status: 400 }
      );
    }

    const normalizedInviteId = invite_id.trim().toUpperCase();

    // Fetch the guest record from guests table to verify invite_id exists and check allowed locations
    const { data: guest, error: fetchError } = await supabase
      .from('guests')
      .select('*')
      .eq('invite_id', normalizedInviteId)
      .single();

    if (fetchError || !guest) {
      console.error('Error checking existing guest:', fetchError);
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    // Verify the location is allowed for this invite based on boolean fields
    const locationAllowed = location === Location.ROMANIA ? guest.romania :
                           location === Location.VIETNAM ? guest.vietnam :
                           false;

    if (!locationAllowed) {
      return NextResponse.json(
        { error: `This invite code does not grant access to the ${location.toLowerCase()} wedding.` },
        { status: 403 }
      );
    }

    // Determine which RSVP table to update
    const rsvpTable = location === Location.ROMANIA ? 'rsvp_romania' : 'rsvp_vietnam';

    // Prepare RSVP data matching RsvpData interface
    const rsvpData: Partial<RsvpData> = {
      invite_id: normalizedInviteId,
      first_name: first_name,
      last_name: last_name,
      confirmed: attending,
      properties: properties,
      phone: phone,
      email: email,
      updated_at: new Date().toISOString(),
    };

    // Check if RSVP already exists for this invite
    const { data: existingRsvp } = await supabase
      .from(rsvpTable)
      .select('*')
      .eq('invite_id', normalizedInviteId)
      .single();

    let result;
    if (existingRsvp) {
      // Update existing RSVP
      const { data: updatedData, error: updateError } = await supabase
        .from(rsvpTable)
        .update(rsvpData)
        .eq('invite_id', normalizedInviteId)
        .select();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update RSVP' },
          { status: 500 }
        );
      }
      result = updatedData[0];
    } else {
      // Insert new RSVP
      const { data: insertedData, error: insertError } = await supabase
        .from(rsvpTable)
        .insert(rsvpData)
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json(
          { error: 'Failed to create RSVP' },
          { status: 500 }
        );
      }
      result = insertedData[0];
    }

    // Process group member RSVPs if provided
    const groupResults = [];
    if (group_member_rsvps && Array.isArray(group_member_rsvps) && group_member_rsvps.length > 0) {
      for (const member of group_member_rsvps) {
        try {
          // Verify the group member's invite_id exists and is allowed for this location
          const normalizedMemberInviteId = member.invite_id.trim().toUpperCase();

          const { data: memberGuest, error: memberFetchError } = await supabase
            .from('guests')
            .select('*')
            .eq('invite_id', normalizedMemberInviteId)
            .single();

          if (memberFetchError || !memberGuest) {
            console.error(`Error fetching group member ${member.invite_id}:`, memberFetchError);
            groupResults.push({
              invite_id: member.invite_id,
              success: false,
              error: 'Invalid invite code'
            });
            continue;
          }

          // Verify the location is allowed for this member
          const memberLocationAllowed = location === Location.ROMANIA ? memberGuest.romania :
                                       location === Location.VIETNAM ? memberGuest.vietnam :
                                       false;

          if (!memberLocationAllowed) {
            groupResults.push({
              invite_id: member.invite_id,
              success: false,
              error: 'Location not allowed for this invite'
            });
            continue;
          }

          // Prepare RSVP data for group member
          const memberRsvpData: Partial<RsvpData> = {
            invite_id: normalizedMemberInviteId,
            first_name: member.first_name,
            last_name: member.last_name,
            confirmed: member.attending,
            properties: {
              rsvp_on_behalf: `${first_name} ${last_name}`, // Track who made the RSVP
            },
            phone: phone, // Use the same contact info as the person making the RSVP
            email: email,
            updated_at: new Date().toISOString(),
          };

          // Check if RSVP already exists for this member
          const { data: existingMemberRsvp } = await supabase
            .from(rsvpTable)
            .select('*')
            .eq('invite_id', normalizedMemberInviteId)
            .single();

          if (existingMemberRsvp) {
            // Update existing RSVP
            const { error: memberUpdateError } = await supabase
              .from(rsvpTable)
              .update(memberRsvpData)
              .eq('invite_id', normalizedMemberInviteId);

            if (memberUpdateError) {
              console.error(`Error updating group member ${member.invite_id} RSVP:`, memberUpdateError);
              groupResults.push({
                invite_id: member.invite_id,
                success: false,
                error: 'Failed to update RSVP'
              });
            } else {
              groupResults.push({
                invite_id: member.invite_id,
                success: true,
                message: 'RSVP updated'
              });
            }
          } else {
            // Insert new RSVP
            const { error: memberInsertError } = await supabase
              .from(rsvpTable)
              .insert(memberRsvpData);

            if (memberInsertError) {
              console.error(`Error inserting group member ${member.invite_id} RSVP:`, memberInsertError);
              groupResults.push({
                invite_id: member.invite_id,
                success: false,
                error: 'Failed to create RSVP'
              });
            } else {
              groupResults.push({
                invite_id: member.invite_id,
                success: true,
                message: 'RSVP created'
              });
            }
          }
        } catch (memberError) {
          console.error(`Error processing group member ${member.invite_id}:`, memberError);
          groupResults.push({
            invite_id: member.invite_id,
            success: false,
            error: 'Processing error'
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully',
      data: result,
      group_results: groupResults.length > 0 ? groupResults : undefined
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}