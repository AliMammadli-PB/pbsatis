import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        status: 'published' // Sadece yayınlanmış hesapları getir
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // JSON stringlerini parse et
    const parsedAccounts = accounts.map((account) => ({
      ...account,
      images: account.images ? JSON.parse(account.images) : [],
      contactInfo: account.contactInfo ? JSON.parse(account.contactInfo) : {}
    }));

    return NextResponse.json(parsedAccounts);
  } catch (error) {
    console.error('Hesapları getirirken hata:', error);
    return NextResponse.json(
      { error: 'Hesaplar yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function GET_public() {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        status: 'available' // Only show available accounts to users
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON strings for response
    const parsedAccounts = accounts.map(account => ({
      ...account,
      images: JSON.parse(account.images),
      contactInfo: JSON.parse(account.contactInfo)
    }));

    return NextResponse.json(parsedAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Veri doğrulama
    if (!data.rank) {
      return NextResponse.json(
        { error: 'Rütbe zorunludur' },
        { status: 400 }
      );
    }

    // Fiyat doğrulama
    const price = Number(data.price);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Geçerli bir fiyat girin' },
        { status: 400 }
      );
    }

    if (!data.contactInfo?.discord && !data.contactInfo?.telegram && !data.contactInfo?.whatsapp) {
      return NextResponse.json(
        { error: 'En az bir iletişim bilgisi gereklidir' },
        { status: 400 }
      );
    }

    // Yeni hesap oluştur
    const newAccount = await prisma.account.create({
      data: {
        rank: data.rank,
        rankImage: data.rankImage || `/sekil/point-blank-hesab.png`,
        price: price,
        currency: data.currency || 'AZN',
        contactInfo: JSON.stringify({
          discord: data.contactInfo?.discord || '',
          telegram: data.contactInfo?.telegram || '',
          whatsapp: data.contactInfo?.whatsapp || '',
        }),
        description: data.description || '',
        images: JSON.stringify(data.images || []),
        status: 'published',
      }
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error('Hesap oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Hesap oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}