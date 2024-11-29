import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fontName = url.searchParams.get('name');
    
    if (!fontName) {
      return NextResponse.json({ error: 'Font name is required' }, { status: 400 });
    }

    const fontPath = path.join(process.cwd(), 'public', 'fonts', fontName);
    
    if (!fs.existsSync(fontPath)) {
      return NextResponse.json({ error: 'Font not found' }, { status: 404 });
    }

    const fontBuffer = fs.readFileSync(fontPath);
    const base64Font = fontBuffer.toString('base64');

    return NextResponse.json({ data: base64Font });
  } catch (error) {
    console.error('Error loading font:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
