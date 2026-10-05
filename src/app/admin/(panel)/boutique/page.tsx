import type { Metadata } from "next";
import { SiteEditor } from "@/components/admin/SiteEditor";
import { getContent } from "@/server/content/store";

export const metadata: Metadata = { title: "Boutique" };

export default async function SiteAdminPage() {
  const { site } = await getContent();
  return <SiteEditor initial={site} />;
}
