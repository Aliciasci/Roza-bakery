/**
 * Couche d'accès aux données publiques.
 * Le contenu provient du stockage géré par l'admin (`src/server/content/store.ts`),
 * puis est traduit selon la langue demandée.
 */
import "server-only";
import { defaultLocale, type Locale } from "@/i18n/config";
import {
  localizeCategories,
  localizeCreations,
  localizeFaq,
  localizeHelwa,
  localizePhotos,
  localizeSite,
  localizeSteps,
} from "@/lib/localize";
import type { CompositionStep, Creation, CreationCategoryInfo, FaqItem, HelwaCategory, SiteInfo, SitePhotos } from "@/lib/types";
import { getContent } from "@/server/content/store";

export async function getSiteInfo(locale: Locale = defaultLocale): Promise<SiteInfo> {
  return localizeSite((await getContent()).site, locale);
}

/** Étapes pour le site public : les options désactivées (`available: false`) sont retirées. */
export async function getCompositionSteps(locale: Locale = defaultLocale): Promise<CompositionStep[]> {
  const { steps } = await getContent();
  const visible = steps.map((step) => ({
    ...step,
    groups: step.groups
      .map((group) => ({ ...group, options: group.options.filter((option) => option.available !== false) }))
      .filter((group) => group.options.length > 0),
  }));
  return localizeSteps(visible, locale);
}

export async function getSitePhotos(locale: Locale = defaultLocale): Promise<SitePhotos> {
  return localizePhotos((await getContent()).photos, locale);
}

export async function getCreations(locale: Locale = defaultLocale): Promise<Creation[]> {
  return localizeCreations((await getContent()).creations, locale);
}

export async function getCreationCategories(locale: Locale = defaultLocale): Promise<CreationCategoryInfo[]> {
  return localizeCategories((await getContent()).categories, locale);
}

export async function getFaq(locale: Locale = defaultLocale): Promise<FaqItem[]> {
  return localizeFaq((await getContent()).faq, locale);
}

/** Catalogue Helwa pour le site public : pièces masquées et catégories vides retirées. */
export async function getHelwa(locale: Locale = defaultLocale): Promise<HelwaCategory[]> {
  const { helwa } = await getContent();
  const visible = helwa
    .map((category) => ({ ...category, items: category.items.filter((item) => item.available !== false) }))
    .filter((category) => category.items.length > 0);
  return localizeHelwa(visible, locale);
}
