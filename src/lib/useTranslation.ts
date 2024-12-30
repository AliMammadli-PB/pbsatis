import { useState, useEffect } from 'react';
import { translations } from './language';

type Language = 'tr' | 'ru' | 'en' | 'az';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr');

  useEffect(() => {
    // Tarayıcı dilini veya önceden seçilmiş dili al
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const supportedLanguages: Language[] = ['tr', 'ru', 'en', 'az'];
    
    if (supportedLanguages.includes(browserLanguage)) {
      setCurrentLanguage(browserLanguage);
    }
  }, []);

  const t = (key: string, params?: Record<string, string>) => {
    // Nested translation keys için destek
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
      translation = translation?.[k] as Record<string, string> | string;
    }

    // Güvenli tip dönüşümü
    const result = typeof translation === 'string' ? translation : '';
    
    if (params) {
      return result.replace(/\{(\w+)\}/g, (_, key) => params[key] || '');
    }

    return result;
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    // Dil tercihini localStorage'a kaydet
    localStorage.setItem('language', lang);
  };

  return { t, currentLanguage, changeLanguage };
}
