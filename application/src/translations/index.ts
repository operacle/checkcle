import enTranslations from './en';
import plTranslations from './pl';
import kmTranslations from './km';
import deTranslations from './de';
import koTranslations from './ko';
import jaTranslations from './ja';
import zhcnTranslations from './zhcn';

export type Language = "en" | "pl" | "km" | "de" | "ko" | "ja" | "zhcn";

export const translations = {
  en: enTranslations,
  pl: plTranslations,
  km: kmTranslations,
  de: deTranslations,
  ko: koTranslations,
  ja: jaTranslations,
  zhcn: zhcnTranslations,
};

// Type for accessing translations by module and key
export type TranslationModule = keyof typeof enTranslations;
export type TranslationKey<M extends TranslationModule> = keyof typeof enTranslations[M];
