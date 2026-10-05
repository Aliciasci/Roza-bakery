import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/Configurator";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/composer", (t) => t.meta.composer);
}

export default function ComposerPage() {
  return <Configurator />;
}
