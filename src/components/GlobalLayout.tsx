'use client';

import React, { ReactNode } from 'react';
import LanguageSelector from './LanguageSelector';
import { LanguageProvider } from '@/contexts/LanguageContext';

interface GlobalLayoutProps {
  children: ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="text-xl font-bold">Point Blank Hesapları</div>
            <LanguageSelector />
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-100 py-6 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Point Blank Hesapları. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}
