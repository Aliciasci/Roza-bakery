import "server-only";
import { randomUUID } from "node:crypto";
import { getDictionary } from "@/i18n/dictionaries";
import { resolveComposition } from "@/lib/composition";
import { getCompositionSteps, getSiteInfo } from "@/lib/data";
import { validateComposition, validateCustomer } from "@/lib/validation";
import type { Order } from "@/lib/types";
import { bakeryInbox, getMailer } from "@/server/notifications";
import { bakeryEmail, customerEmail } from "@/server/notifications/templates";
import { getOrderRepository, type UploadedFile } from "./repository";
import type { OrderPayload } from "./schema";

export class OrderValidationError extends Error {}

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
  return `RZ-${ymd}-${rand}`;
}

/**
 * Crée une demande de commande : validation métier, enregistrement, notifications.
 * Aucun prix n'est calculé : `confirmedPrice` reste `null` jusqu'à la validation par Roza Bakery.
 */
export async function createOrder(payload: OrderPayload, files: UploadedFile[]): Promise<Order> {
  const locale = payload.locale;
  const t = getDictionary(locale);
  // Étapes et infos en français pour la commande enregistrée (lue par Roza Bakery)…
  const [steps, site] = await Promise.all([getCompositionSteps(), getSiteInfo()]);

  const compositionError = validateComposition(steps, payload, t.validation);
  if (compositionError) throw new OrderValidationError(compositionError);

  const customerErrors = validateCustomer(payload.customer, site, undefined, t.validation);
  const firstError = Object.values(customerErrors)[0];
  if (firstError) throw new OrderValidationError(firstError);

  if (files.length > site.maxInspirationPhotos) throw new OrderValidationError(t.photos.max(site.maxInspirationPhotos));

  const draft = {
    selections: payload.selections,
    customValues: payload.customValues,
    variants: payload.variants,
    notes: payload.notes,
  };
  const order: Order = {
    id: randomUUID(),
    reference: makeReference(),
    createdAt: new Date().toISOString(),
    status: "nouvelle",
    composition: resolveComposition(steps, draft),
    raw: draft,
    customer: payload.customer,
    locale,
    inspirationFiles: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    confirmedPrice: null,
  };

  const mailer = getMailer();
  let stored = false;
  try {
    await getOrderRepository().save(order, files);
    stored = true;
  } catch (err) {
    console.error("[commande] enregistrement impossible :", err);
  }

  // Notification à Roza Bakery (avec les photos en pièces jointes)
  let bakeryNotified = false;
  const inbox = bakeryInbox();
  if (inbox || !mailer.configured) {
    try {
      const mail = bakeryEmail(order, site);
      await mailer.send({
        to: inbox ?? "roza-bakery@localhost",
        replyTo: order.customer.email,
        ...mail,
        attachments: files.map((f) => ({ filename: f.name, content: f.data })),
      });
      bakeryNotified = mailer.configured;
    } catch (err) {
      console.error("[commande] notification Roza Bakery impossible :", err);
    }
  }

  // La demande ne doit jamais être perdue silencieusement
  if (!stored && !bakeryNotified) {
    throw new Error("La demande n'a pu être ni enregistrée ni transmise.");
  }

  // Accusé de réception à la cliente (non bloquant)
  try {
    // …et dans la langue de la cliente pour son accusé de réception
    const [localSteps, localSite] =
      locale === "fr" ? [steps, site] : await Promise.all([getCompositionSteps(locale), getSiteInfo(locale)]);
    const localComposition = resolveComposition(localSteps, draft);
    await mailer.send({ to: order.customer.email, ...customerEmail(order, localSite, localComposition, locale) });
  } catch (err) {
    console.error("[commande] email client impossible :", err);
  }

  return order;
}
