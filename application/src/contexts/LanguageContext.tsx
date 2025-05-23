
import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language, TranslationModule, TranslationKey } from "@/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <M extends TranslationModule>(key: string, module?: M) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = <M extends TranslationModule>(key: string, module?: M): string => {
    // If module is provided, look up in that specific module
    if (module) {
      const translatedValue = translations[language][module][key as TranslationKey<M>];
      return typeof translatedValue === 'string' ? translatedValue : key;
    }

    // If no module is provided, search through all modules
    for (const mod in translations[language]) {
      const moduleKey = mod as TranslationModule;
      const translatedValue = translations[language][moduleKey][key as any];
      if (translatedValue && typeof translatedValue === 'string') {
        return translatedValue;
      }
    }

    // If no translation found, return the key
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};