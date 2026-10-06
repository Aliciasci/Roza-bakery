"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { LogoMark } from "@/components/layout/Logo";

const nav = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/configurateur", label: "Configurateur" },
  { href: "/admin/helwa", label: "Helwa" },
  { href: "/admin/photos", label: "Photos du site" },
  { href: "/admin/creations", label: "Créations" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/infos", label: "Infos & retrait" },
];

export function AdminShell({ children, newOrders }: { children: ReactNode; newOrders: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const links = nav.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={active(item.href) ? "page" : undefined}
      className="flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 text-sm font-medium text-chocolate/75 transition-colors hover:bg-paper hover:text-chocolate aria-[current=page]:bg-chocolate aria-[current=page]:text-cream"
    >
      {item.label}
      {item.href === "/admin/commandes" && newOrders > 0 && (
        <span className="rounded-full bg-berry px-2 py-0.5 text-[0.6875rem] font-semibold text-white">{newOrders}</span>
      )}
    </Link>
  ));

  return (
    <div className="lg:pl-64">
      {/* Barre latérale desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-chocolate/8 bg-cream p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2 pb-8 pt-1 leading-none">
          <LogoMark size={52} className="h-[52px] w-[52px]" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-cocoa">Administration</span>
        </Link>
        <nav aria-label="Administration" className="flex flex-col gap-1">
          {links}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-chocolate/10 pt-4 text-sm">
          <a href="/" target="_blank" rel="noopener" className="rounded-xl px-3.5 py-2.5 text-cocoa hover:bg-paper hover:text-chocolate">
            Voir le site ↗
          </a>
          <form action={logout}>
            <button type="submit" className="w-full rounded-xl px-3.5 py-2.5 text-left text-cocoa hover:bg-paper hover:text-chocolate">
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* En-tête mobile */}
      <header className="sticky top-0 z-30 border-b border-chocolate/8 bg-cream/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark size={40} className="h-10 w-10" />
            <span className="font-sans text-[0.6rem] font-semibold not-italic uppercase tracking-[0.3em] text-cocoa">Admin</span>
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <a href="/" target="_blank" rel="noopener" className="rounded-full px-3 py-2 text-cocoa">
              Site ↗
            </a>
            <form action={logout}>
              <button type="submit" className="rounded-full px-3 py-2 text-cocoa">
                Quitter
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Administration" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {links}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 md:px-8 md:pt-10">{children}</main>
    </div>
  );
}
