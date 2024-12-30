'use client';

import { useLanguage } from '@/lib/language';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import Image from 'next/image';

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '/flags/tr.png' },
  { code: 'en', name: 'English', flag: '/flags/gb.png' },
  { code: 'ru', name: 'Русский', flag: '/flags/ru.png' },
  { code: 'az', name: 'Azərbaycan', flag: '/flags/az.png' }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{t('admin.title')}</h1>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {t('admin.viewSite')}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-1 p-1 rounded ${currentLanguage === lang.code ? 'bg-gray-100' : ''}`}
                  title={lang.name}
                >
                  <Image
                    src={lang.flag}
                    alt={lang.name}
                    width={20}
                    height={20}
                    className="rounded-sm"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}