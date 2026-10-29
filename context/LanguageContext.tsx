import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from '@/services/i18n';

const LANGUAGE_KEY = 'app_language';

interface LanguageContextType {
  locale: string;
  setLocale: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<string>(i18n.locale);
  const [isReady, setIsReady] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    let isMounted = true;
    SecureStore.getItemAsync(LANGUAGE_KEY).then((savedLang) => {
      if (savedLang && isMounted) {
        i18n.locale = savedLang;
        setLocaleState(savedLang);
      }
      if (isMounted) {
        setIsReady(true);
        setTick((prev) => prev + 1);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setLocale = async (lang: string) => {
    i18n.locale = lang;
    setLocaleState(lang);
    await SecureStore.setItemAsync(LANGUAGE_KEY, lang);
    setTick((prev) => prev + 1);
  };

  const t = (key: string) => {
    i18n.locale = locale; 
    const translated = i18n.t(key);
    // console.log(`[i18n Debug] Locale: "${i18n.locale}" | Key: "${key}" | Result: "${translated}"`);
    return translated;
  };

  if (!isReady) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);