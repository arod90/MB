import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not access image' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return NextResponse.json({
      imageData: `data:${contentType};base64,${base64}`,
      contentType,
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
