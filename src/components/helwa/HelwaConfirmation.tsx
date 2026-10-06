"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { formatDateLong } from "@/lib/dates";
import { LAST_HELWA_ORDER_KEY, useHelwa, type LastHelwaOrder } from "./HelwaProvider";
import { HelwaSelection } from "./HelwaSelection";

export function HelwaConfirmation() {
  const { site, reset, hydrated } = useHelwa();
  const { locale, t, href } = useI18n();
  const th = t.helwa;
  const [order, setOrder] = useState<LastHelwaOrder | null | undefined>(undefined);

  useEffect(() => {
    try {
      setOrder(JSON.parse(sessionStorage.getItem(LAST_HELWA_ORDER_KEY) ?? "null"));
    } catch {
      setOrder(null);
    }
  }, []);

  // La commande est partie : le panier est vidé
  useEffect(() => {
    if (hydrated && order) reset();
  }, [hydrated, order, reset]);

  if (order === undefined) return <div className="container-page min-h-[70vh]" aria-busy="true" />;

  if (!order) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-headline">{th.noneTitle}</h1>
        <p className="mt-4 max-w-md text-cocoa">{th.noneText}</p>
        <ButtonLink href={href("/helwa")} size="lg" arrow className="mt-8">
          {th.seeHelwa}
        </ButtonLink>
      </div>
    );
  }

  const slot = site.pickupSlots.find((s) => s.id === order.customer.pickupSlot)?.label;

  return (
    <div className="pb-20 md:pb-28">
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-rose/35 blur-3xl" />
        <div className="container-page flex flex-col items-center pb-14 pt-14 text-center md:pb-20 md:pt-24">
          <span
            aria-hidden
            className="flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-paper font-serif text-4xl text-berry shadow-[0_20px_40px_-24px_rgba(158,47,69,0.6)]"
          >
            ♡
          </span>
          <h1 className="mt-10 max-w-3xl animate-fade-up text-display [animation-delay:120ms]">
            {th.thanksTitle} <span className="text-berry">♡</span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-[1.0625rem] leading-relaxed text-cocoa [animation-delay:220ms] md:text-lg">
            {th.thanksText}
          </p>
          <p className="mt-6 animate-fade-up text-xs uppercase tracking-[0.2em] text-cocoa [animation-delay:300ms]">
            {t.confirmation.reference} <span className="font-semibold text-chocolate">{order.reference}</span>
          </p>
        </div>
      </section>

      <section className="container-page animate-fade-up [animation-delay:380ms]">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-paper p-6 shadow-[0_40px_80px_-50px_rgba(58,37,32,0.5)] ring-1 ring-chocolate/5 md:p-10">
          <h2 className="font-serif text-[1.9rem] leading-none">{th.selection}</h2>
          <HelwaSelection lines={order.lines} total={order.total} className="mt-4" />
          <p className="mt-6 border-t border-chocolate/15 pt-4 text-sm">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">{t.configurator.pickup}</span>{" "}
            <span className="inline-block font-medium first-letter:uppercase">{formatDateLong(order.customer.pickupDate, locale)}</span>
            {slot && <span className="text-cocoa"> · {slot}</span>}
          </p>
          <p className="mt-6 rounded-2xl bg-rose-soft/80 p-4 text-[0.8125rem] leading-relaxed text-chocolate">{th.confirmNote}</p>
        </div>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={href("/")} size="lg" variant="secondary">
            {th.backHome}
          </ButtonLink>
          <ButtonLink href={href("/creations")} size="lg" arrow>
            {t.common.seeCreations}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
