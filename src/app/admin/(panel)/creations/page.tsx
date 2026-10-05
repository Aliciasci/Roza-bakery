import type { Metadata } from "next";
import { CreationsEditor } from "@/components/admin/CreationsEditor";
import { getContent } from "@/server/content/store";

export const metadata: Metadata = { title: "Créations" };

export default async function CreationsAdminPage() {
  const { creations, categories } = await getContent();
  return <CreationsEditor initial={{ creations, categories }} />;
}
