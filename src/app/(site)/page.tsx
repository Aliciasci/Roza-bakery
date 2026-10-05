import { CreateSteps } from "@/components/home/CreateSteps";
import { CreationsPreview } from "@/components/home/CreationsPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { KeyInfo } from "@/components/home/KeyInfo";
import { JsonLd, bakeryJsonLd } from "@/components/seo/JsonLd";
import { howItWorksShort } from "@/content/process";
import { getSiteInfo, getSitePhotos } from "@/lib/data";

export default async function HomePage() {
  const [site, photos] = await Promise.all([getSiteInfo(), getSitePhotos()]);
  return (
    <>
      <JsonLd data={bakeryJsonLd(site)} />
      <Hero image={photos.heroImage} imageAlt={photos.heroImageAlt} />
      <CreateSteps />
      <CreationsPreview />
      <HowItWorks items={howItWorksShort} className="bg-rose-soft/60" />
      <KeyInfo />
      <FinalCTA />
    </>
  );
}
