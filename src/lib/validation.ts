/**
 * Règles de validation partagées entre le navigateur et le serveur
 * (sans dépendance, pour garder le bundle client léger).
 */
import { checkPickupDate } from "./dates";
import { cleanPhone, missingVariants } from "./composition";
import { fr, type Dictionary } from "@/i18n/dictionaries/fr";
import type { CompositionDraft, CompositionStep, CustomerInfo, SiteInfo } from "./types";

type Messages = Dictionary["validation"];

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
  m: Messages = fr.validation,
  /** `false` pour les commandes sans nombre de personnes (Helwa). */
  withServings = true,
): FieldErrors<keyof CustomerInfo> {
  const errors: FieldErrors<keyof CustomerInfo> = {};

  if (!customer.firstName.trim()) errors.firstName = m.firstName;
  else if (customer.firstName.length > LIMITS.name) errors.firstName = m.firstNameLong;

  if (!customer.lastName.trim()) errors.lastName = m.lastName;
  else if (customer.lastName.length > LIMITS.name) errors.lastName = m.lastNameLong;

  if (!customer.email.trim()) errors.email = m.email;
  else if (!EMAIL_RE.test(customer.email.trim()) || customer.email.length > LIMITS.email)
    errors.email = m.emailInvalid;

  const phone = cleanPhone(customer.phone);
  if (!phone) errors.phone = m.phone;
  else if (phone.replace("+", "").length < 9 || phone.length > LIMITS.phone)
    errors.phone = m.phoneInvalid;

  if (!customer.pickupDate) errors.pickupDate = m.date;
  else {
    const status = checkPickupDate(customer.pickupDate, site, now);
    if (status === "too-soon")
      errors.pickupDate = m.tooSoon(site.minLeadDays);
    else if (status === "unavailable") errors.pickupDate = m.dateUnavailable;
    else if (status === "invalid") errors.pickupDate = m.dateInvalid;
  }

  if (!customer.pickupSlot) errors.pickupSlot = m.slot;
  else if (!site.pickupSlots.some((s) => s.id === customer.pickupSlot)) errors.pickupSlot = m.slotUnknown;

  if (withServings) {
    const servings = Number(customer.servings);
    if (!customer.servings) errors.servings = m.servings;
    else if (!Number.isInteger(servings) || servings < 1 || servings > LIMITS.servingsMax)
      errors.servings = m.servingsInvalid;
  }

  if (customer.message.length > LIMITS.message) errors.message = m.messageLong;

  return errors;
}

/** Vérifie la composition : étapes obligatoires, identifiants connus, mode de sélection. */
export function validateComposition(
  steps: CompositionStep[],
  draft: CompositionDraft,
  m: Messages = fr.validation,
): string | null {
  for (const step of steps) {
    const ids = draft.selections[step.id] ?? [];
    if (step.required && ids.length === 0) return m.stepChoose(step.name);
    if (step.mode === "single" && ids.length > 1) return m.stepSingle(step.name);
    const known = new Set(step.groups.flatMap((g) => g.options.map((o) => o.id)));
    if (ids.some((id) => !known.has(id))) return m.stepUnknown(step.name);
    if ((draft.notes[step.id]?.length ?? 0) > LIMITS.notes) return m.stepNotesLong(step.name);
    const missing = missingVariants(step, draft)[0];
    if (missing) return m.stepFlavor(step.name, missing.variantsLabel ?? "saveur", missing.label);
  }
  if (Object.values(draft.customValues).some((v) => v.length > LIMITS.custom)) return m.customLong;
  return null;
}

export function isStepComplete(step: CompositionStep, draft: CompositionDraft): boolean {
  return !step.required || (draft.selections[step.id]?.length ?? 0) > 0;
}
