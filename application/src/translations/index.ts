
import { enTranslations } from './en';
import { kmTranslations } from './km';

export type Language = "en" | "km";

export const translations = {
  en: enTranslations,
  km: kmTranslations,
};

export type TranslationKey = keyof typeof enTranslations;
