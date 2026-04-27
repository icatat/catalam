import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Location, RsvpData } from '@/models/RSVP';

async function generateInviteId(firstName: string, lastName: string): Promise<string> {
  const clean = (s: string) => s.toUpperCase().replace(/\s/g, '');
  let lettersUsed = 1;
  while (lettersUsed <= lastName.length) {
    const candidate = clean(`${firstName}${lastName.substring(0, lettersUsed)}`);
    const { data } = await supabase
      .from('guests')
      .select('invite_id')
      .eq('invite_id', candidate)
      .single();
    if (!data) return candidate;
    lettersUsed++;
  }
  let suffix = 2;
  while (true) {
    const candidate = clean(`${firstName}${lastName}${suffix}`);
    const { data } = await supabase
      .from('guests')
      .select('invite_id')
      .eq('invite_id', candidate)
      .single();
    if (!data) return candidate;
    suffix++;
  }
}

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

    const locationAllowed = location === Location.ROMANIA ? guest.romania :
                           location === Location.VIETNAM ? guest.vietnam :
                           false;

    if (!locationAllowed) {
      return NextResponse.json(
        { error: `This invite code does not grant access to the ${location.toLowerCase()} wedding.` },
        { status: 403 }
      );
    }

    const rsvpTable = location === Location.ROMANIA ? 'rsvp_romania' : 'rsvp_vietnam';

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

    const { data: existingRsvp } = await supabase
      .from(rsvpTable)
      .select('*')
      .eq('invite_id', normalizedInviteId)
      .single();

    let result;
    if (existingRsvp) {
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

    // Resolve group — create one if the submitter doesn't have one yet
    let resolvedGroup = guest.group;
    if (!resolvedGroup) {
      resolvedGroup = `${guest.first_name}${guest.last_name}Group`;
      await supabase
        .from('guests')
        .update({ group: resolvedGroup })
        .eq('invite_id', normalizedInviteId);
    }

    // Process group member RSVPs
    const groupResults: Array<{
      invite_id?: string;
      first_name?: string;
      last_name?: string;
      success: boolean;
      is_new_guest?: boolean;
      message?: string;
      error?: string;
    }> = [];

    if (group_member_rsvps && Array.isArray(group_member_rsvps) && group_member_rsvps.length > 0) {
      for (const member of group_member_rsvps) {
        try {
          // New guest — create a guest record and RSVP
          if (member.is_new_guest === true) {
            const newInviteId = await generateInviteId(member.first_name, member.last_name);

            const { error: guestInsertError } = await supabase.from('guests').insert({
              invite_id: newInviteId,
              first_name: member.first_name,
              last_name: member.last_name,
              group: resolvedGroup,
              romania: guest.romania,
              vietnam: guest.vietnam,
            });

            if (guestInsertError) {
              console.error('Error inserting new guest:', guestInsertError);
              groupResults.push({
                first_name: member.first_name,
                last_name: member.last_name,
                success: false,
                error: 'Failed to create guest record',
              });
              continue;
            }

            const { error: newRsvpError } = await supabase.from(rsvpTable).insert({
              invite_id: newInviteId,
              first_name: member.first_name,
              last_name: member.last_name,
              confirmed: true,
              properties: {
                rsvp_on_behalf: `${first_name} ${last_name}`,
                tentative_arrival_date: member.arrival_date || undefined,
              },
              email: member.email || email,
              phone: member.phone || phone,
              updated_at: new Date().toISOString(),
            });

            if (newRsvpError) {
              console.error('Error inserting new guest RSVP:', newRsvpError);
              groupResults.push({
                invite_id: newInviteId,
                first_name: member.first_name,
                last_name: member.last_name,
                success: false,
                error: 'Failed to create RSVP for new guest',
              });
            } else {
              groupResults.push({
                invite_id: newInviteId,
                first_name: member.first_name,
                last_name: member.last_name,
                success: true,
                is_new_guest: true,
                message: 'New guest created and RSVP recorded',
              });
            }
            continue;
          }

          // Existing group member
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
              error: 'Invalid invite code',
            });
            continue;
          }

          const memberLocationAllowed = location === Location.ROMANIA ? memberGuest.romania :
                                       location === Location.VIETNAM ? memberGuest.vietnam :
                                       false;

          if (!memberLocationAllowed) {
            groupResults.push({
              invite_id: member.invite_id,
              success: false,
              error: 'Location not allowed for this invite',
            });
            continue;
          }

          const memberRsvpData: Partial<RsvpData> = {
            invite_id: normalizedMemberInviteId,
            first_name: member.first_name,
            last_name: member.last_name,
            confirmed: member.attending,
            properties: {
              rsvp_on_behalf: `${first_name} ${last_name}`,
              tentative_arrival_date: member.arrival_date || undefined,
            },
            phone: member.phone || phone,
            email: member.email || email,
            updated_at: new Date().toISOString(),
          };

          const { data: existingMemberRsvp } = await supabase
            .from(rsvpTable)
            .select('*')
            .eq('invite_id', normalizedMemberInviteId)
            .single();

          if (existingMemberRsvp) {
            const { error: memberUpdateError } = await supabase
              .from(rsvpTable)
              .update(memberRsvpData)
              .eq('invite_id', normalizedMemberInviteId);

            if (memberUpdateError) {
              console.error(`Error updating group member ${member.invite_id} RSVP:`, memberUpdateError);
              groupResults.push({
                invite_id: member.invite_id,
                success: false,
                error: 'Failed to update RSVP',
              });
            } else {
              groupResults.push({
                invite_id: member.invite_id,
                success: true,
                message: 'RSVP updated',
              });
            }
          } else {
            const { error: memberInsertError } = await supabase
              .from(rsvpTable)
              .insert(memberRsvpData);

            if (memberInsertError) {
              console.error(`Error inserting group member ${member.invite_id} RSVP:`, memberInsertError);
              groupResults.push({
                invite_id: member.invite_id,
                success: false,
                error: 'Failed to create RSVP',
              });
            } else {
              groupResults.push({
                invite_id: member.invite_id,
                success: true,
                message: 'RSVP created',
              });
            }
          }
        } catch (memberError) {
          console.error(`Error processing group member:`, memberError);
          groupResults.push({
            invite_id: member.invite_id,
            success: false,
            error: 'Processing error',
          });
        }
      }
    }

    const newGuestsCreated = groupResults
      .filter(r => r.success && r.is_new_guest)
      .map(r => ({ invite_id: r.invite_id!, first_name: r.first_name!, last_name: r.last_name! }));

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully',
      data: result,
      group_results: groupResults.length > 0 ? groupResults : undefined,
      new_guests_created: newGuestsCreated.length > 0 ? newGuestsCreated : undefined,
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
