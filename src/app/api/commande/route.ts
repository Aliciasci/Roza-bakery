import { NextResponse } from "next/server";
import { createOrder, OrderValidationError } from "@/server/orders/create-order";
import type { UploadedFile } from "@/server/orders/repository";
import { orderPayloadSchema } from "@/server/orders/schema";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"];

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("Requête invalide.");
  }

  // Pot de miel anti-spam : un humain ne remplit jamais ce champ
  if (String(form.get("website") ?? "").trim()) {
    return NextResponse.json({ reference: "RZ-OK" });
  }

  let json: unknown;
  try {
    json = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return error("Données de commande illisibles.");
  }

  const parsed = orderPayloadSchema.safeParse(json);
  if (!parsed.success) return error("Certaines informations sont invalides. Merci de vérifier votre demande.");

  const rawFiles = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (rawFiles.length > MAX_FILES) return error("Trop de photos.");
  const files: UploadedFile[] = [];
  for (const f of rawFiles) {
    if (f.size > MAX_FILE_BYTES) return error("Une photo dépasse 8 Mo.");
    if (!ACCEPTED_TYPES.includes(f.type)) return error("Formats acceptés : JPG, PNG, WEBP, HEIC.");
    files.push({ name: f.name, type: f.type, size: f.size, data: Buffer.from(await f.arrayBuffer()) });
  }

  try {
    const order = await createOrder(parsed.data, files);
    return NextResponse.json({ reference: order.reference }, { status: 201 });
  } catch (err) {
    if (err instanceof OrderValidationError) return error(err.message, 422);
    console.error("[api/commande]", err);
    return error("Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.", 500);
  }
}
