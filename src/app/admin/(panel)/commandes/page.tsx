import type { Metadata } from "next";
import Link from "next/link";
import { OrderList } from "@/components/admin/OrderList";
import { PageTitle } from "@/components/admin/ui";
import { orderStatuses } from "@/lib/order-status";
import { getOrderRepository } from "@/server/orders/repository";

export const metadata: Metadata = { title: "Commandes" };

const tris = [
  { id: "recu", label: "Plus récentes" },
  { id: "retrait", label: "Date de retrait" },
];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ statut?: string; tri?: string }> }) {
  const { statut, tri = "recu" } = await searchParams;
  const all = await getOrderRepository().list();
  let orders = statut ? all.filter((o) => o.status === statut) : all;
  if (tri === "retrait") orders = [...orders].sort((a, b) => a.customer.pickupDate.localeCompare(b.customer.pickupDate));

  const href = (params: { statut?: string; tri?: string }) => {
    const q = new URLSearchParams();
    const s = "statut" in params ? params.statut : statut;
    const t = params.tri ?? tri;
    if (s) q.set("statut", s);
    if (t !== "recu") q.set("tri", t);
    const qs = q.toString();
    return `/admin/commandes${qs ? `?${qs}` : ""}`;
  };
  const pill =
    "flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-chocolate/15 px-4 text-sm transition aria-[current=true]:border-chocolate aria-[current=true]:bg-chocolate aria-[current=true]:text-cream";

  return (
    <>
      <PageTitle title="Commandes" intro="Toutes les demandes reçues via le configurateur. Le prix se renseigne dans chaque commande." />

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <Link href={href({ statut: undefined })} aria-current={!statut} className={pill}>
          Toutes <span className="text-xs opacity-60">{all.length}</span>
        </Link>
        {orderStatuses.map((s) => (
          <Link key={s.id} href={href({ statut: s.id })} aria-current={statut === s.id} className={pill}>
            {s.label} <span className="text-xs opacity-60">{all.filter((o) => o.status === s.id).length}</span>
          </Link>
        ))}
      </div>
      <div className="mb-6 flex items-center gap-2 text-sm text-cocoa">
        Trier :
        {tris.map((t) => (
          <Link
            key={t.id}
            href={href({ tri: t.id })}
            aria-current={tri === t.id}
            className="rounded-full px-3 py-1.5 aria-[current=true]:bg-paper aria-[current=true]:font-semibold aria-[current=true]:text-chocolate"
          >
            {t.label}
          </Link>
        ))}
      </div>

      <OrderList orders={orders} empty={statut ? "Aucune commande avec ce statut." : "Aucune commande pour le moment."} />
    </>
  );
}
