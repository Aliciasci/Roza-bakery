import type { Locale } from "../config";
import { fr, type Dictionary } from "./fr";
import { kab } from "./kab";

const dictionaries: Record<Locale, Dictionary> = { fr, kab };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? fr;
}

export type { Dictionary };
