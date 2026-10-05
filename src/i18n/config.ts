/**
 * Langues du site.
 * - Français : langue par défaut, adresses sans préfixe (/composer)
 * - Kabyle (taqbaylit) : adresses préfixées (/kab/composer)
 */
export const locales = ["fr", "kab"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, { short: string; name: string; tifinagh?: string; htmlLang: string }> = {
  fr: { short: "FR", name: "Français", htmlLang: "fr" },
  kab: { short: "KAB", name: "Taqbaylit", tifinagh: "ⵜⴰⵇⴱⴰⵢⵍⵉⵜ", htmlLang: "kab" },
};

export const LOCALE_HEADER = "x-roza-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Sépare la langue du reste du chemin : "/kab/composer" → { locale: "kab", path: "/composer" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const match = pathname.match(/^\/(kab)(\/.*)?$/);
  if (match) return { locale: "kab", path: match[2] || "/" };
  return { locale: defaultLocale, path: pathname || "/" };
}

/** Construit une adresse dans la langue voulue : localizePath("/composer", "kab") → "/kab/composer". */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
