import { z } from "zod";
import { LIMITS } from "@/lib/validation";

const stepIds = ["base", "creme", "inserts", "croustillant", "fruits", "supplements", "exterieur", "decoration"] as const;

const selections = z.partialRecord(z.enum(stepIds), z.array(z.string().max(80)).max(20));
const notes = z.partialRecord(z.enum(stepIds), z.string().max(LIMITS.notes));

/** Forme attendue du JSON envoyé par le configurateur (les règles métier sont vérifiées ensuite). */
export const orderPayloadSchema = z.object({
  selections,
  customValues: z.record(z.string().max(80), z.string().max(LIMITS.custom)).default({}),
  notes: notes.default({}),
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
