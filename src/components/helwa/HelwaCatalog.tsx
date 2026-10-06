"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CakeImage } from "@/components/ui/CakeImage";
import { MinusIcon, PlusIcon } from "@/components/ui/Icons";
import { useI18n } from "@/i18n/client";
import { HELWA_MAX_QUANTITY, formatPrice, minQuantity, stepQuantity } from "@/lib/helwa";
import type { HelwaItem } from "@/lib/types";
import { useHelwa } from "./HelwaProvider";
import { AnimatedPrice, HelwaSelection } from "./HelwaSelection";

/** Catalogue Helwa : une carte par pièce, avec le nombre de pièces et le total qui se met à jour en direct. */
export function HelwaCatalog() {
  const { categories, hydrated, lines, total, pieces } = useHelwa();
  const { t, href } = useI18n();
  const th = t.helwa;

  if (!categories.length) {
    return <p className="rounded-[2rem] bg-paper p-10 text-center text-cocoa ring-1 ring-chocolate/5">{th.empty}</p>;
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div className="space-y-16 lg:col-span-8 md:space-y-20">
          {categories.map((category) => (
            <section key={category.id} aria-labelledby={`helwa-${category.id}`}>
              <div className="mb-7 flex items-end gap-4">
                <h2 id={`helwa-${category.id}`} className="font-serif text-[2rem] leading-none md:text-[2.4rem]">
                  {category.label}
                </h2>
                <span aria-hidden className="rule mb-2 flex-1" />
              </div>
              {category.description && <p className="-mt-3 mb-7 max-w-xl text-cocoa">{category.description}</p>}
              <ul className="grid gap-4 sm:grid-cols-2 md:gap-5">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <HelwaCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="hidden lg:col-span-4 lg:block" aria-label={th.cartAria}>
          <div className="sticky top-28 rounded-[2rem] bg-paper p-7 shadow-[0_30px_60px_-40px_rgba(58,37,32,0.45)] ring-1 ring-chocolate/5">
            <h2 className="font-serif text-[1.9rem] leading-none">{th.selection}</h2>
            <HelwaSelection lines={hydrated ? lines : []} total={total} className="mt-5" />
            <ButtonLink
              href={href("/helwa/commande")}
              size="lg"
              arrow
              aria-disabled={!lines.length}
              className={`mt-7 w-full ${lines.length ? "" : "pointer-events-none opacity-45"}`}
            >
              {th.order}
            </ButtonLink>
          </div>
        </aside>
      </div>

      {/* Barre panier mobile */}
      {hydrated && lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 animate-sheet-in border-t border-chocolate/10 bg-cream/95 pb-safe backdrop-blur-md lg:hidden">
          <div className="container-page flex items-center gap-4 py-3">
            <p className="flex-1">
              <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">
                {th.total} · {th.pieces(pieces)}
              </span>
              <AnimatedPrice value={total} className="font-serif text-[1.75rem] leading-tight" />
            </p>
            <ButtonLink href={href("/helwa/commande")} size="lg" arrow>
              {th.order}
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}

function HelwaCard({ item }: { item: HelwaItem }) {
  const { cart, setQuantity } = useHelwa();
  const { t } = useI18n();
  const th = t.helwa;
  const quantity = cart[item.id] ?? 0;
  const min = minQuantity(item);
  // Saisie libre au clavier : la valeur n'est corrigée (minimum) qu'en quittant le champ
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (raw: string) => {
    setDraft(null);
    const n = Math.floor(Number(raw));
    if (!Number.isFinite(n) || n <= 0) return setQuantity(item.id, 0);
    setQuantity(item.id, Math.min(HELWA_MAX_QUANTITY, Math.max(min, n)));
  };

  const selected = quantity > 0;
  const round = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition active:scale-90";

  return (
    <article
      className={`flex h-full gap-4 rounded-[1.6rem] bg-paper p-3 ring-1 transition-[box-shadow] duration-300 sm:flex-col sm:p-4 ${
        selected ? "ring-2 ring-chocolate/70" : "ring-chocolate/8"
      }`}
    >
      <CakeImage
        src={item.image}
        alt={item.name}
        tone={item.tone}
        color={item.color}
        shape="aspect-square rounded-[1.2rem]"
        className="w-28 shrink-0 self-start sm:w-full"
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 112px"
        placeholderLabel=""
        slotLabel={t.common.photoSlot}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-serif text-[1.45rem] leading-tight">{item.name}</h3>
        {item.description && <p className="mt-1 text-sm leading-snug text-cocoa">{item.description}</p>}
        <p className="mt-2 text-sm">
          <span className="font-semibold text-chocolate lining-nums">{formatPrice(item.price)}</span>{" "}
          <span className="text-cocoa">{th.perPiece}</span>
          {min > 1 && <span className="block text-xs text-cocoa-light">{th.minQty(min)}</span>}
        </p>

        <div className="mt-auto pt-4">
          {selected ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={th.remove(item.name)}
                onClick={() => setQuantity(item.id, stepQuantity(item, quantity, -1))}
                className={`${round} border-chocolate/15 bg-cream hover:border-chocolate/40`}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={HELWA_MAX_QUANTITY}
                aria-label={th.quantity(item.name)}
                value={draft ?? quantity}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={(e) => commit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commit(e.currentTarget.value)}
                className="h-11 w-16 min-w-0 rounded-full border border-chocolate/15 bg-cream text-center font-serif text-xl lining-nums [appearance:textfield] focus:border-chocolate focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label={th.plus(item.name)}
                disabled={quantity >= HELWA_MAX_QUANTITY}
                onClick={() => setQuantity(item.id, stepQuantity(item, quantity, 1))}
                className={`${round} border-chocolate bg-chocolate text-cream hover:bg-[#2c1b17] disabled:opacity-40`}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              <AnimatedPrice value={Math.round(item.price * quantity * 100) / 100} className="ml-auto text-sm font-semibold" />
            </div>
          ) : (
            <button
              type="button"
              aria-label={th.add(item.name)}
              onClick={() => setQuantity(item.id, stepQuantity(item, 0, 1))}
              className="flex min-h-11 items-center gap-2 rounded-full border border-chocolate/20 px-4 text-sm font-semibold text-chocolate transition hover:border-chocolate active:scale-[0.97]"
            >
              <PlusIcon className="h-4 w-4" />
              {th.pieces(min)}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
