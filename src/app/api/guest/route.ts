import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GroupMemberData } from '@/models/RSVP';

export async function POST(request: Request) {
  try {
    const { invite_id } = await request.json();
    console.log(invite_id)
    if (!invite_id) {
      return NextResponse.json(
        { error: 'Invite ID is required' },
        { status: 400 }
      );
    }

    // Normalize the input invite_id
    const normalizedInviteId = invite_id.trim().toUpperCase();
    console.log("NOMRALIZE:", normalizedInviteId);
    // Query Supabase guests table for the guest with this invite_id
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('invite_id', normalizedInviteId)
      .single();

    console.log("GUEST DATA:", guest);
    if (!guest) {
      console.error('Could not find guest:', error);
      return NextResponse.json(
        { error: 'Invalid invite code. Please check and try again or contact Cata and Lam.' },
        { status: 404 }
      );
    }

    if (error) {
      console.error('Error fetching guest:', error);
      return NextResponse.json(
        { error: 'Failed to verify invite code...that might be on us, so please contact us!' },
        { status: 500 }
      );
    }

    // Check RSVP status in both tables
    const { data: romaniaRsvp } = await supabase
      .from('rsvp_romania')
      .select('confirmed')
      .eq('invite_id', normalizedInviteId)
      .single();

    const { data: vietnamRsvp } = await supabase
      .from('rsvp_vietnam')
      .select('confirmed')
      .eq('invite_id', normalizedInviteId)
      .single();

    // Fetch group members if guest has a group
    let groupMembers: GroupMemberData[] = [];
    if (guest.group) {
      const { data: groupGuests, error: groupError } = await supabase
        .from('guests')
        .select('*')
        .eq('group', guest.group);

      if (!groupError && groupGuests) {
        // Fetch RSVP status for each group member
        groupMembers = await Promise.all(
          groupGuests.map(async (member) => {
            const { data: memberRomaniaRsvp } = await supabase
              .from('rsvp_romania')
              .select('confirmed')
              .eq('invite_id', member.invite_id)
              .single();

            const { data: memberVietnamRsvp } = await supabase
              .from('rsvp_vietnam')
              .select('confirmed')
              .eq('invite_id', member.invite_id)
              .single();

            return {
              invite_id: member.invite_id,
              first_name: member.first_name || '',
              last_name: member.last_name || '',
              vietnam: member.vietnam || false,
              romania: member.romania || false,
              group: member.group,
              has_rsvp_romania: !!memberRomaniaRsvp,
              has_rsvp_vietnam: !!memberVietnamRsvp,
            };
          })
        );
      }
    }

    // Return guest information matching GuestData interface plus RSVP status
    return NextResponse.json({
      invite_id: normalizedInviteId,
      first_name: guest.first_name || '',
      last_name: guest.last_name || '',
      vietnam: guest.vietnam || false,
      romania: guest.romania || false,
      group: guest.group,
      has_rsvp_romania: !!romaniaRsvp,
      has_rsvp_vietnam: !!vietnamRsvp,
      group_members: groupMembers,
    });
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return NextResponse.json(
      { error: 'Failed to verify invite code' },
      { status: 500 }
    );
  }
}