import type { Metadata } from "next";
import { CreationsPreview } from "@/components/home/CreationsPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { KeyInfo } from "@/components/home/KeyInfo";
import { JsonLd, bakeryJsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/i18n/metadata";
import { getI18n } from "@/i18n/server";
import { getSiteInfo, getSitePhotos } from "@/lib/data";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/", () => ({}));
}

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const [site, photos] = await Promise.all([getSiteInfo(locale), getSitePhotos(locale)]);
  return (
    <>
      <JsonLd data={bakeryJsonLd(site)} />
      <Hero image={photos.heroImage} imageAlt={photos.heroImageAlt} />
      <CreationsPreview />
      <HowItWorks
        items={t.home.howSteps}
        eyebrow={t.home.howEyebrow}
        title={
          <>
            {t.home.howTitle1} <em>{t.home.howTitle2}</em>
          </>
        }
        className="bg-rose-soft/60"
      />
      <KeyInfo />
      <FinalCTA />
    </>
  );
}
