import type { Metadata } from "next";
import { CreationsGallery } from "@/components/creations/CreationsGallery";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHero } from "@/components/ui/PageHero";
import { getCreationCategories, getCreations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos créations — cake design & gâteaux sur mesure",
  description:
    "Galerie des créations Roza Bakery : wedding cakes, gâteaux d'anniversaire, cake design, gâteaux floraux, chocolat et créations personnalisées.",
  alternates: { canonical: "/creations" },
};

export default async function CreationsPage() {
  const [creations, categories] = await Promise.all([getCreations(), getCreationCategories()]);
  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title={
          <>
            Nos <em className="text-cocoa">créations</em>
          </>
        }
        intro="Chaque gâteau est imaginé pour une personne, une fête, une histoire. Laissez-vous inspirer, puis composez le vôtre."
      />
      <section className="container-page pb-10">
        <CreationsGallery creations={creations} categories={categories} />
      </section>
      <FinalCTA title={<>Un coup de cœur ? <em>Créons le vôtre</em></>} />
    </>
  );
}
