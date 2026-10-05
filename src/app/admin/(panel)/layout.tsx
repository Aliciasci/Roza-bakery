import { AdminShell } from "@/components/admin/AdminShell";
import { getOrderRepository } from "@/server/orders/repository";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const newOrders = (await getOrderRepository().list()).filter((o) => o.status === "nouvelle").length;
  return <AdminShell newOrders={newOrders}>{children}</AdminShell>;
}
