// Import all locale message files
import enMessages from "./en.json";

// Available locales
export const LOCALES = {
  ENGLISH: "en",
};

// Locale display names
export const LOCALE_NAMES = {
  en: "English",
};

// Messages object for each locale
export const messages = {
  en: enMessages,
};

// Default locale
export const DEFAULT_LOCALE = LOCALES.ENGLISH;

// Get messages for a specific locale
export const getMessages = (locale = DEFAULT_LOCALE) => {
  return messages[locale] || messages[DEFAULT_LOCALE];
};
