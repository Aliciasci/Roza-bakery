import { AdminShell } from "@/components/admin/AdminShell";
import { StorageWarning } from "@/components/admin/StorageWarning";
import { getOrderRepository } from "@/server/orders/repository";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const newOrders = (await getOrderRepository().list()).filter((o) => o.status === "nouvelle").length;
  return (
    <AdminShell newOrders={newOrders}>
      <StorageWarning />
      {children}
    </AdminShell>
  );
}
