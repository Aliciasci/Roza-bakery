"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { resolveComposition } from "@/lib/composition";
import { validateComposition, validateCustomer } from "@/lib/validation";
import { computeCakeTones } from "./CakeCrossSection";
import { LAST_ORDER_KEY, useConfigurator } from "./ConfiguratorProvider";
import { OrderRecap } from "./OrderRecap";
import { useObjectUrls } from "./useObjectUrls";

export interface LastOrder {
  reference: string;
  draft: ReturnType<typeof useConfigurator>["draft"];
  customer: ReturnType<typeof useConfigurator>["customer"];
  photoCount: number;
}

export function RecapView() {
  const router = useRouter();
  const { steps, draft, customer, site, photos, hydrated } = useConfigurator();
  const { locale, t, href } = useI18n();
  const tr = t.recap;
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const photoUrls = useObjectUrls(photos);

  if (!hydrated) return <div className="container-page min-h-[70vh]" aria-busy="true" />;

  const compositionError = validateComposition(steps, draft, t.validation);
  const customerErrors = validateCustomer(customer, site, undefined, t.validation);
  const firstIncompleteStep = steps.findIndex((s) => s.required && !(draft.selections[s.id]?.length ?? 0));

  if (compositionError || Object.keys(customerErrors).length) {
    const target = firstIncompleteStep >= 0 ? firstIncompleteStep + 1 : steps.length + 1;
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="script text-4xl text-rose-deep">{tr.incompleteScript}</p>
        <h1 className="mt-3 max-w-xl text-headline">{tr.incompleteTitle}</h1>
        <p className="mt-5 max-w-md text-cocoa">
          {compositionError ?? Object.values(customerErrors)[0]} {tr.incompleteText}
        </p>
        <ButtonLink href={`${href("/composer")}?etape=${target}`} size="lg" arrow className="mt-9">
          {tr.resume}
        </ButtonLink>
      </div>
    );
  }

  const composition = resolveComposition(steps, draft);
  const slotLabel = site.pickupSlots.find((s) => s.id === customer.pickupSlot)?.label;

  async function submit() {
    setStatus("sending");
    setErrorMessage("");
    try {
      const body = new FormData();
      body.append("payload", JSON.stringify({ ...draft, customer, locale }));
      body.append("website", honeypot);
      photos.forEach((file) => body.append("photos", file, file.name));

      const res = await fetch("/api/commande", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { reference?: string; error?: string };
      if (!res.ok || !data.reference) throw new Error(data.error ?? tr.genericError);

      const lastOrder: LastOrder = { reference: data.reference, draft, customer, photoCount: photos.length };
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(lastOrder));
      } catch {
        /* ignore */
      }
      router.push(href("/composer/confirmation"));
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : tr.networkError,
      );
    }
  }

  const sending = status === "sending";

  return (
    <div className="pb-36 lg:pb-0">
      <section className="container-page pb-12 pt-6 md:pt-12">
        <Link href={`${href("/composer")}?etape=${steps.length + 1}`} className="inline-flex min-h-11 items-center text-sm text-cocoa hover:text-chocolate">
          {tr.backToCreation}
        </Link>
        <div className="mt-6 max-w-3xl animate-fade-up">
          <p className="eyebrow">{tr.eyebrow}</p>
          <h1 className="mt-4 text-display">
            {tr.title1} <em className="text-cocoa">{tr.title2}</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa">
            {tr.intro}
          </p>
        </div>
      </section>

      <section className="container-page animate-fade-up [animation-delay:120ms]">
        <OrderRecap
          composition={composition}
          tones={computeCakeTones(steps, draft)}
          customer={customer}
          slotLabel={slotLabel}
          photoUrls={photoUrls}
          editable
          locale={locale}
          composerHref={href("/composer")}
        />
      </section>

      <section className="container-page py-16 text-center md:py-24">
        <p className="mx-auto max-w-lg text-[1.0625rem] leading-relaxed text-cocoa">
          {t.common.priceNote}
          <span className="mt-1 block text-sm">{tr.noPayment}</span>
        </p>

        {/* Champ anti-spam invisible */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            {tr.honeypot}
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
        </div>

        <div aria-live="assertive">
          {status === "error" && (
            <p role="alert" className="mx-auto mt-6 max-w-md rounded-2xl bg-berry/10 p-4 text-sm text-berry">
              {errorMessage}
            </p>
          )}
        </div>

        <Button size="lg" arrow onClick={submit} disabled={sending} className="mt-8 min-w-72 max-lg:!hidden">
          {sending ? tr.sending : tr.submit}
        </Button>
        <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-cocoa-light">
          {tr.privacy}
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-chocolate/10 bg-cream/95 pb-safe backdrop-blur-md lg:hidden">
        <div className="container-page pt-3">
          <Button size="lg" arrow onClick={submit} disabled={sending} className="w-full">
            {sending ? tr.sending : tr.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
