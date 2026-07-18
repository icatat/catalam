import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { RSVPProperties } from '@/models/RSVP';

const ADMINS = [
  { first_name: 'Catalina', last_name: 'Ionescu' },
  { first_name: 'Lam', last_name: 'Nguyen' },
];

async function verifyAdmin(inviteId: string): Promise<boolean> {
  const { data } = await supabase
    .from('guests')
    .select('first_name, last_name')
    .eq('invite_id', inviteId.trim().toUpperCase())
    .single();
  if (!data) return false;
  return ADMINS.some(
    (a) =>
      a.first_name.toLowerCase() === data.first_name?.toLowerCase() &&
      a.last_name.toLowerCase() === data.last_name?.toLowerCase()
  );
}

// POST /api/admin/bulk-set-events — set invited_events for many guests at a location.
// invited_events === null clears the restriction (invited to all events).
export async function POST(request: Request) {
  try {
    const {
      admin_invite_id,
      target_invite_ids,
      location,
      invited_events,
    }: {
      admin_invite_id?: string;
      target_invite_ids?: string[];
      location?: 'vietnam' | 'romania';
      invited_events?: string[] | null;
    } = await request.json();

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!Array.isArray(target_invite_ids) || target_invite_ids.length === 0) {
      return NextResponse.json({ error: 'target_invite_ids must be a non-empty array.' }, { status: 400 });
    }

    if (location !== 'vietnam' && location !== 'romania') {
      return NextResponse.json({ error: 'Invalid location.' }, { status: 400 });
    }

    if (invited_events !== null && !Array.isArray(invited_events)) {
      return NextResponse.json(
        { error: 'invited_events must be an array of event titles or null.' },
        { status: 400 }
      );
    }

    const ids = Array.from(
      new Set(target_invite_ids.map((id) => id.trim().toUpperCase()).filter(Boolean))
    );
    if (ids.length === 0) {
      return NextResponse.json({ error: 'No valid target_invite_ids provided.' }, { status: 400 });
    }

    const rsvpTable = location === 'romania' ? 'rsvp_romania' : 'rsvp_vietnam';
    const locationCol = location === 'romania' ? 'romania' : 'vietnam';

    const { data: guests, error: fetchGuestsErr } = await supabase
      .from('guests')
      .select('invite_id, first_name, last_name, vietnam, romania')
      .in('invite_id', ids);

    if (fetchGuestsErr || !guests) {
      console.error('Bulk set-events fetch guests error:', fetchGuestsErr);
      return NextResponse.json({ error: 'Failed to load guests.' }, { status: 500 });
    }

    const invited = guests.filter((g) => g[locationCol] === true);
    const skipped_not_invited = guests.length - invited.length;

    if (invited.length === 0) {
      return NextResponse.json({ success: true, updated: 0, skipped_not_invited });
    }

    const invitedIds = invited.map((g) => g.invite_id);
    const { data: existingRows, error: fetchRsvpErr } = await supabase
      .from(rsvpTable)
      .select('invite_id, confirmed, properties, email, phone')
      .in('invite_id', invitedIds);

    if (fetchRsvpErr) {
      console.error('Bulk set-events fetch rsvp error:', fetchRsvpErr);
      return NextResponse.json({ error: 'Failed to load existing RSVP rows.' }, { status: 500 });
    }

    const existingByInvite = new Map(
      (existingRows ?? []).map((r) => [r.invite_id as string, r])
    );

    const nowIso = new Date().toISOString();
    const toInsert: Array<{
      invite_id: string;
      first_name: string;
      last_name: string;
      confirmed: boolean;
      properties: RSVPProperties;
      updated_at: string;
    }> = [];
    const toUpdate: Array<{ invite_id: string; properties: RSVPProperties }> = [];
    const toDelete: string[] = [];

    for (const guest of invited) {
      const existing = existingByInvite.get(guest.invite_id);
      const existingProps: RSVPProperties = (existing?.properties as RSVPProperties) ?? {};
      const isPlaceholder = existingProps.invitation_only === true;

      const nextProps: RSVPProperties = { ...existingProps };
      if (invited_events === null) {
        delete nextProps.invited_events;
      } else {
        nextProps.invited_events = invited_events;
      }

      // Placeholder row with no restriction left → nothing to store.
      if (isPlaceholder && nextProps.invited_events === undefined) {
        if (existing) toDelete.push(guest.invite_id);
        continue;
      }

      if (!existing) {
        if (nextProps.invited_events === undefined) continue; // invited to all + no row = no-op
        toInsert.push({
          invite_id: guest.invite_id,
          first_name: guest.first_name,
          last_name: guest.last_name,
          confirmed: false,
          properties: { ...nextProps, invitation_only: true, rsvp_on_behalf: 'admin' },
          updated_at: nowIso,
        });
        continue;
      }

      toUpdate.push({ invite_id: guest.invite_id, properties: nextProps });
    }

    if (toDelete.length > 0) {
      const { error: deleteErr } = await supabase
        .from(rsvpTable)
        .delete()
        .in('invite_id', toDelete);
      if (deleteErr) {
        console.error('Bulk set-events delete error:', deleteErr);
        return NextResponse.json({ error: 'Failed to clear invited events.' }, { status: 500 });
      }
    }

    if (toInsert.length > 0) {
      const { error: insertErr } = await supabase.from(rsvpTable).insert(toInsert);
      if (insertErr) {
        console.error('Bulk set-events insert error:', insertErr);
        return NextResponse.json({ error: 'Failed to save invited events.' }, { status: 500 });
      }
    }

    for (const row of toUpdate) {
      const { error: updateErr } = await supabase
        .from(rsvpTable)
        .update({ properties: row.properties, updated_at: nowIso })
        .eq('invite_id', row.invite_id);
      if (updateErr) {
        console.error('Bulk set-events update error:', updateErr);
        return NextResponse.json({ error: 'Failed to save invited events.' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      updated: toInsert.length + toUpdate.length + toDelete.length,
      skipped_not_invited,
      location,
    });
  } catch (error) {
    console.error('Bulk set-events error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
