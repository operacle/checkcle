import enTranslations from './en';
import kmTranslations from './km';
import deTranslations from './de';

export type Language = "en" | "km" | "de";

export const translations = {
  en: enTranslations,
  km: kmTranslations,
  de: deTranslations,
};

// Type for accessing translations by module and key
export type TranslationModule = keyof typeof enTranslations;
export type TranslationKey<M extends TranslationModule> = keyof typeof enTranslations[M];
