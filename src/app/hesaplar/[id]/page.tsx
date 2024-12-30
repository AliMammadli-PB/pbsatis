'use client';

import { useEffect, useState } from 'react';
import { Account } from '@/models/Account';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(`/api/accounts/${params.id}`);
        if (!response.ok) {
          throw new Error('Hesap bulunamadı');
        }
        const data = await response.json();
        setAccount(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        console.error('Hesap yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [params.id]); // Bağımlılık dizisini params.id ile güncelle

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <Link
            href="/hesaplar"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Hesaplara Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hesap Bulunamadı</h1>
          <Link
            href="/hesaplar"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Hesaplara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/hesaplar"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Hesaplara Dön
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={account.rankImage || '/default-account.jpg'}
            alt={`Rank ${account.rank || 'Unknown'}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{account.rank}</h1>
            <span className="text-3xl font-bold text-blue-600">{account.price} TL</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Hesap Bilgileri</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Rank:</span> {account.rank}</p>
                <p><span className="font-medium">Oluşturulma Tarihi:</span> {new Date(account.createdAt).toLocaleDateString('tr-TR')}</p>
                {/* Diğer hesap detayları buraya eklenebilir */}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
              <div className="space-y-3">
                {account.contactInfo.discord && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Discord:</span>
                    <span>{account.contactInfo.discord}</span>
                  </div>
                )}
                {account.contactInfo.telegram && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Telegram:</span>
                    <span>{account.contactInfo.telegram}</span>
                  </div>
                )}
                {account.contactInfo.whatsapp && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">WhatsApp:</span>
                    <span>{account.contactInfo.whatsapp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
