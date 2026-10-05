import type { Metadata } from "next";
import { ConfirmationView } from "@/components/configurator/ConfirmationView";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/composer/confirmation", (t) => t.meta.confirmation, { noIndex: true });
}

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
