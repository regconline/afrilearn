import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { availableLanguages } from "@/lib/i18n";

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
}

const defaultLanguage = "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<string>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("afrilearn-language");
    
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split("-")[0];
    if (availableLanguages.some(lang => lang.code === browserLang)) {
      return browserLang;
    }
    
    // Fallback to English
    return defaultLanguage;
  });

  const setLanguage = (code: string) => {
    if (availableLanguages.some(lang => lang.code === code)) {
      localStorage.setItem("afrilearn-language", code);
      setLanguageState(code);
      
      // Update document language
      document.documentElement.lang = code;
    } else {
      console.warn(`Unsupported language code: ${code}`);
    }
  };

  // Set the initial document language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
