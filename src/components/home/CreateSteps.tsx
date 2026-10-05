import { CakeCrossSection, type CakeTones } from "@/components/configurator/CakeCrossSection";
import { ButtonLink } from "@/components/ui/Button";
import { CakeImage } from "@/components/ui/CakeImage";
import { Reveal } from "@/components/ui/Reveal";
import { creationSteps } from "@/content/process";

const demoTones: CakeTones = {
  base: "sponge",
  creme: "ganache",
  inserts: ["raspberry"],
  croustillant: ["pistachio", "almond"],
  fruits: ["berry", "strawberry"],
  supplements: ["caramel"],
  exterieur: "white",
  decoration: true,
};

export function CreateSteps({ image, imageAlt }: { image?: string; imageAlt?: string }) {
  return (
    <section className="bg-ivory py-24 md:py-32" aria-labelledby="create-title">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-chocolate/30" />
              Le configurateur
            </p>
            <h2 id="create-title" className="mt-5 text-headline">
              Créez-le <em>à votre image</em>
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-cocoa">
              Sept étapes pour composer un gâteau qui vous ressemble, de la première couche à la dernière fleur.
            </p>
            <div className={`relative mt-10 max-w-sm rounded-[2rem] bg-cream ${image ? "p-3" : "p-6"}`}>
              {image ? (
                <CakeImage
                  src={image}
                  alt={imageAlt || "Coupe d'un gâteau Roza Bakery"}
                  shape="aspect-[4/5] rounded-[1.5rem]"
                  sizes="(min-width: 1024px) 24rem, 92vw"
                />
              ) : (
                <CakeCrossSection tones={demoTones} className="w-full" />
              )}
              <p className="script absolute -top-5 right-6 text-3xl text-rose-deep">couche par couche</p>
            </div>
            <ButtonLink href="/composer" size="lg" arrow className="mt-10 max-lg:!hidden">
              Commencer ma création
            </ButtonLink>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {creationSteps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 50}
              className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-t border-chocolate/12 py-7 last:border-b md:grid-cols-[5rem_1fr] md:py-9"
            >
              <span className="font-serif text-3xl italic text-rose-deep transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-y-0.5 md:text-4xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[1.6rem] leading-tight md:text-[2rem]">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-cocoa">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <ButtonLink href="/composer" size="lg" arrow className="lg:hidden">
          Commencer ma création
        </ButtonLink>
      </div>
    </section>
  );
}
