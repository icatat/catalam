import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { blobs } = await list();
    // Filter for image files only from the /main folder
    const imageBlobs = blobs.filter(blob => 
      blob.pathname.startsWith('main/') && 
      blob.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );

    return NextResponse.json({ images: imageBlobs });
  } catch (error) {
    console.error('Error fetching images from blob store:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}