'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Users } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalAccounts: number;
  activeAccounts: number;
  soldAccounts: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const t = useTranslations('admin');
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-muted-foreground">{t('dashboardDescription')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{t('totalAccounts')}</span>
            <span className="text-2xl font-bold">{stats?.totalAccounts || 0}</span>
            <span className="text-sm text-muted-foreground">{t('accounts')}</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{t('activeAccounts')}</span>
            <span className="text-2xl font-bold">{stats?.activeAccounts || 0}</span>
            <span className="text-sm text-muted-foreground">{t('accounts')}</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{t('soldAccounts')}</span>
            <span className="text-2xl font-bold">{stats?.soldAccounts || 0}</span>
            <span className="text-sm text-muted-foreground">{t('accounts')}</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{t('totalRevenue')}</span>
            <span className="text-2xl font-bold">${stats?.totalRevenue || 0}</span>
            <span className="text-sm text-muted-foreground">{t('revenue')}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('quickActions')}</h2>
          <div className="space-y-4">
            <Link href="/admin/accounts/new" className="w-full">
              <Button className="w-full flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('newAccount')}
              </Button>
            </Link>
            <Link href="/admin/accounts" className="w-full">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('manageAccounts')}
              </Button>
            </Link>
            <Link href="/admin/settings" className="w-full">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('settings')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
} 