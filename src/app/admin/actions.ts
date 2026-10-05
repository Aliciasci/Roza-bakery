"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { CompositionStep, Creation, CreationCategoryInfo, FaqItem, OrderStatus, SiteInfo } from "@/lib/types";
import { requireAdmin } from "@/server/auth";
import { checkPassword, createSessionToken, adminConfigured, SESSION_COOKIE, SESSION_DURATION_S } from "@/server/auth/session";
import { creationsSchema, faqSchema, siteSchema, stepsSchema } from "@/server/content/schema";
import { updateContent } from "@/server/content/store";
import { getOrderRepository } from "@/server/orders/repository";

export type ActionResult = { ok: true } | { ok: false; error: string };

/* -------------------------------------------------------------------------- */
/* Connexion                                                                   */
/* -------------------------------------------------------------------------- */

export async function login(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  if (!adminConfigured()) return { error: "L'administration n'est pas configurée (ADMIN_PASSWORD manquant)." };
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // freine les essais répétés
    return { error: "Mot de passe incorrect." };
  }
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_S,
  });
  const next = String(form.get("suite") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/connexion");
}

/* -------------------------------------------------------------------------- */
/* Contenu                                                                     */
/* -------------------------------------------------------------------------- */

function firstIssue(error: z.ZodError) {
  const issue = error.issues[0];
  return issue ? issue.message : "Données invalides.";
}

async function guarded(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await requireAdmin();
    await fn();
    // Le site public est régénéré avec le nouveau contenu
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { ok: false, error: firstIssue(err) };
    console.error("[admin]", err);
    return { ok: false, error: err instanceof Error ? err.message : "Enregistrement impossible." };
  }
}

export async function saveSteps(steps: CompositionStep[]) {
  return guarded(async () => {
    await updateContent("steps", stepsSchema.parse(steps) as CompositionStep[]);
  });
}

export async function saveCreations(data: { creations: Creation[]; categories: CreationCategoryInfo[] }) {
  return guarded(async () => {
    const parsed = creationsSchema.parse(data);
    const known = new Set(parsed.categories.map((c) => c.id));
    // Retire des créations les catégories supprimées
    const creations = parsed.creations.map((c) => ({ ...c, categories: c.categories.filter((id) => known.has(id)) }));
    await updateContent("categories", parsed.categories);
    await updateContent("creations", creations as Creation[]);
  });
}

export async function saveFaq(items: FaqItem[]) {
  return guarded(async () => {
    await updateContent("faq", faqSchema.parse(items));
  });
}

export async function saveSite(site: SiteInfo) {
  return guarded(async () => {
    const parsed = siteSchema.parse(site);
    if (parsed.recommendedLeadDays < parsed.minLeadDays)
      throw new Error("Le délai conseillé doit être supérieur ou égal au délai minimum.");
    await updateContent("site", parsed);
  });
}

/* -------------------------------------------------------------------------- */
/* Commandes                                                                   */
/* -------------------------------------------------------------------------- */

const orderPatchSchema = z.object({
  status: z.enum(["nouvelle", "en-etude", "confirmee", "refusee", "prete", "retiree"]),
  confirmedPrice: z.number().min(0).max(100000).nullable(),
  adminNotes: z.string().max(5000),
});

export async function updateOrder(
  id: string,
  patch: { status: OrderStatus; confirmedPrice: number | null; adminNotes: string },
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = orderPatchSchema.parse(patch);
    const updated = await getOrderRepository().update(id, parsed);
    if (!updated) return { ok: false, error: "Commande introuvable." };
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { ok: false, error: firstIssue(err) };
    return { ok: false, error: err instanceof Error ? err.message : "Enregistrement impossible." };
  }
}
