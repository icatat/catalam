import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();

    // Extract Open Graph tags
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
    const ogUrl = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i)?.[1] || url;

    // Fallback to regular meta tags if OG tags not found
    const title = ogTitle || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '';
    const description = ogDescription || html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

    // Get domain name
    const domain = new URL(url).hostname;

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      image: ogImage,
      url: ogUrl,
      domain: domain,
    });
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link preview' },
      { status: 500 }
    );
  }
}
