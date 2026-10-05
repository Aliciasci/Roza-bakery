"use client";

import { Fragment, useState, type KeyboardEvent } from "react";
import { PlusIcon } from "@/components/ui/Icons";
import { missingVariants } from "@/lib/composition";
import { LIMITS } from "@/lib/validation";
import type { CompositionStep } from "@/lib/types";
import { useConfigurator } from "./ConfiguratorProvider";
import { FlavorPicker, OptionCard } from "./OptionCard";
import { PhotoUploader } from "./PhotoUploader";

/** Navigation au clavier (flèches) entre les cartes d'un même groupe. */
function onGroupKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
  if (!keys.includes(e.key)) return;
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-option]"));
  const index = items.indexOf(document.activeElement as HTMLButtonElement);
  if (index < 0) return;
  e.preventDefault();
  const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
  items[(index + delta + items.length) % items.length]?.focus();
}

export function OptionStep({ step, error }: { step: CompositionStep; error?: string | null }) {
  const { draft, toggleOption, setCustomValue, setVariant, setNotes, photos, setPhotos, site } = useConfigurator();
  const missing = new Set(missingVariants(step, draft).map((o) => o.id));
  const selected = draft.selections[step.id] ?? [];
  const notes = draft.notes[step.id] ?? "";
  const hasNotesLabel = Boolean(step.notesLabel);
  const [notesOpen, setNotesOpen] = useState(hasNotesLabel || notes.length > 0);

  const visual = step.groups.some((g) => g.options.some((o) => o.description));
  const notesId = `notes-${step.id}`;

  return (
    <div className="space-y-10">
      {step.groups.map((group) => {
        const labelId = `group-${group.id}`;
        return (
          <section key={group.id} aria-labelledby={group.label ? labelId : undefined}>
            {group.label && (
              <div className="mb-4 flex items-center gap-4">
                <h3 id={labelId} className="eyebrow !text-chocolate">
                  {group.label}
                </h3>
                <span aria-hidden className="rule flex-1" />
              </div>
            )}
            <div
              role={step.mode === "single" ? "radiogroup" : "group"}
              aria-label={group.label ?? step.title}
              aria-describedby={error ? `error-${step.id}` : undefined}
              onKeyDown={onGroupKeyDown}
              className={`grid grid-flow-row-dense gap-3 ${
                visual ? "sm:grid-cols-2 xl:grid-cols-3 md:gap-4" : "grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {group.options.map((option, i) => {
                const isSelected = selected.includes(option.id);
                return (
                  <Fragment key={option.id}>
                    <div className="h-full animate-fade-up" style={{ animationDelay: `${80 + i * 40}ms` }}>
                      <OptionCard
                        option={option}
                        stepId={step.id}
                        mode={step.mode}
                        layout={visual ? "visual" : "compact"}
                        selected={isSelected}
                        customValue={draft.customValues[option.id]}
                        onToggle={() => toggleOption(step, option.id)}
                        onCustomChange={(v) => setCustomValue(option.id, v)}
                      />
                    </div>
                    {/* Choix de la saveur : toute la largeur, sans étirer les cartes voisines */}
                    {isSelected && option.variants?.length ? (
                      <div className="col-span-full">
                        <FlavorPicker
                          option={option}
                          flavor={draft.variants?.[option.id]}
                          flavorMissing={Boolean(error) && missing.has(option.id)}
                          onFlavorChange={(v) => setVariant(option.id, v)}
                        />
                      </div>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          </section>
        );
      })}

      {error && (
        <p id={`error-${step.id}`} role="alert" className="animate-fade-in text-sm font-medium text-berry">
          {error}
        </p>
      )}

      {step.allowInspiration && (
        <PhotoUploader files={photos} onChange={setPhotos} max={site.maxInspirationPhotos} />
      )}

      <div>
        {notesOpen ? (
          <div className="animate-fade-up">
            <label htmlFor={notesId} className="mb-2 block font-serif text-xl text-chocolate">
              {step.notesLabel ?? "Une précision ?"}
              <span className="ml-2 font-sans text-xs font-normal text-cocoa">(facultatif)</span>
            </label>
            <textarea
              id={notesId}
              rows={3}
              className="field resize-y"
              placeholder={step.notesPlaceholder ?? "Ajoutez un détail, une envie particulière…"}
              value={notes}
              maxLength={LIMITS.notes}
              onChange={(e) => setNotes(step.id, e.target.value)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-chocolate underline decoration-chocolate/25 underline-offset-[6px] hover:decoration-chocolate"
          >
            <PlusIcon className="h-4 w-4" />
            Ajouter une précision
          </button>
        )}
      </div>
    </div>
  );
}
