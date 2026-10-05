import type { Metadata } from "next";
import { CreationsGallery } from "@/components/creations/CreationsGallery";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/i18n/metadata";
import { getI18n } from "@/i18n/server";
import { getCreationCategories, getCreations } from "@/lib/data";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/creations", (t) => t.meta.creations);
}

export default async function CreationsPage() {
  const { locale, t } = await getI18n();
  const [creations, categories] = await Promise.all([getCreations(locale), getCreationCategories(locale)]);
  return (
    <>
      <PageHero
        eyebrow={t.creations.eyebrow}
        title={
          <>
            {t.creations.title1} <em className="text-cocoa">{t.creations.title2}</em>
          </>
        }
        intro={t.creations.intro}
      />
      <section className="container-page pb-10">
        <CreationsGallery creations={creations} categories={categories} />
      </section>
      <FinalCTA
        title={
          <>
            {t.creations.ctaTitle1} <em>{t.creations.ctaTitle2}</em>
          </>
        }
      />
    </>
  );
}
