import type { Metadata } from "next";
import { RecapView } from "@/components/configurator/RecapView";

export const metadata: Metadata = {
  title: "Récapitulatif de ma demande",
  robots: { index: false, follow: false },
};

export default function RecapPage() {
  return <RecapView />;
}
