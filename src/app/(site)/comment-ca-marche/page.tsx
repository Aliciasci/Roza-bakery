import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { KeyInfo } from "@/components/home/KeyInfo";
import { HeartIcon, LeafIcon, SparkIcon, WhiskIcon, EyeIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howItWorksLong, whyUs } from "@/content/process";

export const metadata: Metadata = {
  title: "Comment commander un gâteau personnalisé",
  description:
    "Imaginez, composez, envoyez votre demande : Roza Bakery confirme le prix et la disponibilité, puis vous récupérez votre gâteau sur place. Commande 3 à 4 jours à l'avance.",
  alternates: { canonical: "/comment-ca-marche" },
};

const icons = [SparkIcon, LeafIcon, WhiskIcon, EyeIcon, HeartIcon];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Comment ça marche"
        title={
          <>
            De l&apos;idée <em className="text-cocoa">au gâteau</em>
          </>
        }
        intro="Une demande simple, une réponse personnalisée. Voici comment se déroule la création de votre gâteau."
      />

      <section className="container-page pb-24 md:pb-32">
        <ol className="border-t border-chocolate/12">
          {howItWorksLong.map((step, i) => (
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
            eyebrow="Notre engagement"
            title={
              <>
                Pourquoi commander chez <em>Roza Bakery</em> ?
              </>
            }
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {whyUs.map((item, i) => {
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
