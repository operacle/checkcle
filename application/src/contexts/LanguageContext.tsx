import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { translations, Language, TranslationModule, TranslationKey } from "@/translations";

type TranslationVars = Record<string, string | number>;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: {
    (key: string): string;
    (key: string, vars: TranslationVars): string;
    <M extends TranslationModule>(key: string, module: M): string;
    <M extends TranslationModule>(key: string, module: M, vars: TranslationVars): string;
  };
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const fallbackLanguage: Language = "en";

  const interpolate = (template: string, vars: TranslationVars): string => {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return vars[key] !== undefined ? String(vars[key]) : match;
    });
  };

  const t = useCallback(((
    key: string,
    moduleOrVars?: TranslationModule | TranslationVars,
    vars?: TranslationVars
  ): string => {
    let module: TranslationModule | undefined;
    let variables: TranslationVars | undefined;

    if (typeof moduleOrVars === "string") {
      module = moduleOrVars;
      variables = vars;
    } else if (typeof moduleOrVars === "object") {
      variables = moduleOrVars;
    }

    const langPack = translations[language];
    const fallbackPack = translations[fallbackLanguage];
    let translatedText = "";

    if (module) {
      const moduleKey = key as TranslationKey<typeof module>;
      const valCur = langPack?.[module]?.[moduleKey];
      if (typeof valCur === "string") {
        translatedText = valCur;
      } else {
        const valEn = fallbackPack?.[module]?.[moduleKey];
        translatedText = typeof valEn === "string" ? valEn : key;
      }
    } else {
      let found = false;

      for (const mod of Object.keys(langPack) as TranslationModule[]) {
        const moduleTranslations = langPack[mod];
        if (moduleTranslations && key in moduleTranslations) {
          const val = moduleTranslations[key as keyof typeof moduleTranslations];
          if (typeof val === "string") {
            translatedText = val;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        for (const mod of Object.keys(fallbackPack) as TranslationModule[]) {
          const moduleTranslations = fallbackPack[mod];
          if (moduleTranslations && key in moduleTranslations) {
            const val = moduleTranslations[key as keyof typeof moduleTranslations];
            if (typeof val === "string") {
              translatedText = val;
              found = true;
              break;
            }
          }
        }
      }

      if (!found) {
        translatedText = key;
      }
    }

    return variables ? interpolate(translatedText, variables) : translatedText;
  }) as LanguageContextType['t'], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};