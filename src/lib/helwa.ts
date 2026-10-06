/**
 * Helwa (gâteaux à la pièce) : calcul du panier, partagé entre le navigateur et le serveur.
 * Le serveur recalcule toujours les prix à partir du catalogue — le total envoyé par le navigateur n'est jamais utilisé.
 */
import type { HelwaCart, HelwaCategory, HelwaItem, HelwaLine } from "./types";

/** Quantité maximale d'une même pièce dans une commande. */
export const HELWA_MAX_QUANTITY = 500;

export const minQuantity = (item: Pick<HelwaItem, "minQuantity">) => Math.max(1, item.minQuantity ?? 1);

/** Arrondi au centime (évite 0.1 + 0.2 = 0.30000000000000004). */
const cents = (n: number) => Math.round(n * 100) / 100;

const priceFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** Prix en dinars algériens : « 1 250 DA » (espace insécable avant « DA »). */
export function formatPrice(value: number) {
  return `${priceFormat.format(value)} DA`;
}

/** Quantité suivante / précédente : on saute directement de 0 au minimum (et inversement). */
export function stepQuantity(item: HelwaItem, current: number, delta: 1 | -1) {
  const min = minQuantity(item);
  if (delta > 0) return Math.min(HELWA_MAX_QUANTITY, current < min ? min : current + 1);
  return current <= min ? 0 : current - 1;
}

/** Lignes du panier (pièces connues avec une quantité > 0), dans l'ordre du catalogue. */
export function cartLines(categories: HelwaCategory[], cart: HelwaCart): HelwaLine[] {
  return categories
    .flatMap((c) => c.items)
    .filter((item) => (cart[item.id] ?? 0) > 0)
    .map((item) => {
      const quantity = cart[item.id];
      return { itemId: item.id, name: item.name, unitPrice: item.price, quantity, total: cents(item.price * quantity) };
    });
}

export function cartTotal(lines: HelwaLine[]) {
  return cents(lines.reduce((sum, l) => sum + l.total, 0));
}

export const cartPieces = (lines: HelwaLine[]) => lines.reduce((n, l) => n + l.quantity, 0);

export type HelwaCartError =
  | { code: "empty" }
  | { code: "unknown" }
  | { code: "invalid"; name: string }
  | { code: "min"; name: string; min: number };

/** Vérifie le panier : pièces existantes et disponibles, quantités entières entre le minimum et le maximum. */
export function validateCart(categories: HelwaCategory[], cart: HelwaCart): HelwaCartError | null {
  const items = new Map(categories.flatMap((c) => c.items).map((i) => [i.id, i]));
  const chosen = Object.entries(cart).filter(([, q]) => q !== 0);
  if (!chosen.length) return { code: "empty" };
  for (const [id, quantity] of chosen) {
    const item = items.get(id);
    if (!item || item.available === false) return { code: "unknown" };
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > HELWA_MAX_QUANTITY) return { code: "invalid", name: item.name };
    if (quantity < minQuantity(item)) return { code: "min", name: item.name, min: minQuantity(item) };
  }
  return null;
}
