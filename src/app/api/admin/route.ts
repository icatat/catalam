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

// GET /api/admin?invite_id=XXX — list all guests with RSVP data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteId = searchParams.get('invite_id');

    if (!inviteId || !(await verifyAdmin(inviteId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [{ data: guests, error }, { data: rsvpVN }, { data: rsvpRO }] = await Promise.all([
      supabase.from('guests').select('*').order('last_name', { ascending: true }),
      supabase.from('rsvp_vietnam').select('invite_id, confirmed, email, phone, properties, updated_at'),
      supabase.from('rsvp_romania').select('invite_id, confirmed, email, phone, properties, updated_at'),
    ]);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
    }

    const vnMap = new Map((rsvpVN ?? []).map((r) => [r.invite_id, r]));
    const roMap = new Map((rsvpRO ?? []).map((r) => [r.invite_id, r]));

    const enriched = (guests ?? []).map((g) => ({
      ...g,
      rsvp_vietnam: vnMap.get(g.invite_id) ?? null,
      rsvp_romania: roMap.get(g.invite_id) ?? null,
    }));

    return NextResponse.json({ guests: enriched });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin — remove a guest and their RSVP records
export async function DELETE(request: Request) {
  try {
    const { admin_invite_id, target_invite_id } = await request.json();

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!target_invite_id?.trim()) {
      return NextResponse.json({ error: 'target_invite_id is required.' }, { status: 400 });
    }

    const targetId = target_invite_id.trim().toUpperCase();

    // Prevent deleting the admin accounts themselves
    const { data: targetGuest } = await supabase
      .from('guests')
      .select('first_name, last_name')
      .eq('invite_id', targetId)
      .single();

    if (
      targetGuest &&
      ADMINS.some(
        (a) =>
          a.first_name.toLowerCase() === targetGuest.first_name?.toLowerCase() &&
          a.last_name.toLowerCase() === targetGuest.last_name?.toLowerCase()
      )
    ) {
      return NextResponse.json({ error: 'Cannot delete an admin account.' }, { status: 403 });
    }

    // Delete RSVP records first, then the guest row
    await Promise.all([
      supabase.from('rsvp_vietnam').delete().eq('invite_id', targetId),
      supabase.from('rsvp_romania').delete().eq('invite_id', targetId),
    ]);

    const { error: deleteError } = await supabase
      .from('guests')
      .delete()
      .eq('invite_id', targetId);

    if (deleteError) {
      console.error('Admin guest delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete guest.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin — admin management of a guest.
// Supports these actions:
//   • set_status         — { location, status: 'attending' | 'declined' | 'none' }  (default; back-compat)
//   • set_invited_events — { location, invited_events: string[] | null }  (null = invited to all events)
//   • edit               — { location, fields: { confirmed?, email?, phone?, properties? } }  (full on-behalf edit)
//   • edit_guest         — { guest_fields: { first_name?, last_name?, group? } }  (rename / regroup)
export async function PATCH(request: Request) {
  try {
    const body: {
      admin_invite_id?: string;
      target_invite_id?: string;
      location?: 'vietnam' | 'romania';
      action?: 'set_status' | 'set_invited_events' | 'edit' | 'edit_guest';
      status?: 'attending' | 'declined' | 'none';
      invited_events?: string[] | null;
      fields?: {
        confirmed?: boolean;
        email?: string | null;
        phone?: string | null;
        properties?: Partial<RSVPProperties>;
      };
      guest_fields?: {
        first_name?: string;
        last_name?: string;
        group?: string | null;
      };
    } = await request.json();

    const { admin_invite_id, target_invite_id, location, status, invited_events, fields, guest_fields } = body;
    // Default to the original status-toggle behaviour when no action is given.
    const action = body.action ?? 'set_status';

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!target_invite_id?.trim()) {
      return NextResponse.json({ error: 'target_invite_id is required.' }, { status: 400 });
    }

    const targetId = target_invite_id.trim().toUpperCase();

    // ── edit_guest — rename / regroup (no location required) ────────────────
    if (action === 'edit_guest') {
      const { data: existingGuest, error: fetchErr } = await supabase
        .from('guests')
        .select('first_name, last_name')
        .eq('invite_id', targetId)
        .single();
      if (fetchErr || !existingGuest) {
        return NextResponse.json({ error: 'Guest not found.' }, { status: 404 });
      }

      const isAdminTarget = ADMINS.some(
        (a) =>
          a.first_name.toLowerCase() === existingGuest.first_name?.toLowerCase() &&
          a.last_name.toLowerCase() === existingGuest.last_name?.toLowerCase()
      );
      if (isAdminTarget) {
        return NextResponse.json({ error: 'Cannot rename an admin account.' }, { status: 403 });
      }

      const update: { first_name?: string; last_name?: string; group?: string | null } = {};
      if (guest_fields?.first_name !== undefined) {
        if (!guest_fields.first_name.trim()) {
          return NextResponse.json({ error: 'first_name cannot be blank.' }, { status: 400 });
        }
        update.first_name = guest_fields.first_name.trim();
      }
      if (guest_fields?.last_name !== undefined) {
        if (!guest_fields.last_name.trim()) {
          return NextResponse.json({ error: 'last_name cannot be blank.' }, { status: 400 });
        }
        update.last_name = guest_fields.last_name.trim();
      }
      if (guest_fields?.group !== undefined) {
        update.group = guest_fields.group?.trim() ? guest_fields.group.trim() : null;
      }

      if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
      }

      const { error: updateErr } = await supabase
        .from('guests')
        .update(update)
        .eq('invite_id', targetId);
      if (updateErr) {
        console.error('Admin edit_guest update error:', updateErr);
        return NextResponse.json({ error: 'Failed to update guest.' }, { status: 500 });
      }

      // Propagate the new name to any existing RSVP rows.
      if (update.first_name !== undefined || update.last_name !== undefined) {
        const rsvpNameUpdate: { first_name?: string; last_name?: string } = {};
        if (update.first_name !== undefined) rsvpNameUpdate.first_name = update.first_name;
        if (update.last_name !== undefined) rsvpNameUpdate.last_name = update.last_name;
        await Promise.all([
          supabase.from('rsvp_vietnam').update(rsvpNameUpdate).eq('invite_id', targetId),
          supabase.from('rsvp_romania').update(rsvpNameUpdate).eq('invite_id', targetId),
        ]);
      }

      return NextResponse.json({ success: true });
    }

    if (!location) {
      return NextResponse.json({ error: 'location is required for this action.' }, { status: 400 });
    }

    if (location !== 'vietnam' && location !== 'romania') {
      return NextResponse.json({ error: 'Invalid location.' }, { status: 400 });
    }
    const rsvpTable = location === 'romania' ? 'rsvp_romania' : 'rsvp_vietnam';
    const locationCol = location === 'romania' ? 'romania' : 'vietnam';

    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('invite_id', targetId)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found.' }, { status: 404 });
    }

    if (!guest[locationCol]) {
      return NextResponse.json(
        { error: `Guest is not invited to the ${location} wedding.` },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from(rsvpTable)
      .select('confirmed, properties, email, phone')
      .eq('invite_id', targetId)
      .single();

    const existingProps: RSVPProperties = (existing?.properties as RSVPProperties) ?? {};
    const nowIso = new Date().toISOString();

    // Upsert a row for the target guest with the given confirmed/properties/email/phone.
    const upsertRow = async (row: {
      confirmed: boolean;
      properties: RSVPProperties;
      email?: string | null;
      phone?: string | null;
    }) => {
      if (existing) {
        return supabase.from(rsvpTable).update({ ...row, updated_at: nowIso }).eq('invite_id', targetId);
      }
      return supabase.from(rsvpTable).insert({
        invite_id: targetId,
        first_name: guest.first_name,
        last_name: guest.last_name,
        updated_at: nowIso,
        ...row,
      });
    };

    // ── set_invited_events ──────────────────────────────────────────────────
    if (action === 'set_invited_events') {
      if (invited_events !== null && !Array.isArray(invited_events)) {
        return NextResponse.json({ error: 'invited_events must be an array or null.' }, { status: 400 });
      }

      const nextProps: RSVPProperties = { ...existingProps };
      if (invited_events === null) {
        delete nextProps.invited_events;
      } else {
        nextProps.invited_events = invited_events;
      }

      const isPlaceholder = existingProps.invitation_only === true;

      // A placeholder row that no longer restricts any events has no reason to exist.
      if (isPlaceholder && nextProps.invited_events === undefined) {
        if (existing) await supabase.from(rsvpTable).delete().eq('invite_id', targetId);
        return NextResponse.json({ success: true });
      }

      if (!existing) {
        // No response yet — create an invitation-only placeholder to hold the list.
        if (nextProps.invited_events === undefined) {
          return NextResponse.json({ success: true }); // nothing to store (invited to all)
        }
        const { error } = await supabase.from(rsvpTable).insert({
          invite_id: targetId,
          first_name: guest.first_name,
          last_name: guest.last_name,
          confirmed: false,
          properties: { ...nextProps, invitation_only: true, rsvp_on_behalf: 'admin' },
          updated_at: nowIso,
        });
        if (error) {
          console.error('Admin invited_events insert error:', error);
          return NextResponse.json({ error: 'Failed to save invited events.' }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }

      // Existing row — merge without changing response/placeholder status.
      const { error } = await supabase
        .from(rsvpTable)
        .update({ properties: nextProps, updated_at: nowIso })
        .eq('invite_id', targetId);
      if (error) {
        console.error('Admin invited_events update error:', error);
        return NextResponse.json({ error: 'Failed to save invited events.' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    // ── edit (full on-behalf response) ──────────────────────────────────────
    if (action === 'edit') {
      if (!fields || typeof fields.confirmed !== 'boolean') {
        return NextResponse.json(
          { error: 'fields.confirmed (boolean) is required for edit.' },
          { status: 400 }
        );
      }
      // Merge submitted properties over existing, preserve invited_events, and
      // mark it a real response (drop invitation_only).
      const mergedProps: RSVPProperties = {
        ...existingProps,
        ...fields.properties,
        invited_events: fields.properties?.invited_events ?? existingProps.invited_events,
        rsvp_on_behalf: existingProps.rsvp_on_behalf ?? 'admin',
      };
      delete mergedProps.invitation_only;
      if (mergedProps.invited_events === undefined) delete mergedProps.invited_events;

      const { error } = await upsertRow({
        confirmed: fields.confirmed,
        properties: mergedProps,
        email: fields.email ?? existing?.email ?? null,
        phone: fields.phone ?? existing?.phone ?? null,
      });
      if (error) {
        console.error('Admin RSVP edit error:', error);
        return NextResponse.json({ error: 'Failed to save RSVP.' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    // ── set_status (default / back-compat) ──────────────────────────────────
    if (status !== 'attending' && status !== 'declined' && status !== 'none') {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    if (status === 'none') {
      // Clearing the response: keep the row as an invitation-only placeholder if
      // it still carries an invited-events restriction; otherwise remove it.
      if (existing && existingProps.invited_events !== undefined) {
        const { error } = await supabase
          .from(rsvpTable)
          .update({
            confirmed: false,
            properties: {
              invited_events: existingProps.invited_events,
              invitation_only: true,
              rsvp_on_behalf: existingProps.rsvp_on_behalf ?? 'admin',
            },
            updated_at: nowIso,
          })
          .eq('invite_id', targetId);
        if (error) {
          console.error('Admin RSVP clear error:', error);
          return NextResponse.json({ error: 'Failed to clear RSVP.' }, { status: 500 });
        }
        return NextResponse.json({ success: true, status: 'none' });
      }

      const { error: deleteError } = await supabase
        .from(rsvpTable)
        .delete()
        .eq('invite_id', targetId);
      if (deleteError) {
        console.error('Admin RSVP clear error:', deleteError);
        return NextResponse.json({ error: 'Failed to clear RSVP.' }, { status: 500 });
      }
      return NextResponse.json({ success: true, status: 'none' });
    }

    // attending / declined — real response; preserve invited_events, drop placeholder flag.
    const confirmed = status === 'attending';
    const nextProps: RSVPProperties = { ...existingProps, rsvp_on_behalf: existingProps.rsvp_on_behalf ?? 'admin' };
    delete nextProps.invitation_only;

    const { error: statusError } = await upsertRow({ confirmed, properties: nextProps });
    if (statusError) {
      console.error('Admin RSVP status error:', statusError);
      return NextResponse.json({ error: 'Failed to update RSVP.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, status });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin — add a primary guest + named plus-ones
export async function POST(request: Request) {
  try {
    const {
      admin_invite_id,
      first_name,
      last_name,
      destination,
      plus_ones,
    }: {
      admin_invite_id: string;
      first_name: string;
      last_name: string;
      destination: 'vietnam' | 'romania' | 'both';
      plus_ones: Array<{ first_name: string; last_name: string }>;
    } = await request.json();

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!first_name?.trim() || !last_name?.trim() || !destination) {
      return NextResponse.json(
        { error: 'First name, last name, and destination are required.' },
        { status: 400 }
      );
    }

    const vietnam = destination === 'vietnam' || destination === 'both';
    const romania = destination === 'romania' || destination === 'both';
    const plusOnes = Array.isArray(plus_ones) ? plus_ones : [];
    const groupName = plusOnes.length > 0 ? `${first_name.trim()}${last_name.trim()}s group` : null;

    // Generate invite IDs sequentially so each one avoids the previous
    const primaryId = await generateInviteId(first_name.trim(), last_name.trim());

    const toInsert: Array<{
      invite_id: string;
      first_name: string;
      last_name: string;
      vietnam: boolean;
      romania: boolean;
      group: string | null;
    }> = [
      {
        invite_id: primaryId,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        vietnam,
        romania,
        group: groupName,
      },
    ];

    for (const po of plusOnes) {
      if (!po.first_name?.trim() || !po.last_name?.trim()) continue;
      const poId = await generateInviteId(po.first_name.trim(), po.last_name.trim());
      toInsert.push({
        invite_id: poId,
        first_name: po.first_name.trim(),
        last_name: po.last_name.trim(),
        vietnam,
        romania,
        group: groupName,
      });
    }

    const { error: insertError } = await supabase.from('guests').insert(toInsert);

    if (insertError) {
      console.error('Admin guest insert error:', insertError);
      return NextResponse.json({ error: 'Failed to add guest(s).' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      group: groupName,
      guests: toInsert.map(({ invite_id, first_name, last_name }) => ({
        invite_id,
        first_name,
        last_name,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
