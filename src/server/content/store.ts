import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { compositionSteps } from "@/content/configurator";
import { creationCategories, creations } from "@/content/creations";
import { faq } from "@/content/faq";
import { helwaCategories } from "@/content/helwa";
import { site } from "@/content/site";
import type { CompositionStep, SiteContent } from "@/lib/types";
import { DATA_DIR } from "@/server/data-dir";

/**
 * Stockage du contenu modifiable depuis l'admin.
 *
 * - Valeurs par défaut : les fichiers `src/content/*`.
 * - Modifications de l'admin : `data/content.json` (prioritaire, section par section).
 *
 * Pour un hébergement sans disque persistant (Vercel…), remplacer `readStored` / `writeStored`
 * par une base de données (Postgres, Supabase, Vercel KV…). Le reste du site ne change pas.
 */

const FILE = path.join(DATA_DIR, "content.json");

export const defaultContent: SiteContent = {
  site,
  steps: compositionSteps,
  creations,
  categories: creationCategories,
  faq,
  photos: {},
  helwa: helwaCategories,
};

async function readStored(): Promise<Partial<SiteContent>> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Partial<SiteContent>;
  } catch {
    return {};
  }
}

async function writeStored(data: Partial<SiteContent>) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, FILE); // écriture atomique
}

/** Complète les traductions manquantes d'éléments enregistrés avec celles du contenu par défaut (même identifiant). */
function withDefaultKab<T extends { id: string; kab?: object }>(items: T[], defaults: { id: string; kab?: object }[]): T[] {
  const byId = new Map(defaults.map((d) => [d.id, d.kab]));
  return items.map((item) => (item.kab || !byId.get(item.id) ? item : { ...item, kab: byId.get(item.id) }));
}

function mergeStepTranslations(steps: CompositionStep[]): CompositionStep[] {
  return withDefaultKab(steps, defaultContent.steps).map((step) => {
    const defStep = defaultContent.steps.find((s) => s.id === step.id);
    if (!defStep) return step;
    const defGroups = defStep.groups;
    const defOptions = defGroups.flatMap((g) => g.options);
    return {
      ...step,
      groups: withDefaultKab(step.groups, defGroups).map((group) => ({
        ...group,
        options: withDefaultKab(group.options, defOptions),
      })),
    };
  });
}

export async function getContent(): Promise<SiteContent> {
  const stored = await readStored();
  const site = { ...defaultContent.site, ...stored.site };
  return {
    ...defaultContent,
    ...stored,
    // Les nouveaux réglages ajoutés au code restent disponibles même si content.json est plus ancien
    site: {
      ...site,
      kab: site.kab ?? defaultContent.site.kab,
      pickupSlots: withDefaultKab(site.pickupSlots, defaultContent.site.pickupSlots),
    },
    steps: mergeStepTranslations(stored.steps ?? defaultContent.steps),
    faq: withDefaultKab(stored.faq ?? defaultContent.faq, defaultContent.faq),
    categories: withDefaultKab(stored.categories ?? defaultContent.categories, defaultContent.categories),
    creations: withDefaultKab(stored.creations ?? defaultContent.creations, defaultContent.creations),
    helwa: withDefaultKab(stored.helwa ?? defaultContent.helwa, defaultContent.helwa).map((category) => ({
      ...category,
      items: withDefaultKab(category.items, defaultContent.helwa.flatMap((c) => c.items)),
    })),
  };
}

export async function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
  const stored = await readStored();
  await writeStored({ ...stored, [key]: value });
}
