import type { Metadata } from "next";
import { FaqEditor } from "@/components/admin/FaqEditor";
import { getContent } from "@/server/content/store";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqAdminPage() {
  const { faq } = await getContent();
  return <FaqEditor initial={faq} />;
}
