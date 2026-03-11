import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/content/RomaniaWeddingFAQ.md');
    const content = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error loading Romania FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to load FAQ data' },
      { status: 500 }
    );
  }
}
