import type { Metadata } from "next";
import { ConfirmationView } from "@/components/configurator/ConfirmationView";

export const metadata: Metadata = {
  title: "Demande envoyée",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
