import "server-only";
import type { Metadata } from "next";
import { localeNames, localizePath, locales } from "./config";
import type { Dictionary } from "./dictionaries";
import { getI18n } from "./server";

/**
 * Métadonnées d'une page dans la langue courante, avec les liens hreflang
 * vers chaque version linguistique (référencement des deux langues).
 */
export async function pageMetadata(
  path: string,
  pick: (t: Dictionary) => { title?: string; description?: string } | string,
  options: { noIndex?: boolean } = {},
): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const picked = pick(t);
  const { title, description } = typeof picked === "string" ? { title: picked, description: undefined } : picked;
  const url = localizePath(path, locale);
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeNames[l].htmlLang, localizePath(path, l)])),
        "x-default": localizePath(path, "fr"),
      },
    },
    openGraph: { url, ...(title && { title }), ...(description && { description }) },
    ...(options.noIndex && { robots: { index: false, follow: false } }),
  };
}
