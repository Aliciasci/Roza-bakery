import Link from "next/link";
import { daysBetween, formatDateLong, todayISO } from "@/lib/dates";
import { formatPrice } from "@/lib/helwa";
import { statusInfo } from "@/lib/order-status";
import type { Order } from "@/lib/types";

export function StatusBadge({ status }: { status: Order["status"] }) {
  const info = statusInfo(status);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${info.className}`}>{info.label}</span>;
}

export function relativePickup(iso: string) {
  const d = daysBetween(todayISO(), iso);
  if (d === 0) return "aujourd'hui";
  if (d === 1) return "demain";
  if (d < 0) return `il y a ${-d} j`;
  return `dans ${d} j`;
}

export function OrderList({ orders, empty = "Aucune commande." }: { orders: Order[]; empty?: string }) {
  if (!orders.length) return <p className="rounded-2xl bg-paper p-8 text-center text-sm text-cocoa ring-1 ring-chocolate/8">{empty}</p>;
  return (
    <ul className="divide-y divide-chocolate/8 overflow-hidden rounded-2xl bg-paper ring-1 ring-chocolate/8">
      {orders.map((o) => (
        <li key={o.id}>
          <Link
            href={`/admin/commandes/${o.id}`}
            className="grid gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-ivory/60 sm:grid-cols-[1fr_auto] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_7rem_7rem]"
          >
            <div className="min-w-0">
              <p className="truncate font-serif text-xl leading-tight">
                {o.customer.firstName} {o.customer.lastName}
              </p>
              <p className="truncate text-xs text-cocoa">
                {o.reference} ·{" "}
                {o.kind === "helwa" ? (
                  <span className="font-semibold text-chocolate">Helwa · {formatPrice(o.helwa?.total ?? 0)}</span>
                ) : (
                  (o.composition.find((s) => s.stepId === "base")?.items.join(", ") ?? "—")
                )}
              </p>
            </div>
            <div className="text-sm md:self-center">
              <span className="first-letter:uppercase">{formatDateLong(o.customer.pickupDate)}</span>
              <span className="block text-xs text-cocoa">Retrait {relativePickup(o.customer.pickupDate)}</span>
            </div>
            <p className="text-sm text-cocoa md:self-center">
              {o.kind === "helwa" ? `${o.helwa?.lines.reduce((n, l) => n + l.quantity, 0) ?? 0} pièces` : `${o.customer.servings} pers.`}
            </p>
            <div className="md:self-center md:text-right">
              <StatusBadge status={o.status} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
