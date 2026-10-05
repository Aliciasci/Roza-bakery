import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Session administrateur : jeton signé (HMAC-SHA256) stocké dans un cookie httpOnly.
 * Utilisé par `src/proxy.ts` et par les actions serveur de l'admin.
 */

export const SESSION_COOKIE = "roza_admin";
export const SESSION_DURATION_S = 60 * 60 * 24 * 7; // 7 jours

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret() {
  const base = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!base) throw new Error("ADMIN_PASSWORD n'est pas défini");
  // Changer le mot de passe invalide automatiquement les sessions existantes
  return createHash("sha256").update(`roza-admin:${base}:${process.env.ADMIN_PASSWORD}`).digest();
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function createSessionToken(now = Date.now()) {
  const payload = `admin.${Math.floor(now / 1000) + SESSION_DURATION_S}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const payload = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(parts[2], sign(payload))) return false;
  return Number(parts[1]) * 1000 > now;
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}
