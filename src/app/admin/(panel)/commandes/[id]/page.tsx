import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderEditor } from "@/components/admin/OrderEditor";
import { StatusBadge, relativePickup } from "@/components/admin/OrderList";
import { Card } from "@/components/admin/ui";
import { localeNames } from "@/i18n/config";
import { formatDateLong } from "@/lib/dates";
import { formatPrice } from "@/lib/helwa";
import { getContent } from "@/server/content/store";
import { getOrderRepository } from "@/server/orders/repository";

export const metadata: Metadata = { title: "Commande" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderRepository().get(id);
  if (!order) notFound();
  const { site } = await getContent();
  const c = order.customer;
  const slot = site.pickupSlots.find((s) => s.id === c.pickupSlot)?.label ?? c.pickupSlot;
  const received = new Date(order.createdAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "long", timeStyle: "short" });

  const row = "grid grid-cols-[8rem_1fr] gap-3 border-b border-dashed border-chocolate/12 py-3 last:border-0";
  const dt = "text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-cocoa";

  return (
    <>
      <Link href="/admin/commandes" className="text-sm text-cocoa hover:text-chocolate">
        ← Toutes les commandes
      </Link>
      <div className="mb-8 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cocoa">{order.reference}</p>
          <h1 className="mt-1 font-serif text-4xl md:text-5xl">
            {c.firstName} {c.lastName}
          </h1>
          <p className="mt-2 text-sm text-cocoa">
            Reçue le {received}
            {order.locale && order.locale !== "fr" && (
              <span className="ml-2 rounded-full bg-sage-soft px-2.5 py-0.5 text-xs font-semibold text-chocolate">
                Commande en {localeNames[order.locale].name}
              </span>
            )}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {order.kind === "helwa" ? (
            <Card>
              <h2 className="font-serif text-2xl">Helwa · à la pièce</h2>
              <ul className="mt-3">
                {order.helwa?.lines.map((l) => (
                  <li key={l.itemId} className="flex items-baseline justify-between gap-4 border-b border-dashed border-chocolate/12 py-3">
                    <span>
                      <span className="font-serif text-lg">{l.name}</span>
                      <span className="block text-xs text-cocoa">
                        {l.quantity} × {formatPrice(l.unitPrice)}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold lining-nums tabular-nums">{formatPrice(l.total)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-baseline justify-between">
                <span className={dt}>Total · {order.helwa?.lines.reduce((n, l) => n + l.quantity, 0)} pièces</span>
                <span className="font-serif text-3xl lining-nums">{formatPrice(order.helwa?.total ?? 0)}</span>
              </p>
              {c.message && (
                <div className="mt-4 rounded-xl bg-ivory p-4 text-sm leading-relaxed whitespace-pre-wrap">{c.message}</div>
              )}
            </Card>
          ) : (
            <Card>
              <h2 className="font-serif text-2xl">Le gâteau</h2>
              <dl className="mt-3">
                {order.composition
                  .filter((s) => s.items.length || s.notes)
                  .map((s) => (
                    <div key={s.stepId} className={row}>
                      <dt className={dt}>{s.label}</dt>
                      <dd>
                        <span className="font-serif text-lg">{s.items.join(", ") || "—"}</span>
                        {s.notes && <span className="mt-1 block text-sm italic text-cocoa">« {s.notes} »</span>}
                      </dd>
                    </div>
                  ))}
              </dl>
              {c.message && (
                <div className="mt-4 rounded-xl bg-ivory p-4 text-sm leading-relaxed whitespace-pre-wrap">{c.message}</div>
              )}
            </Card>
          )}

          {order.inspirationFiles.length > 0 && (
            <Card>
              <h2 className="font-serif text-2xl">Photos d&apos;inspiration</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {order.inspirationFiles.map((f) => {
                  const name = f.storedAs?.split("/").pop();
                  if (!name) return null;
                  const url = `/api/admin/fichiers/${order.id}/${name}`;
                  return (
                    <li key={name}>
                      <a href={url} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl bg-ivory">
                        {/* eslint-disable-next-line @next/next/no-img-element -- fichier privé */}
                        <img src={url} alt={f.name} className="aspect-square w-full object-cover transition-transform hover:scale-105" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-serif text-2xl">Retrait</h2>
            <dl className="mt-3">
              <div className={row}>
                <dt className={dt}>Date</dt>
                <dd>
                  <span className="first-letter:uppercase">{formatDateLong(c.pickupDate)}</span>
                  <span className="block text-xs text-cocoa">{relativePickup(c.pickupDate)}</span>
                </dd>
              </div>
              <div className={row}>
                <dt className={dt}>Créneau</dt>
                <dd>{slot}</dd>
              </div>
              {order.kind !== "helwa" && (
                <div className={row}>
                  <dt className={dt}>Personnes</dt>
                  <dd>{c.servings}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <h2 className="font-serif text-2xl">Contact</h2>
            <div className="mt-4 flex flex-col gap-2">
              {c.email && (
              <a
                href={`mailto:${c.email}?subject=${encodeURIComponent(`${order.kind === "helwa" ? "Votre commande Helwa" : "Votre gâteau"} Roza Bakery (${order.reference})`)}`}
                className="flex min-h-11 items-center justify-between rounded-xl bg-ivory px-4 text-sm hover:bg-sand"
              >
                <span className="truncate">{c.email}</span> <span aria-hidden>✉</span>
              </a>
              )}
              <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="flex min-h-11 items-center justify-between rounded-xl bg-ivory px-4 text-sm hover:bg-sand">
                {c.phone} <span aria-hidden>☎</span>
              </a>
            </div>
          </Card>

          <OrderEditor order={order} />
        </div>
      </div>
    </>
  );
}
