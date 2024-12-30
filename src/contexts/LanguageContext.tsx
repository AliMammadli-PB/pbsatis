'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface Translation {
  [key: string]: string | Translation;
}

type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationFunction;
  translations: Record<string, Translation>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: () => '',
  translations: {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('tr');
  const [translations, setTranslations] = useState<Record<string, Translation>>({});

  const loadTranslations = async (lang: string) => {
    try {
      const translationModule = await import(`@/i18n/locales/${lang}.json`);
      setTranslations(translationModule.default);
    } catch (error) {
      console.error(`Dil dosyası yüklenemedi: ${lang}`, error);
    }
  };

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const t: TranslationFunction = (key, params = {}) => {
    const keys = key.split('.');
    let translation: string | Translation = translations;

    for (const k of keys) {
      if (typeof translation === 'object' && translation !== null) {
        translation = translation[k];
      } else {
        return key;
      }
    }

    if (typeof translation !== 'string') {
      return key;
    }

    // Parametreleri yerleştir
    return Object.entries(params).reduce(
      (str, [paramKey, value]) => str.replace(`{${paramKey}}`, String(value)),
      translation
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}