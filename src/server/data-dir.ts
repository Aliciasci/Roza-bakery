import "server-only";
import path from "node:path";

/**
 * Dossier des données persistantes (commandes, photos, contenu modifié dans l'admin).
 * En production, faire pointer DATA_DIR vers un volume persistant (ex. Railway : /data).
 */
export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), "data");
