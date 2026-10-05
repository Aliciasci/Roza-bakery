import "server-only";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Order } from "@/lib/types";

export type OrderPatch = Partial<Pick<Order, "status" | "confirmedPrice" | "adminNotes">>;

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: Buffer;
}

/**
 * Contrat de stockage des commandes.
 *
 * Implémentation actuelle : fichiers JSON locaux (`/data`), idéale en développement
 * ou sur un serveur avec disque persistant.
 *
 * Pour la production serverless (Vercel…), créer une implémentation
 * `PostgresOrderRepository` / `SupabaseOrderRepository` respectant cette interface
 * (+ stockage des photos sur S3 / Supabase Storage / Vercel Blob) et la brancher
 * dans `getOrderRepository()`. Le futur back-office utilise `list`, `get`, `update` et `filePath`.
 */
export interface OrderRepository {
  save(order: Order, files: UploadedFile[]): Promise<Order>;
  list(): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  update(id: string, patch: OrderPatch): Promise<Order | null>;
  /** Chemin absolu d'un fichier joint (photo d'inspiration), ou null. */
  filePath(orderId: string, name: string): string | null;
}

const DATA_DIR = path.join(process.cwd(), "data");

function safeName(name: string) {
  return name.normalize("NFKD").replace(/[^\w.-]+/g, "_").slice(-80) || "photo";
}

class FileOrderRepository implements OrderRepository {
  private ordersDir = path.join(DATA_DIR, "orders");
  private uploadsDir = path.join(DATA_DIR, "uploads");

  async save(order: Order, files: UploadedFile[]) {
    await mkdir(this.ordersDir, { recursive: true });
    if (files.length) {
      const dir = path.join(this.uploadsDir, order.id);
      await mkdir(dir, { recursive: true });
      order.inspirationFiles = await Promise.all(
        files.map(async (f, i) => {
          const storedAs = `${i + 1}-${safeName(f.name)}`;
          await writeFile(path.join(dir, storedAs), f.data);
          return { name: f.name, type: f.type, size: f.size, storedAs: `uploads/${order.id}/${storedAs}` };
        }),
      );
    }
    await writeFile(path.join(this.ordersDir, `${order.id}.json`), JSON.stringify(order, null, 2), "utf8");
    return order;
  }

  async list() {
    try {
      const names = (await readdir(this.ordersDir)).filter((n) => n.endsWith(".json"));
      const orders = await Promise.all(names.map((n) => readFile(path.join(this.ordersDir, n), "utf8").then((t) => JSON.parse(t) as Order)));
      return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      return [];
    }
  }

  async get(id: string) {
    if (!/^[\w-]+$/.test(id)) return null;
    try {
      return JSON.parse(await readFile(path.join(this.ordersDir, `${id}.json`), "utf8")) as Order;
    } catch {
      return null;
    }
  }

  async update(id: string, patch: OrderPatch) {
    const order = await this.get(id);
    if (!order) return null;
    const updated: Order = { ...order, ...patch, updatedAt: new Date().toISOString() };
    await writeFile(path.join(this.ordersDir, `${id}.json`), JSON.stringify(updated, null, 2), "utf8");
    return updated;
  }

  filePath(orderId: string, name: string) {
    if (!/^[\w-]+$/.test(orderId) || !/^[\w.-]+$/.test(name) || name.startsWith(".")) return null;
    return path.join(this.uploadsDir, orderId, name);
  }
}

let repository: OrderRepository | null = null;

export function getOrderRepository(): OrderRepository {
  repository ??= new FileOrderRepository();
  return repository;
}
