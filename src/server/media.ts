import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "./data-dir";

/**
 * Photos publiques gérées depuis l'admin (options, créations).
 * Stockées dans `data/media/` et servies par `/media/[name]`.
 * Pour un hébergement serverless, remplacer par un stockage objet (S3, Vercel Blob…).
 */

const MEDIA_DIR = path.join(DATA_DIR, "media");

export const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

export async function saveMedia(file: File): Promise<string> {
  const ext = MEDIA_TYPES[file.type];
  if (!ext) throw new Error("Formats acceptés : JPG, PNG, WEBP, AVIF.");
  if (file.size > MAX_MEDIA_BYTES) throw new Error("Image trop lourde (10 Mo maximum).");
  await mkdir(MEDIA_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  await writeFile(path.join(MEDIA_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${name}`;
}

export function mediaPath(name: string): string | null {
  if (!/^[a-z0-9-]+\.(jpg|png|webp|avif)$/.test(name)) return null;
  return path.join(MEDIA_DIR, name);
}
