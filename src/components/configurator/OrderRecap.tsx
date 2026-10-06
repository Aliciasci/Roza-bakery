import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { formatDateLong } from "@/lib/dates";
import type { CustomerInfo, ResolvedStep } from "@/lib/types";
import { CakeCrossSection, type CakeTones } from "./CakeCrossSection";

interface Props {
  composition: ResolvedStep[];
  tones: CakeTones;
  customer: CustomerInfo;
  slotLabel?: string;
  photoUrls?: string[];
  photoCount?: number;
  /** Affiche les liens « Modifier » vers les étapes du configurateur. */
  editable?: boolean;
  reference?: string;
  locale: Locale;
  /** Préfixe des liens « Modifier » (ex. « /kab/composer »). */
  composerHref?: string;
}

function Row({
  label,
  children,
  editHref,
  editLabel,
}: {
  label: string;
  children: ReactNode;
  editHref?: string;
  editLabel?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(6.5rem,auto)_1fr] items-baseline gap-x-4 border-b border-dashed border-chocolate/15 py-4 last:border-0 sm:grid-cols-[10rem_1fr_auto]">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">{label}</dt>
      <dd className="font-serif text-[1.3rem] leading-snug text-chocolate">{children}</dd>
      {editHref && (
        <Link
          href={editHref}
          className="col-start-2 mt-1 justify-self-start text-xs font-semibold text-cocoa underline decoration-chocolate/25 underline-offset-4 hover:text-chocolate sm:col-start-3 sm:mt-0"
        >
          {editLabel}
          <span className="sr-only"> : {label}</span>
        </Link>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-4 font-serif text-[1.9rem] leading-none">
      {children}
      <span aria-hidden className="rule flex-1" />
    </h3>
  );
}

/** Récapitulatif « papeterie » de la demande — utilisé avant et après l'envoi. */
export function OrderRecap({
  composition,
  tones,
  customer,
  slotLabel,
  photoUrls,
  photoCount,
  editable,
  reference,
  locale,
  composerHref = "/composer",
}: Props) {
  const t = getDictionary(locale).recap;
  const edit = (step: number) => (editable ? `${composerHref}?etape=${step}` : undefined);
  const filled = composition.filter((s) => s.items.length || s.notes);
  const count = photoUrls?.length ?? photoCount ?? 0;

  return (
    <article className="relative overflow-hidden rounded-[2rem] bg-paper shadow-[0_40px_80px_-50px_rgba(58,37,32,0.5)] ring-1 ring-chocolate/5">
      <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-chocolate/8 md:inset-4" />

      <div className="relative grid gap-10 p-6 pt-9 sm:p-10 md:p-14 lg:grid-cols-[1fr_17rem] lg:gap-14">
        <div className="space-y-12">
          <section>
            <SectionTitle>{t.myCake}</SectionTitle>
            <dl className="mt-2">
              {filled.map((step) => (
                <Row key={step.stepId} label={step.label} editHref={edit(composition.indexOf(step) + 1)} editLabel={t.modify}>
                  {step.items.length ? step.items.join(", ") : <span className="text-cocoa-light">—</span>}
                  {step.notes && (
                    <span className="mt-1 block font-sans text-sm italic leading-relaxed text-cocoa">« {step.notes} »</span>
                  )}
                  {step.stepId === "decoration" && count > 0 && (
                    <span className="mt-1 block font-sans text-sm text-cocoa">
                      {t.inspirationJoined(count)}
                    </span>
                  )}
                </Row>
              ))}
            </dl>
            {photoUrls && photoUrls.length > 0 && (
              <ul className="mt-5 flex gap-2.5 overflow-x-auto no-scrollbar" aria-label={t.photosAria}>
                {photoUrls.map((url, i) => (
                  <li key={url} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
                    <img src={url} alt={`${t.photosAria} ${i + 1}`} className="h-20 w-20 rounded-xl object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle>{t.pickupTitle}</SectionTitle>
            <dl className="mt-2">
              <Row label={t.date} editHref={edit(composition.length + 1)} editLabel={t.modify}>
                <span className="inline-block first-letter:uppercase">{formatDateLong(customer.pickupDate, locale)}</span>
              </Row>
              {slotLabel && <Row label={t.slot}>{slotLabel}</Row>}
              <Row label={t.servings}>{customer.servings}</Row>
              <Row label={t.place}>{t.onSite}</Row>
            </dl>
          </section>

          <section>
            <SectionTitle>{t.customerTitle}</SectionTitle>
            <dl className="mt-2">
              <Row label={t.name} editHref={edit(composition.length + 1)} editLabel={t.modify}>
                {customer.firstName} {customer.lastName}
              </Row>
              {customer.email.trim() && (
                <Row label={t.email}>
                  <span className="break-all font-sans text-base">{customer.email}</span>
                </Row>
              )}
              <Row label={t.phone}>
                <span className="font-sans text-base">{customer.phone}</span>
              </Row>
              {customer.message.trim() && (
                <Row label={t.message}>
                  <span className="font-sans text-base leading-relaxed">{customer.message}</span>
                </Row>
              )}
            </dl>
          </section>
        </div>

        <aside className="order-first lg:order-none">
          <div className="lg:sticky lg:top-28">
            <div className="rounded-[1.6rem] bg-ivory p-6">
              <CakeCrossSection tones={tones} className="mx-auto w-full max-w-[15rem]" />
            </div>
            {reference && (
              <p className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-cocoa">
                {t.reference} <span className="font-semibold text-chocolate">{reference}</span>
              </p>
            )}
            <p className="mt-5 rounded-2xl bg-rose-soft/80 p-5 text-sm leading-relaxed text-chocolate">
              {getDictionary(locale).common.priceNote}
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
