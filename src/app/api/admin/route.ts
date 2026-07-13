import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

// PATCH /api/admin — admin-set an RSVP for a guest at a location
export async function PATCH(request: Request) {
  try {
    const {
      admin_invite_id,
      target_invite_id,
      location,
      status,
    }: {
      admin_invite_id: string;
      target_invite_id: string;
      location: 'vietnam' | 'romania';
      status: 'attending' | 'declined' | 'none';
    } = await request.json();

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!target_invite_id?.trim() || !location || !status) {
      return NextResponse.json(
        { error: 'target_invite_id, location, and status are required.' },
        { status: 400 }
      );
    }

    if (location !== 'vietnam' && location !== 'romania') {
      return NextResponse.json({ error: 'Invalid location.' }, { status: 400 });
    }
    if (status !== 'attending' && status !== 'declined' && status !== 'none') {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const targetId = target_invite_id.trim().toUpperCase();
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

    if (status === 'none') {
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

    const confirmed = status === 'attending';

    const { data: existing } = await supabase
      .from(rsvpTable)
      .select('properties, email, phone')
      .eq('invite_id', targetId)
      .single();

    const nowIso = new Date().toISOString();

    if (existing) {
      const { error: updateError } = await supabase
        .from(rsvpTable)
        .update({ confirmed, updated_at: nowIso })
        .eq('invite_id', targetId);
      if (updateError) {
        console.error('Admin RSVP update error:', updateError);
        return NextResponse.json({ error: 'Failed to update RSVP.' }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase.from(rsvpTable).insert({
        invite_id: targetId,
        first_name: guest.first_name,
        last_name: guest.last_name,
        confirmed,
        properties: { rsvp_on_behalf: 'admin' },
        updated_at: nowIso,
      });
      if (insertError) {
        console.error('Admin RSVP insert error:', insertError);
        return NextResponse.json({ error: 'Failed to create RSVP.' }, { status: 500 });
      }
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
