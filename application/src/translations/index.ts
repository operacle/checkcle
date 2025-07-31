import enTranslations from './en';
import kmTranslations from './km';
import deTranslations from './de';
import jaTranslations from './ja';
import zhCNTranslations from './zh-CN';

export type Language = "en" | "km" | "de" | "ja" | "zh-CN";

export const translations = {
  en: enTranslations,
  km: kmTranslations,
  de: deTranslations,
  ja: jaTranslations,
  "zh-CN": zhCNTranslations,
};

// Type for accessing translations by module and key
export type TranslationModule = keyof typeof enTranslations;
export type TranslationKey<M extends TranslationModule> = keyof typeof enTranslations[M];
