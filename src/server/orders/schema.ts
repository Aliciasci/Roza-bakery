import { z } from "zod";
import { LIMITS } from "@/lib/validation";

// Les étapes sont éditables dans l'admin : les identifiants inconnus sont rejetés ensuite par validateComposition.
const stepId = z.string().max(80);

const selections = z.record(stepId, z.array(z.string().max(80)).max(20));
const notes = z.record(stepId, z.string().max(LIMITS.notes));

/** Forme attendue du JSON envoyé par le configurateur (les règles métier sont vérifiées ensuite). */
export const orderPayloadSchema = z.object({
  selections,
  customValues: z.record(z.string().max(80), z.string().max(LIMITS.custom)).default({}),
  variants: z.record(z.string().max(80), z.string().max(80)).default({}),
  notes: notes.default({}),
  locale: z.enum(["fr", "kab"]).default("fr"),
  customer: z.object({
    firstName: z.string().trim().max(LIMITS.name),
    lastName: z.string().trim().max(LIMITS.name),
    email: z.string().trim().max(LIMITS.email),
    phone: z.string().trim().max(LIMITS.phone),
    pickupDate: z.string().max(10),
    pickupSlot: z.string().max(40),
    servings: z.coerce.string().max(4),
    message: z.string().max(LIMITS.message).default(""),
  }),
});

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
