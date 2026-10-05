import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { KeyInfo } from "@/components/home/KeyInfo";
import { EyeIcon, HeartIcon, LeafIcon, SparkIcon, WhiskIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/i18n/metadata";
import { getI18n } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/comment-ca-marche", (t) => t.meta.how);
}

const icons = [SparkIcon, LeafIcon, WhiskIcon, EyeIcon, HeartIcon];

export default async function HowItWorksPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero
        eyebrow={t.how.eyebrow}
        title={
          <>
            {t.how.title1} <em className="text-cocoa">{t.how.title2}</em>
          </>
        }
        intro={t.how.intro}
      />

      <section className="container-page pb-24 md:pb-32">
        <ol className="border-t border-chocolate/12">
          {t.how.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              className="grid gap-3 border-b border-chocolate/12 py-10 md:grid-cols-12 md:items-baseline md:gap-8 md:py-14"
            >
              <span className="font-serif text-6xl italic leading-none text-rose-deep md:col-span-2 md:text-7xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[2rem] leading-tight md:col-span-5 md:text-[2.6rem]">{step.title}</h2>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-cocoa md:col-span-5">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-ivory py-24 md:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow={t.how.whyEyebrow}
            title={
              <>
                {t.how.whyTitle1} <em>{t.how.whyTitle2}</em>
              </>
            }
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {t.why.map((item, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal as="li" key={item.title} delay={i * 70} className="rounded-[1.6rem] bg-cream p-7">
                  <Icon className="h-6 w-6 text-rose-deep" />
                  <h3 className="mt-8 text-[1.5rem] leading-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa">{item.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <KeyInfo />
      <FinalCTA />
    </>
  );
}
