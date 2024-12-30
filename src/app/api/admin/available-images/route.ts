import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const sekilDir = path.join(process.cwd(), 'public', 'sekil');
    const files = await readdir(sekilDir);
    const images = files.filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Resimler listelenirken hata:', error);
    return NextResponse.json(
      { error: 'Resimler listelenemedi' },
      { status: 500 }
    );
  }
} 