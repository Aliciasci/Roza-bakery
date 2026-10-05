import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CakeImage } from "@/components/ui/CakeImage";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { whyUs } from "@/content/process";

export const metadata: Metadata = {
  title: "À propos — pâtisserie artisanale",
  description: "Découvrez Roza Bakery, pâtisserie artisanale et cake design : des gâteaux personnalisés, réalisés à la main et sur mesure.",
  alternates: { canonical: "/a-propos" },
};

/**
 * ⚠️ Les blocs marqués « placeholder-text » attendent les textes réels de Roza Bakery
 * (histoire, parcours, prénom, ville…). Aucune information n'a été inventée.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title={
          <>
            Une pâtisserie <em className="text-cocoa">faite à la main</em>
          </>
        }
        intro="Roza Bakery imagine et réalise des gâteaux personnalisés, pensés pour célébrer vos plus beaux moments."
      />

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-5">
            <CakeImage alt="Portrait de la pâtissière de Roza Bakery" tone="sage" shape="aspect-[4/5] arch" placeholderLabel="Portrait à venir" />
          </Reveal>
          <Reveal delay={100} className="lg:col-span-6 lg:col-start-7">
            <p className="script text-4xl text-rose-deep">notre histoire</p>
            <h2 className="mt-3 text-headline">
              Derrière <em>chaque gâteau</em>
            </h2>
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-cocoa">
              <p>
                <span className="placeholder-text">
                  [À compléter par Roza Bakery : l&apos;histoire de la pâtisserie, la personne derrière les créations, ses débuts.]
                </span>
              </p>
              <p>
                <span className="placeholder-text">
                  [À compléter : la philosophie de travail, les inspirations, ce qui rend chaque création unique.]
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-chocolate py-24 text-cream md:py-32">
        <div className="container-page">
          <p className="eyebrow !text-cream/60">Nos valeurs</p>
          <h2 className="mt-4 max-w-2xl text-headline text-cream">
            L&apos;attention <em>à chaque détail</em>
          </h2>
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 70} className="border-t border-cream/15 pt-6">
                <span className="font-serif text-xl italic text-rose">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[1.75rem] leading-tight text-cream">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-cream/70">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
