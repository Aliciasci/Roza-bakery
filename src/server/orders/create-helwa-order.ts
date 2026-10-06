import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getDictionary } from "@/i18n/dictionaries";
import { getHelwa, getSiteInfo } from "@/lib/data";
import { HELWA_MAX_QUANTITY, cartLines, cartTotal, validateCart } from "@/lib/helwa";
import { LIMITS, validateCustomer } from "@/lib/validation";
import type { Order } from "@/lib/types";
import { bakeryInbox, getMailer } from "@/server/notifications";
import { helwaBakeryEmail, helwaCustomerEmail } from "@/server/notifications/templates";
import { OrderValidationError, makeReference } from "./create-order";
import { getOrderRepository } from "./repository";

/** Forme attendue du JSON envoyé par la page Helwa (les règles métier sont vérifiées ensuite). */
export const helwaPayloadSchema = z.object({
  cart: z.record(z.string().max(80), z.number().int().min(0).max(HELWA_MAX_QUANTITY)).refine((c) => Object.keys(c).length <= 200),
  locale: z.enum(["fr", "kab"]).default("fr"),
  customer: z.object({
    firstName: z.string().trim().max(LIMITS.name),
    lastName: z.string().trim().max(LIMITS.name),
    email: z.string().trim().max(LIMITS.email),
    phone: z.string().trim().max(LIMITS.phone),
    pickupDate: z.string().max(10),
    pickupSlot: z.string().max(40),
    message: z.string().max(LIMITS.message).default(""),
  }),
});

export type HelwaPayload = z.infer<typeof helwaPayloadSchema>;

/**
 * Crée une commande Helwa. Les prix sont recalculés à partir du catalogue :
 * le total affiché à la cliente est celui enregistré, jamais une valeur envoyée par le navigateur.
 */
export async function createHelwaOrder(payload: HelwaPayload): Promise<Order> {
  const locale = payload.locale;
  const t = getDictionary(locale);
  const [catalog, site] = await Promise.all([getHelwa(), getSiteInfo()]);

  const cartError = validateCart(catalog, payload.cart);
  if (cartError) {
    const v = t.validation;
    const message =
      cartError.code === "empty" ? v.helwaEmpty
      : cartError.code === "unknown" ? v.helwaUnknown
      : cartError.code === "min" ? v.helwaMin(cartError.name, cartError.min)
      : v.helwaInvalid(cartError.name);
    throw new OrderValidationError(message);
  }

  const customer = { ...payload.customer, servings: "" };
  const firstError = Object.values(validateCustomer(customer, site, undefined, t.validation, false))[0];
  if (firstError) throw new OrderValidationError(firstError);

  const lines = cartLines(catalog, payload.cart);
  const order: Order = {
    id: randomUUID(),
    reference: makeReference(),
    createdAt: new Date().toISOString(),
    status: "nouvelle",
    kind: "helwa",
    helwa: { lines, total: cartTotal(lines) },
    composition: [],
    raw: { selections: {}, customValues: {}, notes: {} },
    customer,
    locale,
    inspirationFiles: [],
    confirmedPrice: null,
  };

  const mailer = getMailer();
  let stored = false;
  try {
    await getOrderRepository().save(order, []);
    stored = true;
  } catch (err) {
    console.error("[helwa] enregistrement impossible :", err);
  }

  let bakeryNotified = false;
  const inbox = bakeryInbox();
  if (inbox || !mailer.configured) {
    try {
      await mailer.send({ to: inbox ?? "roza-bakery@localhost", replyTo: customer.email || undefined, ...helwaBakeryEmail(order, site) });
      bakeryNotified = mailer.configured;
    } catch (err) {
      console.error("[helwa] notification Roza Bakery impossible :", err);
    }
  }

  // La commande ne doit jamais être perdue silencieusement
  if (!stored && !bakeryNotified) throw new Error("La commande n'a pu être ni enregistrée ni transmise.");

  // Accusé de réception dans la langue de la cliente (noms des pièces traduits, non bloquant)
  if (customer.email) {
    try {
      const [localCatalog, localSite] =
        locale === "fr" ? [catalog, site] : await Promise.all([getHelwa(locale), getSiteInfo(locale)]);
      const localLines = cartLines(localCatalog, payload.cart);
      await mailer.send({ to: customer.email, ...helwaCustomerEmail(order, localSite, localLines, locale) });
    } catch (err) {
      console.error("[helwa] email client impossible :", err);
    }
  }

  return order;
}
