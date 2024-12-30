'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

interface Account {
  id: string;
  rank: string;
  rankImage: string;
  price: number;
  contactInfo: string;
  description: string;
  status: string;
  createdAt: string;
}

const formatPrice = (price: number, currency: string = 'AZN') => {
  const currencySymbols: { [key: string]: string } = {
    'AZN': '₼',
    'TRY': '₺',
    'USD': '$',
    'EUR': '€'
  };
  return `${price} ${currencySymbols[currency] || currency}`;
};

export default function AccountsPage() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/admin/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.accounts.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/admin/accounts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAccounts(accounts.filter(account => account.id !== id));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('admin.accounts.title')}</h1>
          <Link href="/admin/accounts/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('admin.accounts.add')}
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : accounts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">{t('admin.accounts.noAccounts')}</p>
            <Link href="/admin/accounts/new">
              <Button className="mt-4">
                {t('admin.accounts.add')}
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {account.rankImage && (
                    <div className="relative w-12 h-12">
                      <Image
                        src={account.rankImage}
                        alt={account.rank}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/accounts/edit/${account.id}`}>
                      <Button variant="outline" size="sm" title={t('common.edit')}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      title={t('common.delete')}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{account.rank}</h2>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(account.price)}
                  </p>
                  <p className="text-gray-600">{account.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{t(`admin.accounts.status_${account.status}`)}</span>
                    <span>{new Date(account.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}