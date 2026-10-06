import type { Metadata } from "next";
import { HelwaEditor } from "@/components/admin/HelwaEditor";
import { getContent } from "@/server/content/store";

export const metadata: Metadata = { title: "Helwa" };

export default async function HelwaAdminPage() {
  const { helwa } = await getContent();
  return <HelwaEditor initial={helwa} />;
}
