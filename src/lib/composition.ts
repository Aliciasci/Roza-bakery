import type { CompositionDraft, CompositionStep, ConfigOption, ResolvedStep } from "./types";

export function findOption(step: CompositionStep, optionId: string): ConfigOption | undefined {
  for (const group of step.groups) {
    const option = group.options.find((o) => o.id === optionId);
    if (option) return option;
  }
  return undefined;
}

/** Libellé lisible d'une option, avec la précision saisie pour les options « Autre ». */
export function optionDisplayLabel(option: ConfigOption, customValues: Record<string, string>): string {
  const custom = customValues[option.id]?.trim();
  return option.custom && custom ? `${option.label} : ${custom}` : option.label;
}

/** Transforme les identifiants choisis en libellés lisibles, étape par étape. */
export function resolveComposition(steps: CompositionStep[], draft: CompositionDraft): ResolvedStep[] {
  return steps.map((step) => {
    const ids = draft.selections[step.id] ?? [];
    const items = ids
      .map((id) => findOption(step, id))
      .filter((o): o is ConfigOption => Boolean(o))
      .map((o) => optionDisplayLabel(o, draft.customValues));
    const notes = draft.notes[step.id]?.trim();
    return { stepId: step.id, label: step.summaryLabel, items, notes: notes || undefined };
  });
}

export function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}
