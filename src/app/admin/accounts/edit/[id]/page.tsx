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
  searchParams?: Record<string, string | string[] | undefined>;
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
        const data = await response.json();
        throw new Error(data.error || 'Hesap güncellenemedi');
      }

      router.push('/admin/accounts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAccount(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (!account) {
    return (
      <AdminLayout>
        <div className="p-8">
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">{t('admin.editAccount')}</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.rank')} *
              </label>
              <input
                type="text"
                name="rank"
                value={account.rank}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.rankImage')}
              </label>
              <input
                type="text"
                name="rankImage"
                value={account.rankImage || ''}
                onChange={handleChange}
                placeholder="/ranks/silver.png"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.price')} *
              </label>
              <input
                type="number"
                name="price"
                value={account.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.contactInfo')} *
              </label>
              <input
                type="text"
                name="contactInfo"
                value={account.contactInfo}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.description')}
              </label>
              <textarea
                name="description"
                value={account.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.images')}
              </label>
              <input
                type="text"
                name="images"
                value={account.images}
                onChange={handleChange}
                placeholder="[]"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t('admin.imagesHelp')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.status')}
              </label>
              <select
                name="status"
                value={account.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">{t('admin.status_active')}</option>
                <option value="sold">{t('admin.status_sold')}</option>
                <option value="pending">{t('admin.status_pending')}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              {t('admin.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}