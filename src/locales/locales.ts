import en from "./en.json";

export enum Locale {
  EN = "en",
}

const translations: { readonly [key in Locale]: typeof en } = {
  [Locale.EN]: en,
};

export const defaultLocale: Locale = Locale.EN;
export const fallbackLocale: Locale = Locale.EN;

export const getTranslation = (locale: Locale): typeof en => {
  return translations[locale];
};
