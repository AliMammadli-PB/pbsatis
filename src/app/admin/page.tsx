'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Users, Settings } from 'lucide-react';

interface Stats {
  totalAccounts: number;
  activeAccounts: number;
  soldAccounts: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalAccounts: 0,
    activeAccounts: 0,
    soldAccounts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('admin.dashboard.title')}</h1>
          <div className="flex gap-4">
            <Link href="/admin/accounts/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('admin.accounts.add')}
              </Button>
            </Link>
            <Link href="/admin/accounts">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('admin.accounts.manage')}
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('admin.settings')}
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t('admin.dashboard.totalAccounts')}
              </h3>
              <p className="text-3xl font-bold">{stats.totalAccounts}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t('admin.dashboard.activeAccounts')}
              </h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeAccounts}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t('admin.dashboard.soldAccounts')}
              </h3>
              <p className="text-3xl font-bold text-blue-600">{stats.soldAccounts}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t('admin.dashboard.totalRevenue')}
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 