import "server-only";
import { formatDateLong } from "@/lib/dates";
import { formatPrice } from "@/lib/helwa";
import { localeNames, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { HelwaLine, Order, ResolvedStep, SiteInfo } from "@/lib/types";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function compositionRows(composition: ResolvedStep[]) {
  return composition
    .filter((s) => s.items.length || s.notes)
    .map(
      (s) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px dashed #e4d6c6;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6a4f45;width:130px;vertical-align:top">${esc(s.label)}</td>
        <td style="padding:10px 0;border-bottom:1px dashed #e4d6c6;font:17px/1.4 Georgia,serif;color:#3a2520">
          ${esc(s.items.join(", ") || "—")}
          ${s.notes ? `<div style="font:italic 14px/1.5 Georgia,serif;color:#6a4f45;margin-top:4px">« ${esc(s.notes)} »</div>` : ""}
        </td>
      </tr>`,
    )
    .join("");
}

function layout(title: string, intro: string, body: string, lang = "fr") {
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#fbf7f1;padding:32px 16px">
  <div style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:24px;padding:36px 28px;border:1px solid #efe4d6">
    <p style="margin:0;font:italic 28px Georgia,serif;color:#3a2520">Roza <span style="font:600 9px Arial,sans-serif;letter-spacing:.4em;text-transform:uppercase">Bakery</span></p>
    <h1 style="margin:28px 0 8px;font:400 28px/1.2 Georgia,serif;color:#3a2520">${title}</h1>
    <p style="margin:0 0 24px;font:15px/1.6 Arial,sans-serif;color:#6a4f45">${intro}</p>
    ${body}
  </div></body></html>`;
}

function pickupBlock(order: Order, site: SiteInfo, locale: Locale = "fr") {
  const t = getDictionary(locale).email;
  const slot = site.pickupSlots.find((s) => s.id === order.customer.pickupSlot)?.label ?? order.customer.pickupSlot;
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin-top:16px">
    <tr><td style="padding:8px 0;font:600 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6a4f45;width:130px">${esc(t.pickup)}</td>
        <td style="font:17px Georgia,serif;color:#3a2520">${esc(formatDateLong(order.customer.pickupDate, locale))} · ${esc(slot)}</td></tr>
    ${order.kind === "helwa" ? "" : `<tr><td style="padding:8px 0;font:600 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6a4f45">${esc(t.servings)}</td>
        <td style="font:17px Georgia,serif;color:#3a2520">${esc(order.customer.servings)}</td></tr>`}
  </table>`;
}

/**
 * Accusé de réception envoyé à la cliente, dans sa langue.
 * `composition` et `site` doivent être résolus dans cette même langue.
 */
export function customerEmail(order: Order, site: SiteInfo, composition: ResolvedStep[], locale: Locale = "fr") {
  const t = getDictionary(locale).email;
  const lang = localeNames[locale].htmlLang;
  const subject = t.customerSubject(order.reference);
  const html = layout(
    esc(t.customerTitle),
    esc(t.customerIntro(order.customer.firstName)),
    `<table role="presentation" style="width:100%;border-collapse:collapse">${compositionRows(composition)}</table>
     ${pickupBlock(order, site, locale)}
     <p style="margin:24px 0 0;padding:16px;border-radius:14px;background:#f5e6e1;font:14px/1.6 Arial,sans-serif;color:#3a2520">
       ${esc(t.priceNote)}
     </p>
     <p style="margin:20px 0 0;font:12px Arial,sans-serif;color:#8c7268">${esc(t.reference)} : ${esc(order.reference)}</p>`,
    lang,
  );
  const text = [
    t.hello(order.customer.firstName),
    t.textIntro,
    "",
    ...composition.filter((s) => s.items.length).map((s) => `${s.label} : ${s.items.join(", ")}`),
    `${t.pickup} : ${formatDateLong(order.customer.pickupDate, locale)}`,
    `${t.reference} : ${order.reference}`,
  ].join("\n");
  return { subject, html, text };
}

export function bakeryEmail(order: Order, site: SiteInfo) {
  const c = order.customer;
  const subject = `Nouvelle demande · ${c.firstName} ${c.lastName} · retrait ${formatDateLong(c.pickupDate)}`;
  const html = layout(
    "Nouvelle demande de gâteau",
    `Référence <strong>${esc(order.reference)}</strong> · reçue le ${esc(new Date(order.createdAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }))}`,
    `<table role="presentation" style="width:100%;border-collapse:collapse">${compositionRows(order.composition)}</table>
     ${pickupBlock(order, site)}
     <h2 style="margin:28px 0 8px;font:400 22px Georgia,serif;color:#3a2520">Cliente / client</h2>
     <p style="margin:0;font:15px/1.7 Arial,sans-serif;color:#3a2520">
       ${esc(c.firstName)} ${esc(c.lastName)}<br>
       ${c.email ? `<a href="mailto:${esc(c.email)}" style="color:#9e2f45">${esc(c.email)}</a><br>` : ""}
       <a href="tel:${esc(c.phone)}" style="color:#9e2f45">${esc(c.phone)}</a>
     </p>
     ${c.message ? `<p style="margin:16px 0 0;padding:14px;border-radius:12px;background:#f4ede3;font:14px/1.6 Arial,sans-serif;color:#3a2520;white-space:pre-wrap">${esc(c.message)}</p>` : ""}
     <p style="margin:16px 0 0;font:13px Arial,sans-serif;color:#6a4f45">${order.inspirationFiles.length} photo(s) d'inspiration en pièce jointe.</p>
     ${order.locale && order.locale !== "fr" ? `<p style="margin:8px 0 0;font:13px Arial,sans-serif;color:#6a4f45">Langue de la cliente : ${esc(localeNames[order.locale].name)} (accusé de réception envoyé dans cette langue).</p>` : ""}`,
  );
  const text = [
    `Nouvelle demande ${order.reference}`,
    [`${c.firstName} ${c.lastName}`, c.email, c.phone].filter(Boolean).join(" — "),
    `Retrait : ${formatDateLong(c.pickupDate)} (${c.pickupSlot}) — ${c.servings} personnes`,
    "",
    ...order.composition.filter((s) => s.items.length || s.notes).map((s) => `${s.label} : ${s.items.join(", ")}${s.notes ? ` (${s.notes})` : ""}`),
    "",
    c.message,
  ].join("\n");
  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/* Helwa (gâteaux à la pièce)                                                  */
/* -------------------------------------------------------------------------- */

function helwaRows(lines: HelwaLine[], total: number, totalLabel: string) {
  const cell = "padding:10px 0;border-bottom:1px dashed #e4d6c6;color:#3a2520";
  return `<table role="presentation" style="width:100%;border-collapse:collapse">
    ${lines
      .map(
        (l) => `<tr>
        <td style="${cell};font:17px/1.4 Georgia,serif">${esc(l.name)}
          <div style="font:13px Arial,sans-serif;color:#6a4f45">${l.quantity} × ${esc(formatPrice(l.unitPrice))}</div></td>
        <td style="${cell};font:15px Arial,sans-serif;text-align:right;white-space:nowrap;vertical-align:top">${esc(formatPrice(l.total))}</td>
      </tr>`,
      )
      .join("")}
    <tr>
      <td style="padding:14px 0 0;font:600 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6a4f45">${esc(totalLabel)}</td>
      <td style="padding:14px 0 0;font:24px Georgia,serif;color:#3a2520;text-align:right;white-space:nowrap">${esc(formatPrice(total))}</td>
    </tr>
  </table>`;
}

/** Accusé de réception d'une commande Helwa, dans la langue de la cliente (`lines` et `site` déjà traduits). */
export function helwaCustomerEmail(order: Order, site: SiteInfo, lines: HelwaLine[], locale: Locale = "fr") {
  const t = getDictionary(locale).email;
  const total = order.helwa?.total ?? 0;
  const html = layout(
    esc(t.helwaTitle),
    esc(t.helwaIntro(order.customer.firstName)),
    `${helwaRows(lines, total, t.total)}
     ${pickupBlock(order, site, locale)}
     <p style="margin:24px 0 0;padding:16px;border-radius:14px;background:#f5e6e1;font:14px/1.6 Arial,sans-serif;color:#3a2520">
       ${esc(t.payOnPickup)}
     </p>
     <p style="margin:20px 0 0;font:12px Arial,sans-serif;color:#8c7268">${esc(t.reference)} : ${esc(order.reference)}</p>`,
    localeNames[locale].htmlLang,
  );
  const text = [
    t.hello(order.customer.firstName),
    t.helwaTextIntro,
    "",
    ...lines.map((l) => `${l.quantity} × ${l.name} : ${formatPrice(l.total)}`),
    `${t.total} : ${formatPrice(total)}`,
    `${t.pickup} : ${formatDateLong(order.customer.pickupDate, locale)}`,
    `${t.reference} : ${order.reference}`,
  ].join("\n");
  return { subject: t.helwaSubject(order.reference), html, text };
}

export function helwaBakeryEmail(order: Order, site: SiteInfo) {
  const c = order.customer;
  const lines = order.helwa?.lines ?? [];
  const total = order.helwa?.total ?? 0;
  const subject = `Commande Helwa · ${c.firstName} ${c.lastName} · ${formatPrice(total)} · retrait ${formatDateLong(c.pickupDate)}`;
  const html = layout(
    "Nouvelle commande Helwa",
    `Référence <strong>${esc(order.reference)}</strong> · reçue le ${esc(new Date(order.createdAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }))}`,
    `${helwaRows(lines, total, "Total")}
     ${pickupBlock(order, site)}
     <h2 style="margin:28px 0 8px;font:400 22px Georgia,serif;color:#3a2520">Cliente / client</h2>
     <p style="margin:0;font:15px/1.7 Arial,sans-serif;color:#3a2520">
       ${esc(c.firstName)} ${esc(c.lastName)}<br>
       ${c.email ? `<a href="mailto:${esc(c.email)}" style="color:#9e2f45">${esc(c.email)}</a><br>` : ""}
       <a href="tel:${esc(c.phone)}" style="color:#9e2f45">${esc(c.phone)}</a>
     </p>
     ${c.message ? `<p style="margin:16px 0 0;padding:14px;border-radius:12px;background:#f4ede3;font:14px/1.6 Arial,sans-serif;color:#3a2520;white-space:pre-wrap">${esc(c.message)}</p>` : ""}
     ${order.locale && order.locale !== "fr" ? `<p style="margin:8px 0 0;font:13px Arial,sans-serif;color:#6a4f45">Langue de la cliente : ${esc(localeNames[order.locale].name)} (accusé de réception envoyé dans cette langue).</p>` : ""}`,
  );
  const text = [
    `Nouvelle commande Helwa ${order.reference}`,
    [`${c.firstName} ${c.lastName}`, c.email, c.phone].filter(Boolean).join(" — "),
    `Retrait : ${formatDateLong(c.pickupDate)} (${c.pickupSlot})`,
    "",
    ...lines.map((l) => `${l.quantity} × ${l.name} (${formatPrice(l.unitPrice)}) : ${formatPrice(l.total)}`),
    `Total : ${formatPrice(total)}`,
    "",
    c.message,
  ].join("\n");
  return { subject, html, text };
}

export function contactEmail(msg: { name: string; email: string; phone?: string; message: string }) {
  return {
    subject: `Message du site · ${msg.name}`,
    html: layout(
      "Nouveau message",
      `${esc(msg.name)} · <a href="mailto:${esc(msg.email)}" style="color:#9e2f45">${esc(msg.email)}</a>${msg.phone ? ` · ${esc(msg.phone)}` : ""}`,
      `<p style="font:15px/1.7 Arial,sans-serif;color:#3a2520;white-space:pre-wrap">${esc(msg.message)}</p>`,
    ),
    text: `${msg.name} <${msg.email}> ${msg.phone ?? ""}\n\n${msg.message}`,
  };
}
