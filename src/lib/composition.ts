import type { CompositionDraft, CompositionStep, ConfigOption, ResolvedStep } from "./types";

export function findOption(step: CompositionStep, optionId: string): ConfigOption | undefined {
  for (const group of step.groups) {
    const option = group.options.find((o) => o.id === optionId);
    if (option) return option;
  }
  return undefined;
}

/** Libellé lisible d'une option : saveur choisie et précision saisie pour les options « Autre ». */
export function optionDisplayLabel(
  option: ConfigOption,
  customValues: Record<string, string>,
  variants: Record<string, string> = {},
): string {
  const chosen = option.variants?.length ? variants[option.id] : undefined;
  // La valeur enregistrée est la saveur française ; on affiche son libellé traduit s'il existe
  const variant = chosen ? (option.variantLabels?.[option.variants!.indexOf(chosen)] ?? chosen) : undefined;
  const custom = customValues[option.id]?.trim();
  let label = variant ? `${option.label} — ${variant}` : option.label;
  if (option.custom && custom) label += ` : ${custom}`;
  return label;
}

/** Options choisies dans une étape dont la saveur n'a pas encore été sélectionnée. */
export function missingVariants(step: CompositionStep, draft: CompositionDraft): ConfigOption[] {
  return (draft.selections[step.id] ?? [])
    .map((id) => findOption(step, id))
    .filter((o): o is ConfigOption => Boolean(o?.variants?.length))
    .filter((o) => !o.variants!.includes(draft.variants?.[o.id] ?? ""));
}

/** Transforme les identifiants choisis en libellés lisibles, étape par étape. */
export function resolveComposition(steps: CompositionStep[], draft: CompositionDraft): ResolvedStep[] {
  return steps.map((step) => {
    const ids = draft.selections[step.id] ?? [];
    const items = ids
      .map((id) => findOption(step, id))
      .filter((o): o is ConfigOption => Boolean(o))
      .map((o) => optionDisplayLabel(o, draft.customValues, draft.variants));
    const notes = draft.notes[step.id]?.trim();
    return { stepId: step.id, label: step.summaryLabel, items, notes: notes || undefined };
  });
}

export function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}
