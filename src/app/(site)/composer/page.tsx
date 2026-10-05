import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/Configurator";

export const metadata: Metadata = {
  title: "Composer mon gâteau personnalisé",
  description:
    "Composez votre gâteau sur mesure étape par étape : génoise, crème, inserts, croustillant, fruits, finition et décoration. Roza Bakery confirme ensuite le prix et la disponibilité.",
  alternates: { canonical: "/composer" },
};

export default function ComposerPage() {
  return <Configurator />;
}
