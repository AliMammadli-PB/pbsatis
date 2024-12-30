import { NextResponse } from 'next/server';
import { Account } from '@/models/Account';

// Örnek veri (gerçek uygulamada veritabanından gelecek)
let accounts: Account[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rank = searchParams.get('rank');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const searchQuery = searchParams.get('search');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  let filteredAccounts = [...accounts];

  // Filtreleme
  if (rank) {
    filteredAccounts = filteredAccounts.filter(account => account.rank === rank);
  }

  if (minPrice) {
    filteredAccounts = filteredAccounts.filter(account => account.price >= Number(minPrice));
  }

  if (maxPrice) {
    filteredAccounts = filteredAccounts.filter(account => account.price <= Number(maxPrice));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredAccounts = filteredAccounts.filter(account =>
      account.rank.toLowerCase().includes(query) ||
      account.contactInfo.discord?.toLowerCase().includes(query) ||
      account.contactInfo.telegram?.toLowerCase().includes(query) ||
      account.contactInfo.whatsapp?.toLowerCase().includes(query)
    );
  }

  // Sıralama
  if (sortBy) {
    filteredAccounts.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'rank':
          comparison = a.rank.localeCompare(b.rank);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return NextResponse.json(filteredAccounts);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Veri doğrulama
    if (!data.rank || !data.price) {
      return NextResponse.json(
        { error: 'Rütbe ve fiyat zorunludur' },
        { status: 400 }
      );
    }

    if (!data.contactInfo.discord && !data.contactInfo.telegram && !data.contactInfo.whatsapp) {
      return NextResponse.json(
        { error: 'En az bir iletişim bilgisi gereklidir' },
        { status: 400 }
      );
    }

    // Yeni hesap oluştur
    const newAccount: Account = {
      id: Math.random().toString(36).substr(2, 9), // Gerçek uygulamada UUID kullanılmalı
      rank: data.rank,
      rankImage: `/ranks/${data.rank.toLowerCase()}.png`,
      price: Number(data.price),
      contactInfo: {
        discord: data.contactInfo.discord || '',
        telegram: data.contactInfo.telegram || '',
        whatsapp: data.contactInfo.whatsapp || '',
      },
      description: data.description || '',
      images: data.images || [],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Hesabı kaydet
    accounts.push(newAccount);

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error('Hesap oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Hesap oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
