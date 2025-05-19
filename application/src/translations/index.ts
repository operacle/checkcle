
import { enTranslations } from './en';
import { kmTranslations } from './km';
import { deTranslations } from './de';

export type Language = "en" | "km" | "de";

export const translations = {
  en: enTranslations,
  km: kmTranslations,
  de: deTranslations,
};

export type TranslationKey = keyof typeof enTranslations;
