import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { saveMedia } from "@/server/media";

export const runtime = "nodejs";

/** Envoi d'une photo depuis l'admin → renvoie son URL publique. */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  try {
    return NextResponse.json({ url: await saveMedia(file) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Envoi impossible." }, { status: 400 });
  }
}
