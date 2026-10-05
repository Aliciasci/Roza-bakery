"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, ChevronIcon, CloseIcon } from "@/components/ui/Icons";
import { validateCustomer, type FieldErrors } from "@/lib/validation";
import type { CustomerInfo } from "@/lib/types";
import { CakeCrossSection, computeCakeTones } from "./CakeCrossSection";
import { useConfigurator } from "./ConfiguratorProvider";
import { ConfiguratorSummary } from "./ConfiguratorSummary";
import { CustomerStep } from "./CustomerStep";
import { OptionStep } from "./OptionStep";
import { StepProgress } from "./StepProgress";

const INFO_STEP = {
  name: "Informations de commande",
  title: "Vos informations",
  subtitle: "Dites-nous quand et pour combien de personnes. Roza Bakery reviendra vers vous pour confirmer.",
};

function readStepFromUrl(): number | null {
  const n = Number(new URLSearchParams(window.location.search).get("etape"));
  return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}

export function Configurator() {
  const router = useRouter();
  const ctx = useConfigurator();
  const { steps, draft, customer, site, stepIndex, maxReached, totalSteps, hydrated, goToStep } = ctx;

  const [stepError, setStepError] = useState<string | null>(null);
  const [customerErrors, setCustomerErrors] = useState<FieldErrors<keyof CustomerInfo>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const isInfoStep = stepIndex >= steps.length;
  const step = isInfoStep ? null : steps[stepIndex];
  const names = [...steps.map((s) => s.name), INFO_STEP.name];

  /* --- Navigation & historique navigateur (le bouton « retour » du téléphone recule d'une étape) --- */

  const changeStep = useCallback(
    (index: number, mode: "push" | "replace" | "none" = "push") => {
      setDirection(index >= stepIndex ? "next" : "prev");
      setStepError(null);
      goToStep(index);
      const url = `${window.location.pathname}?etape=${index + 1}`;
      if (mode === "push") window.history.pushState(null, "", url);
      if (mode === "replace") window.history.replaceState(null, "", url);
    },
    [goToStep, stepIndex],
  );

  // Au chargement : reprend l'étape de l'URL (ex. lien « Modifier » du récapitulatif)
  useEffect(() => {
    if (!hydrated) return;
    const fromUrl = readStepFromUrl();
    const target = fromUrl !== null && fromUrl < totalSteps && fromUrl <= maxReached ? fromUrl : stepIndex;
    changeStep(target, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uniquement après hydratation
  }, [hydrated]);

  useEffect(() => {
    const onPop = () => {
      const fromUrl = readStepFromUrl();
      if (fromUrl !== null && fromUrl < totalSteps) changeStep(fromUrl, "none");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [changeStep, totalSteps]);

  // À chaque changement d'étape : retour en haut + focus sur le titre (lecteurs d'écran)
  useEffect(() => {
    if (!hydrated) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [stepIndex, hydrated]);

  /* --- Validation --- */

  function next() {
    if (step) {
      if (step.required && !(draft.selections[step.id]?.length ?? 0)) {
        setStepError("Merci de faire un choix pour continuer.");
        return;
      }
      changeStep(stepIndex + 1);
      return;
    }
    const errors = validateCustomer(customer, site);
    setCustomerErrors(errors);
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const el = document.getElementById(`f-${firstKey}`) ?? document.getElementById(`f-${firstKey}-label`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
      return;
    }
    router.push("/composer/recapitulatif");
  }

  function back() {
    if (stepIndex > 0) changeStep(stepIndex - 1);
  }

  // Efface les erreurs d'un champ dès qu'il est corrigé
  useEffect(() => {
    setCustomerErrors((prev) => {
      if (!Object.keys(prev).length) return prev;
      const now = validateCustomer(customer, site);
      const kept: typeof prev = {};
      for (const k of Object.keys(prev) as (keyof CustomerInfo)[]) if (now[k]) kept[k] = now[k];
      return kept;
    });
  }, [customer, site]);

  useEffect(() => {
    if (step && draft.selections[step.id]?.length) setStepError(null);
  }, [draft.selections, step]);

  /* --- Libellés --- */

  const hasSelection = step ? (draft.selections[step.id]?.length ?? 0) > 0 : true;
  const continueLabel = isInfoStep
    ? "Voir mon récapitulatif"
    : step && !step.required && !hasSelection
      ? "Passer cette étape"
      : "Continuer";
  const choicesCount = Object.values(draft.selections).reduce((n, ids) => n + (ids?.length ?? 0), 0);

  if (!hydrated) {
    return (
      <div className="container-page min-h-[70vh] pt-10" aria-busy="true">
        <div className="h-1 w-full animate-pulse rounded-full bg-chocolate/10" />
        <div className="mt-12 h-16 w-2/3 animate-pulse rounded-2xl bg-chocolate/5" />
      </div>
    );
  }

  const title = step?.title ?? INFO_STEP.title;
  const subtitle = step?.subtitle ?? INFO_STEP.subtitle;

  return (
    <>
      <div className="container-page pb-48 pt-4 md:pt-8 lg:pb-28">
        <h1 className="sr-only">Composer mon gâteau</h1>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-8">
            <div className="sticky top-16 z-20 -mx-5 bg-cream/92 px-5 pb-2 pt-2 backdrop-blur-md md:top-20 md:-mx-10 md:px-10 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
              <StepProgress names={names} current={stepIndex} maxReached={maxReached} onSelect={(i) => changeStep(i)} />
            </div>

            <div key={stepIndex} className={direction === "next" ? "animate-step-in-next" : "animate-step-in-prev"}>
              {/* Sur mobile, le numéro et le nom de l'étape sont déjà dans la barre de progression */}
              <header className="mb-6 mt-4 md:mb-12 md:mt-12">
                <div className="hidden items-end gap-4 md:flex">
                  <span aria-hidden className="font-serif text-[4.5rem] italic leading-[0.8] text-rose-deep/80 md:text-[6rem]">
                    {String(stepIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow pb-1.5">{step?.name ?? INFO_STEP.name}</p>
                </div>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-[1.75rem] leading-[1.1] tracking-[-0.01em] outline-none md:mt-5 md:text-headline"
                >
                  {title}
                </h2>
                <p className="mt-2 max-w-xl text-[0.9375rem] leading-snug text-cocoa md:mt-4 md:text-[1.0625rem] md:leading-relaxed">
                  {subtitle}
                  {step && !step.required && (
                    <span className="ml-2 whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.14em] text-cocoa-light md:mt-2 md:ml-0 md:block md:text-xs md:tracking-[0.16em]">
                      Facultatif
                    </span>
                  )}
                </p>
              </header>

              {step ? <OptionStep step={step} error={stepError} /> : <CustomerStep errors={customerErrors} />}

              {/* Navigation desktop */}
              <div className="mt-14 hidden items-center justify-between border-t border-chocolate/10 pt-8 lg:flex">
                <Button variant="ghost" onClick={back} disabled={stepIndex === 0} className="!px-0">
                  <ArrowLeftIcon className="h-4 w-4" /> Retour
                </Button>
                <Button size="lg" arrow onClick={next}>
                  {continueLabel}
                </Button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:col-span-4 lg:block" aria-label="Résumé de ma création">
            <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-[2rem] bg-paper p-7 shadow-[0_30px_60px_-40px_rgba(58,37,32,0.45)] ring-1 ring-chocolate/5 no-scrollbar">
              <ConfiguratorSummary onSelectStep={(i) => changeStep(i)} />
            </div>
          </aside>
        </div>
      </div>

      {/* Barre d'actions mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-chocolate/10 bg-cream/95 pb-safe backdrop-blur-md lg:hidden">
        <div className="container-page pt-2.5">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="flex w-full items-center gap-3 rounded-xl py-1.5 text-left"
          >
            <span aria-hidden className="h-9 w-11 shrink-0">
              <CakeCrossSection tones={computeCakeTones(steps, draft)} className="h-full w-full" />
            </span>
            <span className="flex-1 text-sm font-semibold text-chocolate">
              Ma création
              <span className="ml-2 rounded-full bg-rose px-2 py-0.5 text-[0.6875rem] font-semibold">
                {choicesCount} choix
              </span>
            </span>
            <ChevronIcon className="h-4 w-4 rotate-180 text-cocoa" />
          </button>
          <div className="mt-2 flex gap-2.5">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0}
              aria-label="Étape précédente"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-chocolate/20 transition active:scale-95 disabled:opacity-30"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <Button size="lg" arrow onClick={next} className="flex-1">
              {continueLabel}
            </Button>
          </div>
        </div>
      </div>

      <SummarySheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSelectStep={(i) => changeStep(i)} />
    </>
  );
}

function SummarySheet({
  open,
  onClose,
  onSelectStep,
}: {
  open: boolean;
  onClose: () => void;
  onSelectStep: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Résumé de ma création">
      <div className="absolute inset-0 animate-fade-in bg-chocolate/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] animate-sheet-in overflow-y-auto rounded-t-[2rem] bg-cream px-5 pb-safe pt-3 shadow-2xl">
        <div className="sticky top-0 z-10 -mx-5 flex justify-center bg-cream px-5 pb-2">
          <span aria-hidden className="mt-1 h-1 w-10 rounded-full bg-chocolate/15" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer le résumé"
            className="absolute right-3 top-0 flex h-11 w-11 items-center justify-center rounded-full"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="pb-6 pt-2">
          <ConfiguratorSummary onNavigate={onClose} onSelectStep={onSelectStep} />
        </div>
      </div>
    </div>
  );
}
