'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen relative" role="main">
      {/* Arkaplan Resmi */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/point-blank-bg.jpg"
          alt="Point Blank Arkaplan"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          className="object-cover"
          priority
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHSIeHx8iLCYsICwmLCwsLiwtLS0tLTctNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Dil Seçimi */}
        <div className="flex justify-end mb-4 md:mb-8">
          <LanguageSelector />
        </div>

        {/* Ana İçerik */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-white text-center max-w-2xl mb-8">
            {t('home.description')}
          </p>
          <Link 
            href="/hesaplar"
            className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t('home.viewAccounts')}
          >
            {t('home.viewAccounts')}
          </Link>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 text-center p-4">
          <p className="text-white text-sm">&copy; {new Date().getFullYear()} Point Blank Hesap Satış</p>
        </footer>
      </div>
    </main>
  );
}
