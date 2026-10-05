import type { Metadata } from "next";
import { PhotosEditor } from "@/components/admin/PhotosEditor";
import { getContent } from "@/server/content/store";

export const metadata: Metadata = { title: "Photos du site" };

export default async function PhotosAdminPage() {
  const { photos } = await getContent();
  return <PhotosEditor initial={photos} />;
}
