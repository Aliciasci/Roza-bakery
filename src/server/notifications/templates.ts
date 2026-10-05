import "server-only";
import { formatDateLong } from "@/lib/dates";
import type { Order, SiteInfo } from "@/lib/types";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function compositionRows(order: Order) {
  return order.composition
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

function layout(title: string, intro: string, body: string) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#fbf7f1;padding:32px 16px">
  <div style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:24px;padding:36px 28px;border:1px solid #efe4d6">
    <p style="margin:0;font:italic 28px Georgia,serif;color:#3a2520">Roza <span style="font:600 9px Arial,sans-serif;letter-spacing:.4em;text-transform:uppercase">Bakery</span></p>
    <h1 style="margin:28px 0 8px;font:400 28px/1.2 Georgia,serif;color:#3a2520">${title}</h1>
    <p style="margin:0 0 24px;font:15px/1.6 Arial,sans-serif;color:#6a4f45">${intro}</p>
    ${body}
  </div></body></html>`;
}

function pickupBlock(order: Order, site: SiteInfo) {
  const slot = site.pickupSlots.find((s) => s.id === order.customer.pickupSlot)?.label ?? order.customer.pickupSlot;
  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin-top:16px">
    <tr><td style="padding:8px 0;font:600 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6a4f45;width:130px">Retrait</td>
        <td style="font:17px Georgia,serif;color:#3a2520">${esc(formatDateLong(order.customer.pickupDate))} · ${esc(slot)}</td></tr>
    <tr><td style="padding:8px 0;font:600 11px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6a4f45">Personnes</td>
        <td style="font:17px Georgia,serif;color:#3a2520">${esc(order.customer.servings)}</td></tr>
  </table>`;
}

export function customerEmail(order: Order, site: SiteInfo) {
  const subject = `Votre demande de gâteau est bien reçue ♡ (${order.reference})`;
  const html = layout(
    "Votre demande est bien partie ♡",
    `Bonjour ${esc(order.customer.firstName)}, merci pour votre confiance. Roza Bakery va étudier votre création et revenir vers vous afin de confirmer sa disponibilité et son prix.`,
    `<table role="presentation" style="width:100%;border-collapse:collapse">${compositionRows(order)}</table>
     ${pickupBlock(order, site)}
     <p style="margin:24px 0 0;padding:16px;border-radius:14px;background:#f5e6e1;font:14px/1.6 Arial,sans-serif;color:#3a2520">
       Le prix de votre création sera confirmé par Roza Bakery après étude de votre demande. Retrait uniquement sur place.
     </p>
     <p style="margin:20px 0 0;font:12px Arial,sans-serif;color:#8c7268">Référence : ${esc(order.reference)}</p>`,
  );
  const text = [
    `Bonjour ${order.customer.firstName},`,
    "Votre demande est bien partie. Roza Bakery va étudier votre création et revenir vers vous afin de confirmer sa disponibilité et son prix.",
    "",
    ...order.composition.filter((s) => s.items.length).map((s) => `${s.label} : ${s.items.join(", ")}`),
    `Retrait : ${formatDateLong(order.customer.pickupDate)}`,
    `Référence : ${order.reference}`,
  ].join("\n");
  return { subject, html, text };
}

export function bakeryEmail(order: Order, site: SiteInfo) {
  const c = order.customer;
  const subject = `Nouvelle demande · ${c.firstName} ${c.lastName} · retrait ${formatDateLong(c.pickupDate)}`;
  const html = layout(
    "Nouvelle demande de gâteau",
    `Référence <strong>${esc(order.reference)}</strong> · reçue le ${esc(new Date(order.createdAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }))}`,
    `<table role="presentation" style="width:100%;border-collapse:collapse">${compositionRows(order)}</table>
     ${pickupBlock(order, site)}
     <h2 style="margin:28px 0 8px;font:400 22px Georgia,serif;color:#3a2520">Cliente / client</h2>
     <p style="margin:0;font:15px/1.7 Arial,sans-serif;color:#3a2520">
       ${esc(c.firstName)} ${esc(c.lastName)}<br>
       <a href="mailto:${esc(c.email)}" style="color:#9e2f45">${esc(c.email)}</a><br>
       <a href="tel:${esc(c.phone)}" style="color:#9e2f45">${esc(c.phone)}</a>
     </p>
     ${c.message ? `<p style="margin:16px 0 0;padding:14px;border-radius:12px;background:#f4ede3;font:14px/1.6 Arial,sans-serif;color:#3a2520;white-space:pre-wrap">${esc(c.message)}</p>` : ""}
     <p style="margin:16px 0 0;font:13px Arial,sans-serif;color:#6a4f45">${order.inspirationFiles.length} photo(s) d'inspiration en pièce jointe.</p>`,
  );
  const text = [
    `Nouvelle demande ${order.reference}`,
    `${c.firstName} ${c.lastName} — ${c.email} — ${c.phone}`,
    `Retrait : ${formatDateLong(c.pickupDate)} (${c.pickupSlot}) — ${c.servings} personnes`,
    "",
    ...order.composition.filter((s) => s.items.length || s.notes).map((s) => `${s.label} : ${s.items.join(", ")}${s.notes ? ` (${s.notes})` : ""}`),
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
