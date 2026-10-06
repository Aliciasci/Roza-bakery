"use client";

import { useState } from "react";
import { RestartIcon } from "@/components/ui/Icons";
import { useI18n } from "@/i18n/client";
import { resolveComposition } from "@/lib/composition";
import { formatDateShort } from "@/lib/dates";
import { CakeCrossSection, computeCakeTones } from "./CakeCrossSection";
import { useConfigurator } from "./ConfiguratorProvider";

/** Résumé permanent de la création (colonne sticky sur desktop, feuille sur mobile). */
export function ConfiguratorSummary({
  onNavigate,
  onSelectStep,
  onRestart,
}: {
  onNavigate?: () => void;
  onSelectStep?: (index: number) => void;
  /** Efface la composition (après confirmation) et revient à la première étape. */
  onRestart?: () => void;
}) {
  const { steps, draft, customer, site, stepIndex, goToStep, maxReached, photos } = useConfigurator();
  const [confirming, setConfirming] = useState(false);
  const hasContent =
    maxReached > 0 ||
    photos.length > 0 ||
    Object.values(draft.selections).some((ids) => ids?.length) ||
    Object.values(draft.notes).some((n) => n?.trim()) ||
    Object.values(customer).some((v) => typeof v === "string" && v.trim());
  const { t } = useI18n();
  const tc = t.configurator;
  const resolved = resolveComposition(steps, draft);
  const tones = computeCakeTones(steps, draft);
  const slot = site.pickupSlots.find((s) => s.id === customer.pickupSlot)?.label;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-[1.9rem] leading-none">{tc.summaryTitle}</h2>
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
                    title={tc.modify(row.label)}
                    className="text-right after:absolute after:inset-0 after:content-['']"
                  >
                    {empty ? (step.required ? tc.toChoose : "—") : row.items.join(", ")}
                  </button>
                ) : empty ? (
                  step.required ? tc.toChoose : "—"
                ) : (
                  row.items.join(", ")
                )}
                {photos.length > 0 && row.stepId === "decoration" && (
                  <span className="block text-xs font-normal text-cocoa">
                    {tc.photosCount(photos.length)}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
        {customer.pickupDate && (
          <div className="flex items-baseline justify-between gap-4 border-t border-chocolate/15 py-3">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">{tc.pickup}</dt>
            <dd className="text-right text-sm font-medium">
              {formatDateShort(customer.pickupDate)}
              {slot && <span className="font-normal text-cocoa"> · {slot}</span>}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-5 rounded-2xl bg-rose-soft/70 p-4 text-[0.8125rem] leading-relaxed text-chocolate">
        {t.common.priceNote}
      </p>

      {onRestart && hasContent && (
        <div className="mt-4 text-center" aria-live="polite">
          {confirming ? (
            <div className="rounded-2xl border border-chocolate/12 p-4">
              <p className="text-sm text-chocolate">{tc.restartConfirm}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    onRestart();
                  }}
                  className="min-h-11 rounded-full bg-berry px-5 text-sm font-semibold text-white transition hover:bg-berry/90"
                >
                  {tc.restartYes}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="min-h-11 rounded-full border border-chocolate/20 px-5 text-sm font-semibold text-chocolate transition hover:border-chocolate"
                >
                  {tc.restartNo}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-cocoa underline-offset-4 transition hover:text-berry hover:underline"
            >
              <RestartIcon className="h-4 w-4" />
              {tc.restart}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
