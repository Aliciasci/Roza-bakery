import { NextResponse } from "next/server";
import { z } from "zod";
import { bakeryInbox, getMailer } from "@/server/notifications";
import { contactEmail } from "@/server/notifications/templates";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1, "Merci d'indiquer votre nom.").max(120),
  email: z.email("Adresse email invalide.").max(160),
  phone: z.string().trim().max(30).optional().default(""),
  message: z.string().trim().min(5, "Votre message est un peu court.").max(3000),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const mailer = getMailer();
  const inbox = bakeryInbox();
  try {
    await mailer.send({ to: inbox ?? "roza-bakery@localhost", replyTo: parsed.data.email, ...contactEmail(parsed.data) });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ error: "Envoi impossible pour le moment." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
