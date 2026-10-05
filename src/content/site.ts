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

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
