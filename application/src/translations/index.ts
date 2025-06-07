import enTranslations from './en';
import kmTranslations from './km';
import deTranslations from './de';
import zhcnTranslations from './zhcn';

export type Language = "en" | "km" | "de" | "zhcn";

export const translations = {
  en: enTranslations,
  km: kmTranslations,
  de: deTranslations,
  zhcn: zhcnTranslations,
};

// Type for accessing translations by module and key
export type TranslationModule = keyof typeof enTranslations;
export type TranslationKey<M extends TranslationModule> = keyof typeof enTranslations[M];
