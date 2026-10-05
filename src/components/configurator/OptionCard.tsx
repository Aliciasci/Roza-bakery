"use client";

import { CheckIcon } from "@/components/ui/Icons";
import { LIMITS } from "@/lib/validation";
import type { CompositionStepId, ConfigOption } from "@/lib/types";
import { OptionSwatch, OptionVisual } from "./OptionVisual";

interface Props {
  option: ConfigOption;
  stepId: CompositionStepId;
  mode: "single" | "multiple";
  selected: boolean;
  variant: "visual" | "compact";
  customValue?: string;
  onToggle: () => void;
  onCustomChange: (value: string) => void;
}

function tap() {
  // Léger retour haptique (Android) — ignoré silencieusement ailleurs
  try {
    navigator.vibrate?.(8);
  } catch {
    /* ignore */
  }
}

function Check({ selected, multiple }: { selected: boolean; multiple: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-6 w-6 shrink-0 items-center justify-center border transition-colors duration-300 ${
        multiple ? "rounded-md" : "rounded-full"
      } ${selected ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/25 bg-paper"}`}
    >
      {selected && <CheckIcon className="h-3.5 w-3.5 animate-pop" />}
    </span>
  );
}

export function OptionCard({ option, stepId, mode, selected, variant, customValue = "", onToggle, onCustomChange }: Props) {
  const inputId = `custom-${option.id}`;
  const base =
    "group relative w-full text-left outline-offset-4 transition-[border-color,box-shadow,transform,background-color] duration-300 ease-[var(--ease-soft)] active:scale-[0.985]";
  const state = selected
    ? "border-chocolate bg-paper shadow-[0_14px_34px_-22px_rgba(58,37,32,0.55)]"
    : "border-chocolate/12 bg-paper/70 hover:border-chocolate/35 hover:bg-paper";

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        role={mode === "single" ? "radio" : "checkbox"}
        aria-checked={selected}
        data-option
        onClick={() => {
          tap();
          onToggle();
        }}
        className={`${base} ${state} flex-1 border ${variant === "visual" ? "flex overflow-hidden rounded-[1.4rem] sm:block" : "rounded-2xl"}`}
      >
        {variant === "visual" ? (
          <>
            <OptionVisual option={option} stepId={stepId} className="w-28 shrink-0 self-stretch min-[400px]:w-32 sm:aspect-[4/3] sm:w-full" />
            <span className="flex flex-1 items-start justify-between gap-3 p-4 sm:gap-4 sm:p-5">
              <span>
                <span className="block font-serif text-[1.3rem] leading-tight text-chocolate sm:text-[1.45rem]">{option.label}</span>
                {option.description && (
                  <span className="mt-1.5 block text-sm leading-relaxed text-cocoa">{option.description}</span>
                )}
              </span>
              <Check selected={selected} multiple={mode === "multiple"} />
            </span>
          </>
        ) : (
          <span className="relative flex min-h-[4.25rem] items-center gap-3 p-3 pr-9 sm:gap-3.5 sm:p-3.5 sm:pr-11">
            <OptionSwatch option={option} selected={selected} />
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-[1.15rem] leading-tight text-chocolate sm:text-[1.2rem]">{option.label}</span>
              {option.description && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-cocoa">{option.description}</span>}
            </span>
            <span className="absolute right-2.5 top-2.5 sm:right-3.5 sm:top-1/2 sm:-translate-y-1/2">
              <Check selected={selected} multiple={mode === "multiple"} />
            </span>
          </span>
        )}
      </button>

      {option.custom && selected && (
        <div className="mt-2 animate-fade-up">
          <label htmlFor={inputId} className="sr-only">
            Précisez « {option.label} »
          </label>
          <input
            id={inputId}
            type="text"
            className="field !min-h-12"
            placeholder="Précisez votre envie…"
            value={customValue}
            maxLength={LIMITS.custom}
            onChange={(e) => onCustomChange(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
