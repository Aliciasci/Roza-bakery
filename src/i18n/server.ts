import "server-only";
import { headers } from "next/headers";
import { LOCALE_HEADER, defaultLocale, isLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** Langue de la requête en cours (déterminée par le proxy à partir de l'adresse). */
export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER);
  return isLocale(value) ? value : defaultLocale;
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
