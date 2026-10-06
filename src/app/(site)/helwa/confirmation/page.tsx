import type { Metadata } from "next";
import { HelwaConfirmation } from "@/components/helwa/HelwaConfirmation";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/helwa/confirmation", (t) => t.meta.helwaConfirmation, { noIndex: true });
}

export default function HelwaConfirmationPage() {
  return <HelwaConfirmation />;
}
