/**
 * Applique les traductions du contenu (champs `kab`) selon la langue.
 * Un champ traduit vide laisse le texte français : le site n'affiche jamais de trou.
 */
import type { Locale } from "@/i18n/config";
import type {
  CompositionStep,
  ConfigOption,
  Creation,
  CreationCategoryInfo,
  FaqItem,
  PickupSlot,
  SiteInfo,
  SitePhotos,
} from "./types";

type Translatable = { kab?: object };

/** Remplace chaque champ par sa traduction quand elle existe (chaîne non vide). */
function pick<T extends Translatable>(item: T, locale: Locale, fields: (keyof T & string)[]): T {
  if (locale === "fr" || !item.kab) return item;
  const out = { ...item };
  for (const field of fields) {
    const value = (item.kab as Record<string, unknown>)[field];
    if (typeof value === "string" && value.trim()) (out as Record<string, unknown>)[field] = value;
  }
  return out;
}

export function localizeOption(option: ConfigOption, locale: Locale): ConfigOption {
  const out = pick(option, locale, ["label", "description", "variantsLabel"]);
  if (!option.variants?.length) return out;
  const translated = locale === "fr" ? undefined : option.kab?.variants;
  return { ...out, variantLabels: option.variants.map((v, i) => translated?.[i]?.trim() || v) };
}

export function localizeSteps(steps: CompositionStep[], locale: Locale): CompositionStep[] {
  return steps.map((step) => ({
    ...pick(step, locale, ["name", "title", "subtitle", "summaryLabel", "notesLabel", "notesPlaceholder"]),
    groups: step.groups.map((group) => ({
      ...pick(group, locale, ["label", "description"]),
      options: group.options.map((option) => localizeOption(option, locale)),
    })),
  }));
}

export function localizeSlots(slots: PickupSlot[], locale: Locale): PickupSlot[] {
  return slots.map((slot) => pick(slot, locale, ["label", "hint"]));
}

export function localizeSite(site: SiteInfo, locale: Locale): SiteInfo {
  const out = pick(site, locale, ["shortDescription"]);
  const hours = locale === "fr" ? undefined : site.kab?.openingHours?.filter(Boolean);
  return {
    ...out,
    openingHours: hours?.length ? hours : site.openingHours,
    pickupSlots: localizeSlots(site.pickupSlots, locale),
  };
}

export const localizeCreations = (items: Creation[], locale: Locale) =>
  items.map((c) => pick(c, locale, ["name", "description"]));

export const localizeCategories = (items: CreationCategoryInfo[], locale: Locale) =>
  items.map((c) => pick(c, locale, ["label"]));

export const localizeFaq = (items: FaqItem[], locale: Locale) =>
  items.map((f) => pick(f, locale, ["question", "answer"]));

export const localizePhotos = (photos: SitePhotos, locale: Locale) =>
  pick(photos, locale, ["heroImageAlt", "aboutImageAlt"]);
