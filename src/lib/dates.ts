/**
 * Gestion des dates de retrait (fuseau Europe/Paris), partagée client + serveur.
 * Toutes les dates sont manipulées au format "YYYY-MM-DD".
 */
import { defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { SiteInfo } from "./types";

const TIME_ZONE = "Europe/Paris";

export function todayISO(now: Date = new Date()): string {
  // en-CA produit nativement le format YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const date = parseISO(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toISO(date);
}

export function daysBetween(fromISO: string, toISODate: string): number {
  return Math.round((parseISO(toISODate).getTime() - parseISO(fromISO).getTime()) / 86_400_000);
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISO(parseISO(value)) === value;
}

export function minPickupDate(site: Pick<SiteInfo, "minLeadDays">, now?: Date): string {
  return addDays(todayISO(now), site.minLeadDays);
}

export type PickupDateStatus = "ok" | "short-notice" | "too-soon" | "unavailable" | "invalid";

/** Vérifie une date de retrait selon les règles de retrait. */
export function checkPickupDate(
  iso: string,
  site: Pick<SiteInfo, "minLeadDays" | "recommendedLeadDays" | "closedWeekdays" | "unavailableDates">,
  now?: Date,
): PickupDateStatus {
  if (!isValidISODate(iso)) return "invalid";
  const lead = daysBetween(todayISO(now), iso);
  if (lead < site.minLeadDays) return "too-soon";
  if (lead > 365) return "invalid";
  if (site.closedWeekdays.includes(parseISO(iso).getUTCDay())) return "unavailable";
  if (site.unavailableDates.includes(iso)) return "unavailable";
  if (lead < site.recommendedLeadDays) return "short-notice";
  return "ok";
}

/** Ex. « jeudi 8 octobre 2026 » / « Kuẓass 8 Tubeṛ 2026 » (noms issus du dictionnaire de la langue). */
export function formatDateLong(iso: string, locale: Locale = defaultLocale): string {
  if (!isValidISODate(iso)) return iso;
  const d = parseISO(iso);
  const { dates } = getDictionary(locale);
  return dates.long(dates.weekdays[d.getUTCDay()], d.getUTCDate(), dates.months[d.getUTCMonth()], d.getUTCFullYear());
}

/** Ex. « octobre 2026 » */
export function formatMonthYear(isoMonth: string, locale: Locale = defaultLocale): string {
  const d = parseISO(`${isoMonth.slice(0, 7)}-01`);
  const { dates } = getDictionary(locale);
  return dates.monthYear(dates.months[d.getUTCMonth()], d.getUTCFullYear());
}

export function formatDateShort(iso: string): string {
  if (!isValidISODate(iso)) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
