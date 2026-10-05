"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, localizePath, splitLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

const LocaleContext = createContext<Locale>(defaultLocale);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Langue courante, dictionnaire et fabrique d'adresses localisées (composants client). */
export function useI18n() {
  const locale = useContext(LocaleContext);
  return {
    locale,
    t: getDictionary(locale),
    href: (path: string) => localizePath(path, locale),
    /** Chemin sans préfixe de langue (« /kab/composer » → « /composer »). */
    stripLocale: (pathname: string) => splitLocale(pathname).path,
  };
}
