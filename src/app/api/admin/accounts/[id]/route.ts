import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma';

// Hesap detaylarını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error('Hesap detayları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Hesap detayları alınamadı' },
      { status: 500 }
    );
  }
}

// Hesabı güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Gerekli alanları kontrol et
    if (!data.rank || !data.price || !data.contactInfo) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Hesabı güncelle
    const account = await prisma.account.update({
      where: {
        id: params.id,
      },
      data: {
        rank: data.rank,
        rankImage: data.rankImage,
        price: parseFloat(data.price),
        contactInfo: data.contactInfo,
        description: data.description,
        images: data.images || '[]',
        status: data.status,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Hesap güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Hesap güncellenemedi' },
      { status: 500 }
    );
  }
}

// Hesabı sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // params'ı await et

    await prisma.account.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hesap silinirken hata:', error);
    return NextResponse.json(
      { error: 'Hesap silinemedi' },
      { status: 500 }
    );
  }
} 