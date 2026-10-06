import type { Metadata } from "next";
import { HelwaCatalog } from "@/components/helwa/HelwaCatalog";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/i18n/metadata";
import { getI18n } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/helwa", (t) => t.meta.helwa);
}

export default async function HelwaPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero
        eyebrow={t.helwa.eyebrow}
        title={
          <>
            {t.helwa.title1} <em className="text-cocoa">{t.helwa.title2}</em>
          </>
        }
        intro={t.helwa.intro}
      />
      <section className="container-page pb-36 lg:pb-28">
        <HelwaCatalog />
      </section>
    </>
  );
}
