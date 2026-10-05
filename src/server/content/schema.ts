import { z } from "zod";
import { toneColors } from "@/lib/tones";
import type { Tone } from "@/lib/types";

/** Schémas de validation du contenu édité dans l'admin. */

const tone = z.enum(Object.keys(toneColors) as [Tone, ...Tone[]]);
const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide (#rrggbb)")
  .optional()
  .or(z.literal("").transform(() => undefined));
const id = z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/, "Identifiant invalide");
const image = z
  .string()
  .max(300)
  .regex(/^\/(media|images)\/[\w./-]+$/, "Image invalide")
  .optional()
  .or(z.literal("").transform(() => undefined));
const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const optionSchema = z.object({
  id,
  label: text(80).min(1, "Chaque option doit avoir un nom"),
  description: optionalText(200),
  tone,
  color: hex,
  image,
  custom: z.boolean().optional(),
  available: z.boolean().optional(),
  variants: z
    .array(text(60).min(1))
    .max(40)
    .optional()
    .transform((v) => (v && v.length ? Array.from(new Set(v)) : undefined)),
  variantsLabel: optionalText(40),
});

export const groupSchema = z.object({
  id,
  label: optionalText(80),
  description: optionalText(200),
  options: z.array(optionSchema).max(60),
});

export const stepSchema = z.object({
  id: z.enum(["base", "creme", "inserts", "croustillant", "fruits", "supplements", "exterieur", "decoration"]),
  name: text(80).min(1),
  title: text(120).min(1),
  subtitle: text(300),
  mode: z.enum(["single", "multiple"]),
  required: z.boolean(),
  groups: z.array(groupSchema).min(1, "Chaque étape doit avoir au moins un groupe").max(10),
  summaryLabel: text(40).min(1),
  notesLabel: optionalText(120),
  notesPlaceholder: optionalText(200),
  allowInspiration: z.boolean().optional(),
});

export const stepsSchema = z
  .array(stepSchema)
  .length(8)
  .superRefine((steps, ctx) => {
    const seen = new Set<string>();
    for (const s of steps)
      for (const g of s.groups)
        for (const o of g.options) {
          if (seen.has(o.id)) ctx.addIssue({ code: "custom", message: `Identifiant en double : ${o.id}` });
          seen.add(o.id);
        }
  });

export const creationSchema = z.object({
  id,
  name: text(120).min(1, "Chaque création doit avoir un nom"),
  description: text(400),
  categories: z.array(id).max(10),
  image,
  ratio: z.enum(["portrait", "square", "tall"]),
  tone,
  color: hex,
  placeholder: z.boolean().optional(),
});

export const creationsSchema = z.object({
  creations: z.array(creationSchema).max(300),
  categories: z.array(z.object({ id, label: text(40).min(1) })).max(30),
});

export const faqSchema = z.array(
  z.object({
    id,
    question: text(200).min(1, "Question vide"),
    answer: text(2000).min(1, "Réponse vide"),
    placeholder: z.boolean().optional(),
  }),
);

export const photosSchema = z.object({
  heroImage: image,
  heroImageAlt: optionalText(160),
  aboutImage: image,
  aboutImageAlt: optionalText(160),
});

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => (v ? v : null));

export const siteSchema = z.object({
  name: text(80).min(1),
  shortDescription: text(300),
  city: nullableText(80),
  address: nullableText(200),
  email: z
    .string()
    .trim()
    .max(160)
    .nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Email invalide"),
  phone: nullableText(30),
  instagramHandle: nullableText(60),
  instagramUrl: z
    .string()
    .trim()
    .max(200)
    .nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^https:\/\//.test(v), "Le lien Instagram doit commencer par https://"),
  openingHours: z
    .array(text(120))
    .nullable()
    .transform((v) => (v && v.filter(Boolean).length ? v.filter(Boolean) : null)),
  minLeadDays: z.number().int().min(0).max(60),
  recommendedLeadDays: z.number().int().min(0).max(90),
  closedWeekdays: z.array(z.number().int().min(0).max(6)).max(7),
  unavailableDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(400),
  pickupSlots: z
    .array(z.object({ id, label: text(40).min(1), hint: optionalText(80) }))
    .min(1, "Au moins un créneau de retrait"),
  maxInspirationPhotos: z.number().int().min(0).max(10),
});
