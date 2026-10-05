"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { resolveComposition } from "@/lib/composition";
import { computeCakeTones } from "./CakeCrossSection";
import { LAST_ORDER_KEY, useConfigurator } from "./ConfiguratorProvider";
import { OrderRecap } from "./OrderRecap";
import type { LastOrder } from "./RecapView";

export function ConfirmationView() {
  const { steps, site, reset, hydrated } = useConfigurator();
  const { locale, t, href } = useI18n();
  const tc = t.confirmation;
  const [order, setOrder] = useState<LastOrder | null | undefined>(undefined);

  useEffect(() => {
    try {
      setOrder(JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) ?? "null"));
    } catch {
      setOrder(null);
    }
  }, []);

  // La demande est partie : on repart d'une création vierge
  useEffect(() => {
    if (hydrated && order) reset();
  }, [hydrated, order, reset]);

  if (order === undefined) return <div className="container-page min-h-[70vh]" aria-busy="true" />;

  if (!order) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-headline">{tc.noneTitle}</h1>
        <p className="mt-4 max-w-md text-cocoa">{tc.noneText}</p>
        <ButtonLink href={href("/composer")} size="lg" arrow className="mt-8">
          {t.common.composeCta}
        </ButtonLink>
      </div>
    );
  }

  const slotLabel = site.pickupSlots.find((s) => s.id === order.customer.pickupSlot)?.label;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-rose/35 blur-3xl" />
        <div className="container-page flex flex-col items-center pb-16 pt-14 text-center md:pb-24 md:pt-24">
          <span
            aria-hidden
            className="flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-paper font-serif text-4xl text-berry shadow-[0_20px_40px_-24px_rgba(158,47,69,0.6)]"
          >
            ♡
          </span>
          <h1 className="mt-10 max-w-3xl animate-fade-up text-display [animation-delay:120ms]">
            {tc.title} <span className="text-berry">♡</span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-[1.0625rem] leading-relaxed text-cocoa [animation-delay:220ms] md:text-lg">
            {tc.text}
          </p>
          <p className="mt-6 animate-fade-up text-xs uppercase tracking-[0.2em] text-cocoa [animation-delay:300ms]">
            {tc.reference} <span className="font-semibold text-chocolate">{order.reference}</span>
          </p>
        </div>
      </section>

      <section className="container-page animate-fade-up [animation-delay:380ms]">
        <OrderRecap
          composition={resolveComposition(steps, order.draft)}
          tones={computeCakeTones(steps, order.draft)}
          customer={order.customer}
          slotLabel={slotLabel}
          photoCount={order.photoCount}
          reference={order.reference}
          locale={locale}
        />
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-title">{tc.nextTitle}</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {tc.steps.map(({ title, text }, i) => (
              <li key={title} className="text-center">
                <span className="font-serif text-3xl italic text-rose-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={href("/")} size="lg" variant="secondary">
              {tc.home}
            </ButtonLink>
            <ButtonLink href={href("/creations")} size="lg" arrow>
              {t.common.seeCreations}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
