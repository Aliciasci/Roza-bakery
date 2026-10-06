import type { Metadata } from "next";
import { HelwaOrder } from "@/components/helwa/HelwaOrder";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/helwa/commande", (t) => t.meta.helwaOrder, { noIndex: true });
}

export default function HelwaOrderPage() {
  return <HelwaOrder />;
}
