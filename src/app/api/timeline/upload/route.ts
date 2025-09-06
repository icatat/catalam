import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const date = formData.get('date') as string;
    const tag = formData.get('tag') as string;

    // Validate required fields
    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${uuidv4()}.${fileExtension}`;
    const blobPath = `timeline/${fileName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(blobPath, file, {
      access: 'public',
    });

    // Generate event ID
    const eventId = uuidv4();

    // Save to Supabase database
    const { error: dbError } = await supabase
      .from('timeline')
      .insert([
        {
          event_id: eventId,
          event: title.trim(),
          description: description.trim() || null,
          image: blob.url,
          date: date || null,
          location: location.trim() || null,
          tag: tag.trim() || null,
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to clean up the uploaded blob if database insert fails
      // Note: Vercel Blob doesn't have a direct delete API in the free tier
      return NextResponse.json(
        { error: 'Failed to save to database: ' + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        eventId,
        imageUrl: blob.url,
        message: 'Timeline event uploaded successfully'
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}