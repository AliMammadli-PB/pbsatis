'use client';

import React from 'react';
import Link from 'next/link';
import LanguageSelector from '@/components/LanguageSelector';

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <LanguageSelector />
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin/accounts" 
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Hesaplar
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/accounts/new" 
                className="block py-2 px-4 hover:bg-gray-700 rounded"
              >
                Yeni Hesap Ekle
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="flex-grow bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}
