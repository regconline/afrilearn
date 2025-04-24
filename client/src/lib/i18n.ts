import { Translations, Language } from "./types";
import { translations } from "@/data/translations";

export const availableLanguages: Language[] = [
  {
    code: "en",
    name: "English",
    shortName: "EN",
    flagUrl: "https://flagcdn.com/w20/gb.png"
  },
  {
    code: "fr",
    name: "Français",
    shortName: "FR",
    flagUrl: "https://flagcdn.com/w20/fr.png"
  },
  {
    code: "sw",
    name: "Kiswahili",
    shortName: "SW",
    flagUrl: "https://flagcdn.com/w20/ke.png"
  }
];

export const translate = (language: string, key: string): string => {
  const keyParts = key.split(".");
  if (keyParts.length !== 2) {
    console.warn(`Invalid translation key format: ${key}`);
    return key;
  }

  const [section, subKey] = keyParts;

  // First try to get the translation in the requested language
  if (
    translations[language] &&
    translations[language][section] &&
    translations[language][section][subKey]
  ) {
    return translations[language][section][subKey];
  }

  // Fallback to English
  if (
    translations.en &&
    translations.en[section] &&
    translations.en[section][subKey]
  ) {
    return translations.en[section][subKey];
  }

  // If all else fails, return the key
  console.warn(`Missing translation for key: ${key}`);
  return key;
};
