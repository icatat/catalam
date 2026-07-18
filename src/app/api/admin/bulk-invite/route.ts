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

// POST /api/admin/bulk-invite — invite or disinvite many guests to a wedding.
// Disinviting also deletes the matching RSVP row for that wedding.
export async function POST(request: Request) {
  try {
    const {
      admin_invite_id,
      target_invite_ids,
      location,
      invited,
    }: {
      admin_invite_id?: string;
      target_invite_ids?: string[];
      location?: 'vietnam' | 'romania';
      invited?: boolean;
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

    if (typeof invited !== 'boolean') {
      return NextResponse.json({ error: 'invited (boolean) is required.' }, { status: 400 });
    }

    const ids = Array.from(
      new Set(target_invite_ids.map((id) => id.trim().toUpperCase()).filter(Boolean))
    );
    if (ids.length === 0) {
      return NextResponse.json({ error: 'No valid target_invite_ids provided.' }, { status: 400 });
    }

    const rsvpTable = location === 'romania' ? 'rsvp_romania' : 'rsvp_vietnam';
    const locationCol = location === 'romania' ? 'romania' : 'vietnam';

    const { error: updateError } = await supabase
      .from('guests')
      .update({ [locationCol]: invited })
      .in('invite_id', ids);

    if (updateError) {
      console.error('Bulk invite update error:', updateError);
      return NextResponse.json({ error: 'Failed to update invitations.' }, { status: 500 });
    }

    let rsvpDeleted = 0;
    if (!invited) {
      const { error: rsvpDeleteError, count } = await supabase
        .from(rsvpTable)
        .delete({ count: 'exact' })
        .in('invite_id', ids);

      if (rsvpDeleteError) {
        console.error('Bulk disinvite RSVP delete error:', rsvpDeleteError);
        return NextResponse.json(
          { error: 'Guests were disinvited, but clearing their RSVP data failed.' },
          { status: 500 }
        );
      }
      rsvpDeleted = count ?? 0;
    }

    return NextResponse.json({
      success: true,
      updated: ids.length,
      rsvp_deleted: rsvpDeleted,
      invited,
      location,
    });
  } catch (error) {
    console.error('Bulk invite error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
