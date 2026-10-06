import type { Metadata } from "next";
import Link from "next/link";
import { OrderList } from "@/components/admin/OrderList";
import { PageTitle } from "@/components/admin/ui";
import { addDays, todayISO } from "@/lib/dates";
import { orderStatuses } from "@/lib/order-status";
import { getContent } from "@/server/content/store";
import { getOrderRepository } from "@/server/orders/repository";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const [orders, content] = await Promise.all([getOrderRepository().list(), getContent()]);
  const today = todayISO();
  const in14 = addDays(today, 14);
  const active = ["nouvelle", "en-etude", "confirmee", "prete"];
  const upcoming = orders
    .filter((o) => active.includes(o.status) && o.customer.pickupDate >= today && o.customer.pickupDate <= in14)
    .sort((a, b) => a.customer.pickupDate.localeCompare(b.customer.pickupDate));
  const fresh = orders.filter((o) => o.status === "nouvelle");

  const optionCount = content.steps.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.options.length, 0), 0);
  const shortcuts = [
    { href: "/admin/configurateur", title: "Configurateur", text: `${optionCount} options — crèmes, inserts, fruits…` },
    { href: "/admin/creations", title: "Créations", text: `${content.creations.length} créations dans la galerie` },
    { href: "/admin/faq", title: "FAQ", text: `${content.faq.length} questions` },
    { href: "/admin/infos", title: "Infos & retrait", text: "Coordonnées, horaires, délais, créneaux, congés" },
  ];

  return (
    <>
      <PageTitle title="Bonjour ♡" intro="Voici ce qui vous attend." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {orderStatuses.slice(0, 4).map((s) => (
          <Link
            key={s.id}
            href={`/admin/commandes?statut=${s.id}`}
            className="rounded-2xl bg-paper p-5 ring-1 ring-chocolate/8 transition hover:ring-chocolate/25"
          >
            <p className="font-serif text-4xl lining-nums">{orders.filter((o) => o.status === s.id).length}</p>
            <p className="mt-1 text-sm text-cocoa">{s.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Nouvelles demandes</h2>
        <OrderList orders={fresh.slice(0, 5)} empty="Aucune nouvelle demande." />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Retraits des 14 prochains jours</h2>
        <OrderList orders={upcoming} empty="Aucun retrait prévu." />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">Personnaliser le site</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {shortcuts.map((s) => (
            <Link key={s.href} href={s.href} className="group rounded-2xl bg-paper p-5 ring-1 ring-chocolate/8 transition hover:ring-chocolate/25">
              <p className="flex items-center justify-between font-serif text-2xl">
                {s.title} <span className="text-base transition-transform group-hover:translate-x-1">→</span>
              </p>
              <p className="mt-1 text-sm text-cocoa">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
