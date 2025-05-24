import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/common.json';
import zh from '../locales/zh/common.json';
import pt from '../locales/pt/common.json';
import de from '../locales/de/common.json';
import ko from '../locales/ko/common.json';
import hi from '../locales/hi/common.json';
import fr from '../locales/fr/common.json';

// Translation resources
const resources = {
  en: {
    common: en,
  },
  zh: {
    common: zh,
  },
  pt: {
    common: pt,
  },
  de: {
    common: de,
  },
  ko: {
    common: ko,
  },
  hi: {
    common: hi,
  },
  fr: {
    common: fr,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    defaultNS: 'common',
    
    react: {
      useSuspense: false,
    },
  });

export default i18n; 