import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { compositionSteps } from "@/content/configurator";
import { creationCategories, creations } from "@/content/creations";
import { faq } from "@/content/faq";
import { site } from "@/content/site";
import type { SiteContent } from "@/lib/types";

/**
 * Stockage du contenu modifiable depuis l'admin.
 *
 * - Valeurs par défaut : les fichiers `src/content/*`.
 * - Modifications de l'admin : `data/content.json` (prioritaire, section par section).
 *
 * Pour un hébergement sans disque persistant (Vercel…), remplacer `readStored` / `writeStored`
 * par une base de données (Postgres, Supabase, Vercel KV…). Le reste du site ne change pas.
 */

const FILE = path.join(process.cwd(), "data", "content.json");

export const defaultContent: SiteContent = {
  site,
  steps: compositionSteps,
  creations,
  categories: creationCategories,
  faq,
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

export async function getContent(): Promise<SiteContent> {
  const stored = await readStored();
  return {
    ...defaultContent,
    ...stored,
    // Les nouveaux réglages ajoutés au code restent disponibles même si content.json est plus ancien
    site: { ...defaultContent.site, ...stored.site },
  };
}

export async function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
  const stored = await readStored();
  await writeStored({ ...stored, [key]: value });
}
