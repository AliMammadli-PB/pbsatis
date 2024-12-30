'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Account {
  id: string;
  rank: string;
  rankImage: string | null;
  price: number;
  contactInfo: string;
  description: string | null;
  images: string;
  status: string;
}

type PageProps = {
  params: {
    id: string;
  };
};

export default function EditAccountPage({ params }: PageProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(`/api/admin/accounts/${params.id}`);
        if (!response.ok) {
          throw new Error('Hesap bulunamadı');
        }
        const data = await response.json();
        setAccount(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      }
    };

    fetchAccount();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/accounts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error('Hesap güncellenemedi');
      }

      router.push('/admin/accounts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!account) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('editAccount')}</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="rank" className="block text-sm font-medium text-gray-700">
              {t('rank')}
            </label>
            <input
              type="text"
              id="rank"
              value={account.rank}
              onChange={(e) => setAccount({ ...account, rank: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              {t('price')}
            </label>
            <input
              type="number"
              id="price"
              value={account.price}
              onChange={(e) => setAccount({ ...account, price: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
              {t('contactInfo')}
            </label>
            <input
              type="text"
              id="contactInfo"
              value={account.contactInfo}
              onChange={(e) => setAccount({ ...account, contactInfo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              {t('description')}
            </label>
            <textarea
              id="description"
              value={account.description || ''}
              onChange={(e) => setAccount({ ...account, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              {t('status')}
            </label>
            <select
              id="status"
              value={account.status}
              onChange={(e) => setAccount({ ...account, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="active">{t('active')}</option>
              <option value="inactive">{t('inactive')}</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? t('saving') : t('save')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/accounts')}
              className="text-gray-600 hover:text-gray-900"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
