import "server-only";
import path from "node:path";

/**
 * Dossier des données persistantes (commandes, photos, contenu modifié dans l'admin).
 *
 * Ordre de priorité :
 * 1. DATA_DIR (si défini)
 * 2. Le volume Railway attaché au service (RAILWAY_VOLUME_MOUNT_PATH, fourni automatiquement)
 * 3. ./data (développement local)
 */

const volume = process.env.RAILWAY_VOLUME_MOUNT_PATH ? path.resolve(process.env.RAILWAY_VOLUME_MOUNT_PATH) : null;
const explicit = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : null;

export const DATA_DIR = explicit ?? volume ?? path.join(process.cwd(), "data");

const onRailway = Boolean(process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID);
const insideVolume = (dir: string) => volume !== null && (dir === volume || dir.startsWith(volume + path.sep));

export type StorageStatus =
  | { ok: true; dir: string }
  | { ok: false; dir: string; problem: "no-volume" | "outside-volume"; volume: string | null };

/** Vérifie que les données sont bien stockées sur un volume persistant (affiché dans l'admin). */
export function storageStatus(): StorageStatus {
  if (!onRailway) return { ok: true, dir: DATA_DIR };
  if (!volume) return { ok: false, dir: DATA_DIR, problem: "no-volume", volume };
  if (!insideVolume(DATA_DIR)) return { ok: false, dir: DATA_DIR, problem: "outside-volume", volume };
  return { ok: true, dir: DATA_DIR };
}

if (!storageStatus().ok) {
  console.warn(
    `[stockage] ⚠️ Les données (${DATA_DIR}) ne sont pas sur un volume persistant : ` +
      "photos, commandes et modifications de l'admin seront perdues au prochain déploiement.",
  );
}
