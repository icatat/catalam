import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GroupMemberData } from '@/models/RSVP';

export async function POST(request: Request) {
  try {
    const { invite_id, first_name, last_name } = await request.json();

    if (!invite_id && !(first_name && last_name)) {
      return NextResponse.json(
        { error: 'Provide either an invite code or a first name and last name.' },
        { status: 400 }
      );
    }

    let guest: {
      invite_id: string;
      first_name: string | null;
      last_name: string | null;
      vietnam: boolean | null;
      romania: boolean | null;
      group: string | null;
    } | null = null;
    let lookupError: unknown = null;

    if (invite_id) {
      const normalizedInviteId = invite_id.trim().toUpperCase();
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('invite_id', normalizedInviteId)
        .single();
      guest = data;
      lookupError = error;
    } else {
      const normalizedFirst = first_name.trim();
      const normalizedLast = last_name.trim();
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .ilike('first_name', normalizedFirst)
        .ilike('last_name', normalizedLast);

      if (error) {
        lookupError = error;
      } else if (!data || data.length === 0) {
        guest = null;
      } else if (data.length > 1) {
        return NextResponse.json(
          {
            error:
              'Multiple guests share that name. Please use your invite code instead, or contact Cata and Lam.',
          },
          { status: 409 }
        );
      } else {
        guest = data[0];
      }
    }

    if (!guest) {
      console.error('Could not find guest:', lookupError);
      return NextResponse.json(
        { error: 'We could not find a matching invite. Please check and try again or contact Cata and Lam.' },
        { status: 404 }
      );
    }

    const normalizedInviteId = guest.invite_id;

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
