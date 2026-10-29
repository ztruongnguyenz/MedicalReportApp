import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Import file JSON directly
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import ja from '../locales/ja.json';
import fr from '../locales/fr.json';

const translations = { en, fr, ja, vi };
const i18n = new I18n(translations);

const rawLocale = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = translations[rawLocale as keyof typeof translations] ? rawLocale : 'en';

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// --- DEBUG LOCALIZATION STILL WORKS ---
// console.log('[i18n Init] Current Locale:', i18n.locale);
// console.log('[i18n Init] Test translation for "emailPlaceholder":', i18n.t('emailPlaceholder'));
// console.log('[i18n Init] Test translation for "alert.title":', i18n.t('alert.title'));
// ---------------------------------------------

export default i18n;