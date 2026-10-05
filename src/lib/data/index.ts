/**
 * Couche d'accès aux données publiques.
 * Le contenu provient du stockage géré par l'admin (`src/server/content/store.ts`).
 */
import "server-only";
import type { CompositionStep, Creation, CreationCategoryInfo, FaqItem, SiteInfo, SitePhotos } from "@/lib/types";
import { getContent } from "@/server/content/store";

export async function getSiteInfo(): Promise<SiteInfo> {
  return (await getContent()).site;
}

/** Étapes pour le site public : les options désactivées (`available: false`) sont retirées. */
export async function getCompositionSteps(): Promise<CompositionStep[]> {
  const { steps } = await getContent();
  return steps.map((step) => ({
    ...step,
    groups: step.groups
      .map((group) => ({ ...group, options: group.options.filter((option) => option.available !== false) }))
      .filter((group) => group.options.length > 0),
  }));
}

export async function getSitePhotos(): Promise<SitePhotos> {
  return (await getContent()).photos;
}

export async function getCreations(): Promise<Creation[]> {
  return (await getContent()).creations;
}

export async function getCreationCategories(): Promise<CreationCategoryInfo[]> {
  return (await getContent()).categories;
}

export async function getFaq(): Promise<FaqItem[]> {
  return (await getContent()).faq;
}
