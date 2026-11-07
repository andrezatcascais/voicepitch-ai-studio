import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedAppLocale } from '../types';
import { translations, APP_LOCALES, LocaleInfo } from './translations';

interface LanguageContextType {
  locale: SupportedAppLocale;
  setLocale: (locale: SupportedAppLocale) => void;
  t: typeof translations['pt-BR'];
  availableLocales: LocaleInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LOCALE_KEY = 'voicepitch_app_locale_v2';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedAppLocale>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LOCALE_KEY) as SupportedAppLocale;
      if (stored && translations[stored]) return stored;
      // Auto-detect browser language if available
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('pt')) {
        return navLang.includes('pt-pt') ? 'pt-PT' : 'pt-BR';
      }
      if (navLang.startsWith('fr')) return 'fr';
      if (navLang.startsWith('es')) return 'es';
      if (navLang.startsWith('de')) return 'de';
      return 'pt-BR'; // Default to Portuguese (Brasil) as requested
    } catch {
      return 'pt-BR';
    }
  });

  const setLocale = (newLocale: SupportedAppLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_LOCALE_KEY, newLocale);
    } catch (e) {
      console.warn('Could not persist locale:', e);
    }
  };

  const t = translations[locale] || translations['pt-BR'];

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        availableLocales: APP_LOCALES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
