import Link from "next/link";
import type { ReactNode } from "react";
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
}

function Row({ label, children, editHref }: { label: string; children: ReactNode; editHref?: string }) {
  return (
    <div className="grid grid-cols-[minmax(6.5rem,auto)_1fr] items-baseline gap-x-4 border-b border-dashed border-chocolate/15 py-4 last:border-0 sm:grid-cols-[10rem_1fr_auto]">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">{label}</dt>
      <dd className="font-serif text-[1.3rem] leading-snug text-chocolate">{children}</dd>
      {editHref && (
        <Link
          href={editHref}
          className="col-start-2 mt-1 justify-self-start text-xs font-semibold text-cocoa underline decoration-chocolate/25 underline-offset-4 hover:text-chocolate sm:col-start-3 sm:mt-0"
        >
          Modifier<span className="sr-only"> : {label}</span>
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
export function OrderRecap({ composition, tones, customer, slotLabel, photoUrls, photoCount, editable, reference }: Props) {
  const filled = composition.filter((s) => s.items.length || s.notes);
  const count = photoUrls?.length ?? photoCount ?? 0;

  return (
    <article className="relative overflow-hidden rounded-[2rem] bg-paper shadow-[0_40px_80px_-50px_rgba(58,37,32,0.5)] ring-1 ring-chocolate/5">
      <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-chocolate/8 md:inset-4" />

      <div className="relative grid gap-10 p-6 pt-9 sm:p-10 md:p-14 lg:grid-cols-[1fr_17rem] lg:gap-14">
        <div className="space-y-12">
          <section>
            <SectionTitle>Mon gâteau</SectionTitle>
            <dl className="mt-2">
              {filled.map((step) => (
                <Row key={step.stepId} label={step.label} editHref={editable ? `/composer?etape=${composition.indexOf(step) + 1}` : undefined}>
                  {step.items.length ? step.items.join(", ") : <span className="text-cocoa-light">—</span>}
                  {step.notes && (
                    <span className="mt-1 block font-sans text-sm italic leading-relaxed text-cocoa">« {step.notes} »</span>
                  )}
                  {step.stepId === "decoration" && count > 0 && (
                    <span className="mt-1 block font-sans text-sm text-cocoa">
                      {count} photo{count > 1 ? "s" : ""} d&apos;inspiration jointe{count > 1 ? "s" : ""}
                    </span>
                  )}
                </Row>
              ))}
            </dl>
            {photoUrls && photoUrls.length > 0 && (
              <ul className="mt-5 flex gap-2.5 overflow-x-auto no-scrollbar" aria-label="Photos d'inspiration">
                {photoUrls.map((url, i) => (
                  <li key={url} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local */}
                    <img src={url} alt={`Inspiration ${i + 1}`} className="h-20 w-20 rounded-xl object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle>Date de retrait</SectionTitle>
            <dl className="mt-2">
              <Row label="Date" editHref={editable ? `/composer?etape=${composition.length + 1}` : undefined}>
                <span className="inline-block first-letter:uppercase">{formatDateLong(customer.pickupDate)}</span>
              </Row>
              {slotLabel && <Row label="Créneau">{slotLabel}</Row>}
              <Row label="Personnes">{customer.servings}</Row>
              <Row label="Lieu">Retrait sur place</Row>
            </dl>
          </section>

          <section>
            <SectionTitle>Informations client</SectionTitle>
            <dl className="mt-2">
              <Row label="Nom" editHref={editable ? `/composer?etape=${composition.length + 1}` : undefined}>
                {customer.firstName} {customer.lastName}
              </Row>
              <Row label="Email">
                <span className="break-all font-sans text-base">{customer.email}</span>
              </Row>
              <Row label="Téléphone">
                <span className="font-sans text-base">{customer.phone}</span>
              </Row>
              {customer.message.trim() && (
                <Row label="Message">
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
                Référence <span className="font-semibold text-chocolate">{reference}</span>
              </p>
            )}
            <p className="mt-5 rounded-2xl bg-rose-soft/80 p-5 text-sm leading-relaxed text-chocolate">
              Le prix de votre création sera confirmé par Roza Bakery après étude de votre demande.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
