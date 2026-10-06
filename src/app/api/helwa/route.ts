import { NextResponse } from "next/server";
import { OrderValidationError } from "@/server/orders/create-order";
import { createHelwaOrder, helwaPayloadSchema } from "@/server/orders/create-helwa-order";

export const runtime = "nodejs";

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return error("Données de commande illisibles.");
  }

  // Pot de miel anti-spam : un humain ne remplit jamais ce champ
  if (json && typeof json === "object" && String((json as { website?: unknown }).website ?? "").trim()) {
    return NextResponse.json({ reference: "RZ-OK" });
  }

  const parsed = helwaPayloadSchema.safeParse(json);
  if (!parsed.success) return error("Certaines informations sont invalides. Merci de vérifier votre commande.");

  try {
    const order = await createHelwaOrder(parsed.data);
    return NextResponse.json({ reference: order.reference, total: order.helwa?.total }, { status: 201 });
  } catch (err) {
    if (err instanceof OrderValidationError) return error(err.message, 422);
    console.error("[api/helwa]", err);
    return error("Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.", 500);
  }
}
