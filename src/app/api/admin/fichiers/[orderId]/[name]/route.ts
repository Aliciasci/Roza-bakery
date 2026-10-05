import { readFile } from "node:fs/promises";
import { isAdmin } from "@/server/auth";
import { getOrderRepository } from "@/server/orders/repository";

/** Photos d'inspiration jointes aux commandes — accessibles uniquement à l'admin. */
export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string; name: string }> }) {
  if (!(await isAdmin())) return new Response("Non autorisé", { status: 401 });
  const { orderId, name } = await params;
  const repo = getOrderRepository();
  const order = await repo.get(orderId);
  const meta = order?.inspirationFiles.find((f) => f.storedAs?.endsWith(`/${name}`));
  const file = meta && repo.filePath(orderId, name);
  if (!file) return new Response("Introuvable", { status: 404 });
  try {
    const data = await readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": meta.type || "application/octet-stream",
        "Content-Disposition": `inline; filename="${name}"`,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
