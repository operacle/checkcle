import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language, TranslationModule, TranslationKey } from "@/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <M extends TranslationModule>(key: string, module?: M) => string;
};

// ❗ Create the context with `undefined` to enforce provider usage
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ✅ Stable custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = <M extends TranslationModule>(key: string, module?: M): string => {
    if (module) {
      const translatedValue = translations[language][module][key as TranslationKey<M>];
      return typeof translatedValue === "string" ? translatedValue : key;
    }

    for (const mod in translations[language]) {
      const moduleKey = mod as TranslationModule;
      const translatedValue = translations[language][moduleKey][key as any];
      if (translatedValue && typeof translatedValue === "string") {
        return translatedValue;
      }
    }

    return key;
git fetch origin  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
