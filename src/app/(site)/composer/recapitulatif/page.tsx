import type { Metadata } from "next";
import { RecapView } from "@/components/configurator/RecapView";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/composer/recapitulatif", (t) => t.meta.recap, { noIndex: true });
}

export default function RecapPage() {
  return <RecapView />;
}
