import type { Metadata } from "next";
import { ConfiguratorEditor } from "@/components/admin/ConfiguratorEditor";
import { getContent } from "@/server/content/store";

export const metadata: Metadata = { title: "Configurateur" };

export default async function ConfiguratorAdminPage() {
  const { steps } = await getContent();
  return <ConfiguratorEditor initial={steps} />;
}
