import type { HelwaCategory } from "@/lib/types";

/**
 * Helwa — les gâteaux vendus à la pièce (cookies, gâteaux orientaux…).
 *
 * ⚠️ PRIX D'EXEMPLE (en dinars algériens, DA) — à ajuster par Roza Bakery depuis l'admin (« Helwa »).
 *
 * - Les `id` sont enregistrés dans les commandes : ne pas les renommer une fois le site en ligne.
 * - `minQuantity` : quantité minimale par pièce (ex. 6 cookies). Sans valeur, on peut en prendre une seule.
 */
export const helwaCategories: HelwaCategory[] = [
  {
    id: "cookies",
    label: "Cookies",
    description: "Croustillants sur les bords, fondants à cœur.",
    kab: { label: "Kukiz" },
    items: [
      { id: "cookie-chocolat", name: "Cookie pépites de chocolat", description: "Le classique, généreux en chocolat.", price: 150, minQuantity: 4, tone: "chocolate" },
      { id: "cookie-pistache", name: "Cookie pistache", description: "Cœur coulant à la pâte de pistache.", price: 200, minQuantity: 4, tone: "pistachio" },
      { id: "cookie-red-velvet", name: "Cookie red velvet", description: "Moelleux, pépites de chocolat blanc.", price: 200, minQuantity: 4, tone: "raspberry" },
      { id: "cookie-bueno", name: "Cookie Bueno", description: "Fourré noisette, éclats de Bueno.", price: 250, minQuantity: 4, tone: "praline" },
    ],
  },
  {
    id: "orientaux",
    label: "Gâteaux orientaux",
    description: "Les douceurs de chez nous, préparées à la main comme pour les grandes occasions.",
    kab: { label: "Tiḥlawin n tmurt" },
    items: [
      { id: "baklawa", name: "Baklawa", description: "Feuilletée, amandes et miel.", price: 120, minQuantity: 10, tone: "golden" },
      { id: "makrout", name: "Makrout", description: "Semoule et pâte de dattes, trempé au miel.", price: 60, minQuantity: 10, tone: "caramel" },
      { id: "dziriette", name: "Dziriette", description: "Petite corolle amande, glaçage au miel.", price: 100, minQuantity: 10, tone: "almond" },
      { id: "mchewek", name: "Mchewek", description: "Amandes effilées, moelleux à cœur.", price: 80, minQuantity: 10, tone: "sponge" },
      { id: "griwech", name: "Griwech", description: "Tressé, frit et enrobé de miel.", price: 50, minQuantity: 10, tone: "custard" },
      { id: "tcharek", name: "Tcharek el ariane", description: "Croissant aux amandes et fleur d'oranger.", price: 80, minQuantity: 10, tone: "cream" },
    ],
  },
];
