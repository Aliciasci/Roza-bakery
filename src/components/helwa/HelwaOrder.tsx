"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomerFields } from "@/components/configurator/CustomerStep";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { validateCustomer, type FieldErrors } from "@/lib/validation";
import type { CustomerInfo } from "@/lib/types";
import { LAST_HELWA_ORDER_KEY, useHelwa, type LastHelwaOrder } from "./HelwaProvider";
import { HelwaSelection } from "./HelwaSelection";

/** Page « Ma commande Helwa » : coordonnées, date de retrait, envoi. */
export function HelwaOrder() {
  const router = useRouter();
  const { cart, lines, total, customer, updateCustomer, site, hydrated } = useHelwa();
  const { locale, t, href } = useI18n();
  const th = t.helwa;
  const [errors, setErrors] = useState<FieldErrors<keyof CustomerInfo>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Efface les erreurs d'un champ dès qu'il est corrigé
  useEffect(() => {
    setErrors((prev) => {
      if (!Object.keys(prev).length) return prev;
      const now = validateCustomer(customer, site, undefined, t.validation, false);
      const kept: typeof prev = {};
      for (const k of Object.keys(prev) as (keyof CustomerInfo)[]) if (now[k]) kept[k] = now[k];
      return kept;
    });
  }, [customer, site, t.validation]);

  if (!hydrated) return <div className="container-page min-h-[70vh]" aria-busy="true" />;

  if (!lines.length) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-headline">{th.emptyCart}</h1>
        <ButtonLink href={href("/helwa")} size="lg" arrow className="mt-8">
          {th.seeHelwa}
        </ButtonLink>
      </div>
    );
  }

  async function submit() {
    const found = validateCustomer(customer, site, undefined, t.validation, false);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      const el = document.getElementById(`f-${firstKey}`) ?? document.getElementById(`f-${firstKey}-label`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/helwa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customer, locale, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { reference?: string; total?: number; error?: string };
      if (!res.ok || !data.reference) throw new Error(data.error ?? t.recap.genericError);

      const last: LastHelwaOrder = { reference: data.reference, lines, total: data.total ?? total, customer };
      try {
        sessionStorage.setItem(LAST_HELWA_ORDER_KEY, JSON.stringify(last));
      } catch {
        /* ignore */
      }
      router.push(href("/helwa/confirmation"));
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error && err.message !== "Failed to fetch" ? err.message : t.recap.networkError);
    }
  }

  const sending = status === "sending";

  return (
    <div className="pb-36 lg:pb-0">
      <section className="container-page pb-10 pt-6 md:pt-12">
        <Link href={href("/helwa")} className="inline-flex min-h-11 items-center text-sm text-cocoa hover:text-chocolate">
          {th.backToCatalog}
        </Link>
        <div className="mt-6 max-w-3xl animate-fade-up">
          <p className="eyebrow">{th.orderEyebrow}</p>
          <h1 className="mt-4 text-display">
            {th.orderTitle1} <em className="text-cocoa">{th.orderTitle2}</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa">{th.orderIntro}</p>
        </div>
      </section>

      <div className="container-page lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <aside className="mb-12 lg:order-last lg:col-span-4 lg:mb-0" aria-label={th.cartAria}>
          <div className="rounded-[2rem] bg-paper p-6 shadow-[0_30px_60px_-40px_rgba(58,37,32,0.45)] ring-1 ring-chocolate/5 md:p-7 lg:sticky lg:top-28">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-[1.9rem] leading-none">{th.selection}</h2>
              <Link href={href("/helwa")} className="text-xs font-semibold text-cocoa underline decoration-chocolate/25 underline-offset-4 hover:text-chocolate">
                {th.modify}
              </Link>
            </div>
            <HelwaSelection lines={lines} total={total} className="mt-4" />
            <p className="mt-6 rounded-2xl bg-rose-soft/80 p-4 text-[0.8125rem] leading-relaxed text-chocolate">{th.confirmNote}</p>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <CustomerFields customer={customer} updateCustomer={updateCustomer} site={site} errors={errors} servings={false} />

          {/* Champ anti-spam invisible */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              {t.recap.honeypot}
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div aria-live="assertive">
            {status === "error" && (
              <p role="alert" className="mt-8 rounded-2xl bg-berry/10 p-4 text-sm text-berry">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="mt-12 hidden border-t border-chocolate/10 pt-8 lg:block">
            <Button size="lg" arrow onClick={submit} disabled={sending} className="min-w-72">
              {sending ? th.sending : th.submit}
            </Button>
            <p className="mt-5 max-w-md text-xs leading-relaxed text-cocoa-light">{t.recap.privacy}</p>
          </div>
          <p className="mt-10 text-xs leading-relaxed text-cocoa-light lg:hidden">{t.recap.privacy}</p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-chocolate/10 bg-cream/95 pb-safe backdrop-blur-md lg:hidden">
        <div className="container-page pt-3">
          <Button size="lg" arrow onClick={submit} disabled={sending} className="w-full">
            {sending ? th.sending : th.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
