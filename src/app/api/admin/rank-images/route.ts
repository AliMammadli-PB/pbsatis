import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sekilPath = path.join(process.cwd(), 'public', 'sekil');
    const files = fs.readdirSync(sekilPath);
    const images = files.filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading rank images:', error);
    return NextResponse.json({ images: [] });
  }
} 