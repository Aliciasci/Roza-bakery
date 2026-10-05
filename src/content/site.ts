import type { SiteInfo } from "@/lib/types";

/**
 * Informations de la boutique.
 *
 * ⚠️ PLACEHOLDERS — Toutes les valeurs `null` sont des informations réelles
 * qui n'ont pas encore été fournies. Elles s'affichent sur le site comme
 * « [À compléter] » jusqu'à ce qu'elles soient renseignées ici.
 */
export const site: SiteInfo = {
  name: "Roza Bakery",
  shortDescription:
    "Pâtisserie artisanale et gâteaux personnalisés, réalisés sur mesure et à retirer sur place.",

  city: null, // ex. "Lyon" — utile pour le référencement local
  address: null, // ex. "12 rue des Lilas, 69000 Lyon"
  email: null, // ex. "bonjour@rozabakery.fr"
  phone: null, // ex. "06 00 00 00 00"
  instagramHandle: null, // ex. "@rozabakery"
  instagramUrl: null, // ex. "https://www.instagram.com/rozabakery"
  openingHours: null, // ex. ["Mardi – Samedi : 10h – 18h"]

  minLeadDays: 3,
  recommendedLeadDays: 4,

  // PLACEHOLDER — jours de fermeture à confirmer (0 = dimanche, 1 = lundi…)
  closedWeekdays: [],
  // Dates ponctuelles indisponibles, format YYYY-MM-DD
  unavailableDates: [],

  // PLACEHOLDER — créneaux de retrait à confirmer (horaires précis à ajouter dans `hint`)
  pickupSlots: [
    { id: "matin", label: "Matin" },
    { id: "midi", label: "Midi" },
    { id: "apres-midi", label: "Après-midi" },
    { id: "fin-de-journee", label: "Fin de journée" },
  ],

  maxInspirationPhotos: 5,
};

/**
 * URL publique du site (SEO, sitemap, Open Graph).
 * Tolère une valeur sans protocole (« mon-site.up.railway.app » → https://…) et
 * retombe sur localhost si la valeur est invalide, pour ne jamais bloquer le build.
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    console.warn(`[site] NEXT_PUBLIC_SITE_URL invalide : « ${value} » — valeur ignorée.`);
    return "http://localhost:3000";
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
