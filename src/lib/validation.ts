/**
 * Règles de validation partagées entre le navigateur et le serveur
 * (sans dépendance, pour garder le bundle client léger).
 */
import { checkPickupDate } from "./dates";
import { cleanPhone } from "./composition";
import type { CompositionDraft, CompositionStep, CustomerInfo, SiteInfo } from "./types";

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: 80,
  email: 160,
  phone: 30,
  message: 2000,
  notes: 1000,
  custom: 200,
  servingsMax: 500,
} as const;

export function validateCustomer(
  customer: CustomerInfo,
  site: Pick<SiteInfo, "minLeadDays" | "recommendedLeadDays" | "closedWeekdays" | "unavailableDates" | "pickupSlots">,
  now?: Date,
): FieldErrors<keyof CustomerInfo> {
  const errors: FieldErrors<keyof CustomerInfo> = {};

  if (!customer.firstName.trim()) errors.firstName = "Merci d'indiquer votre prénom.";
  else if (customer.firstName.length > LIMITS.name) errors.firstName = "Prénom trop long.";

  if (!customer.lastName.trim()) errors.lastName = "Merci d'indiquer votre nom.";
  else if (customer.lastName.length > LIMITS.name) errors.lastName = "Nom trop long.";

  if (!customer.email.trim()) errors.email = "Merci d'indiquer votre adresse email.";
  else if (!EMAIL_RE.test(customer.email.trim()) || customer.email.length > LIMITS.email)
    errors.email = "Cette adresse email ne semble pas valide.";

  const phone = cleanPhone(customer.phone);
  if (!phone) errors.phone = "Merci d'indiquer votre numéro de téléphone.";
  else if (phone.replace("+", "").length < 9 || phone.length > LIMITS.phone)
    errors.phone = "Ce numéro de téléphone ne semble pas valide.";

  if (!customer.pickupDate) errors.pickupDate = "Merci de choisir une date de retrait.";
  else {
    const status = checkPickupDate(customer.pickupDate, site, now);
    if (status === "too-soon")
      errors.pickupDate = `Les commandes doivent être passées au minimum ${site.minLeadDays} jours à l'avance.`;
    else if (status === "unavailable") errors.pickupDate = "Cette date n'est pas disponible pour un retrait.";
    else if (status === "invalid") errors.pickupDate = "Cette date n'est pas valide.";
  }

  if (!customer.pickupSlot) errors.pickupSlot = "Merci de choisir un créneau de retrait.";
  else if (!site.pickupSlots.some((s) => s.id === customer.pickupSlot)) errors.pickupSlot = "Créneau inconnu.";

  const servings = Number(customer.servings);
  if (!customer.servings) errors.servings = "Merci d'indiquer le nombre de personnes.";
  else if (!Number.isInteger(servings) || servings < 1 || servings > LIMITS.servingsMax)
    errors.servings = "Nombre de personnes invalide.";

  if (customer.message.length > LIMITS.message) errors.message = "Message trop long.";

  return errors;
}

/** Vérifie la composition : étapes obligatoires, identifiants connus, mode de sélection. */
export function validateComposition(steps: CompositionStep[], draft: CompositionDraft): string | null {
  for (const step of steps) {
    const ids = draft.selections[step.id] ?? [];
    if (step.required && ids.length === 0) return `Étape « ${step.name} » : merci de faire un choix.`;
    if (step.mode === "single" && ids.length > 1) return `Étape « ${step.name} » : un seul choix possible.`;
    const known = new Set(step.groups.flatMap((g) => g.options.map((o) => o.id)));
    if (ids.some((id) => !known.has(id))) return `Étape « ${step.name} » : option inconnue.`;
    if ((draft.notes[step.id]?.length ?? 0) > LIMITS.notes) return `Étape « ${step.name} » : précisions trop longues.`;
  }
  if (Object.values(draft.customValues).some((v) => v.length > LIMITS.custom)) return "Une précision est trop longue.";
  return null;
}

export function isStepComplete(step: CompositionStep, draft: CompositionDraft): boolean {
  return !step.required || (draft.selections[step.id]?.length ?? 0) > 0;
}
