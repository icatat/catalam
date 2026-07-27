import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdmin } from '@/lib/admin';

// Best-effort delete of a blob we previously uploaded. Only our own timeline
// blobs are removed; external / seeded URLs are left untouched.
async function deleteTimelineBlob(imageUrl: string | null) {
  if (!imageUrl || !imageUrl.includes('/timeline/')) return;
  try {
    await del(imageUrl);
  } catch (err) {
    console.error('Failed to delete blob (continuing):', err);
  }
}

// PATCH — admin edit of an existing timeline entry. Accepts multipart form data
// so an optional replacement image can be uploaded alongside the fields.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ event_id: string }> }
) {
  try {
    const { event_id } = await params;
    const formData = await request.formData();

    const adminInviteId = formData.get('admin_invite_id') as string | null;
    if (!adminInviteId || !(await verifyAdmin(adminInviteId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Confirm the entry exists (and grab the current image for cleanup).
    const { data: existing, error: fetchError } = await supabase
      .from('timeline')
      .select('image')
      .eq('event_id', event_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }

    const title = (formData.get('title') as string | null)?.trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const description = (formData.get('description') as string | null)?.trim();
    const location = (formData.get('location') as string | null)?.trim();
    const date = formData.get('date') as string | null;
    const tag = (formData.get('tag') as string | null)?.trim();
    const from = (formData.get('from') as string | null)?.trim();

    const updates: Record<string, string | null> = {
      event: title,
      description: description || null,
      location: location || null,
      date: date || null,
      tag: tag || null,
      from: from || null,
    };

    // Optional replacement image.
    const file = formData.get('file') as File | null;
    let newImageUrl: string | null = null;
    if (file && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
      }
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${uuidv4()}.${fileExtension}`;
      const blob = await put(`timeline/${fileName}`, file, { access: 'public' });
      newImageUrl = blob.url;
      updates.image = newImageUrl;
    }

    const { error: dbError } = await supabase
      .from('timeline')
      .update(updates)
      .eq('event_id', event_id);

    if (dbError) {
      console.error('Database error:', dbError);
      // Roll back the freshly uploaded blob if the DB write failed.
      if (newImageUrl) await deleteTimelineBlob(newImageUrl);
      return NextResponse.json(
        { error: 'Failed to update entry: ' + dbError.message },
        { status: 500 }
      );
    }

    // Only after a successful DB write, clean up the old image it replaced.
    if (newImageUrl) await deleteTimelineBlob(existing.image);

    return NextResponse.json({ success: true, imageUrl: newImageUrl ?? existing.image });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Update failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE — admin removal of a timeline entry (and its uploaded image).
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ event_id: string }> }
) {
  try {
    const { event_id } = await params;
    const { admin_invite_id } = await request.json().catch(() => ({}));

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('timeline')
      .select('image')
      .eq('event_id', event_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }

    const { error: dbError } = await supabase
      .from('timeline')
      .delete()
      .eq('event_id', event_id);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to delete entry: ' + dbError.message },
        { status: 500 }
      );
    }

    await deleteTimelineBlob(existing.image);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
