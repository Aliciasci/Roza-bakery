"use client";

import { resolveComposition } from "@/lib/composition";
import { formatDateShort } from "@/lib/dates";
import { CakeCrossSection, computeCakeTones } from "./CakeCrossSection";
import { useConfigurator } from "./ConfiguratorProvider";

/** Résumé permanent de la création (colonne sticky sur desktop, feuille sur mobile). */
export function ConfiguratorSummary({
  onNavigate,
  onSelectStep,
}: {
  onNavigate?: () => void;
  onSelectStep?: (index: number) => void;
}) {
  const { steps, draft, customer, site, stepIndex, goToStep, maxReached, photos } = useConfigurator();
  const resolved = resolveComposition(steps, draft);
  const tones = computeCakeTones(steps, draft);
  const slot = site.pickupSlots.find((s) => s.id === customer.pickupSlot)?.label;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-[1.9rem] leading-none">Mon gâteau</h2>
        <span className="script text-2xl text-rose-deep">♡</span>
      </div>

      <div className="mt-5 rounded-[1.4rem] bg-ivory px-6 pb-3 pt-5">
        <CakeCrossSection tones={tones} className="mx-auto w-full max-w-[16rem]" />
      </div>

      <dl className="mt-5">
        {resolved.map((row, i) => {
          const step = steps[i];
          const empty = row.items.length === 0;
          const clickable = i <= maxReached && i !== stepIndex;
          return (
            <div
              key={row.stepId}
              className={`relative flex items-baseline justify-between gap-4 border-b border-dashed border-chocolate/12 py-3 transition-colors last:border-0 ${
                clickable ? "hover:text-berry [&:hover_dd]:text-berry" : ""
              }`}
            >
              <dt className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">{row.label}</dt>
              <dd className={`text-right text-sm transition-colors ${empty ? "text-cocoa-light" : "font-medium text-chocolate"}`}>
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => {
                      (onSelectStep ?? goToStep)(i);
                      onNavigate?.();
                    }}
                    title={`Modifier : ${row.label}`}
                    className="text-right after:absolute after:inset-0 after:content-['']"
                  >
                    {empty ? (step.required ? "À choisir" : "—") : row.items.join(", ")}
                  </button>
                ) : empty ? (
                  step.required ? "À choisir" : "—"
                ) : (
                  row.items.join(", ")
                )}
                {photos.length > 0 && row.stepId === "decoration" && (
                  <span className="block text-xs font-normal text-cocoa">
                    {photos.length} photo{photos.length > 1 ? "s" : ""} d&apos;inspiration
                  </span>
                )}
              </dd>
            </div>
          );
        })}
        {customer.pickupDate && (
          <div className="flex items-baseline justify-between gap-4 border-t border-chocolate/15 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">Retrait</dt>
            <dd className="text-right text-sm font-medium">
              {formatDateShort(customer.pickupDate)}
              {slot && <span className="font-normal text-cocoa"> · {slot}</span>}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-5 rounded-2xl bg-rose-soft/70 p-4 text-[0.8125rem] leading-relaxed text-chocolate">
        Le prix de votre création sera confirmé par Roza Bakery après étude de votre demande.
      </p>
    </div>
  );
}
