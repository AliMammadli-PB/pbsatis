'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  {
    code: 'az',
    name: 'Azərbaycan',
    flag: '/flags/az.png'
  },
  {
    code: 'tr',
    name: 'Türkçe',
    flag: '/flags/tr.png'
  },
  {
    code: 'en',
    name: 'English',
    flag: '/flags/gb.png'
  },
  {
    code: 'ru',
    name: 'Русский',
    flag: '/flags/ru.png'
  }
] as const;

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-4">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center gap-2 p-2 rounded transition-all ${
            language === lang.code
              ? 'bg-white/90 shadow-lg scale-110'
              : 'bg-white/50 hover:bg-white/70'
          }`}
        >
          <div className="relative w-6 h-4">
            <Image
              src={lang.flag}
              alt={lang.name}
              fill
              sizes="24px"
              className="object-cover rounded"
              priority
            />
          </div>
          <span className="text-sm font-medium">{lang.name}</span>
        </button>
      ))}
    </div>
  );
} 