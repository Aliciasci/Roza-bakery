import { ButtonLink } from "@/components/ui/Button";
import { CakeImage } from "@/components/ui/CakeImage";
import { CalendarIcon, StoreIcon } from "@/components/ui/Icons";

function RotatingBadge() {
  return (
    <div
      aria-hidden
      className="absolute -right-2 -top-6 h-28 w-28 rounded-full bg-cream/95 p-2 shadow-[0_10px_30px_-18px_rgba(58,37,32,0.6)] md:-right-6 md:h-32 md:w-32"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="badge-circle" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
        </defs>
        <text className="fill-chocolate text-[9.2px] font-semibold uppercase tracking-[0.28em]">
          <textPath href="#badge-circle">Fait main · Sur mesure · Roza ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl italic text-chocolate">R</span>
    </div>
  );
}

export function Hero({ image, imageAlt }: { image?: string; imageAlt?: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Halo discret */}
      <div aria-hidden className="absolute -right-40 top-0 -z-10 h-[38rem] w-[38rem] rounded-full bg-rose/30 blur-3xl" />

      <div className="container-page grid gap-12 pb-20 pt-6 md:pt-12 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-24">
        <div className="lg:col-span-6 lg:pr-6">
          <p className="eyebrow flex animate-fade-up items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-chocolate/30" />
            Pâtisserie artisanale · Sur mesure
          </p>
          <h1 className="mt-6 animate-fade-up text-display text-chocolate [animation-delay:80ms]">
            Votre gâteau,
            <br />
            <em className="text-cocoa">votre histoire.</em>
          </h1>
          <p className="mt-7 max-w-md animate-fade-up text-[1.0625rem] leading-relaxed text-cocoa [animation-delay:160ms] md:text-lg">
            Imaginez votre gâteau, choisissez chaque détail et laissez Roza Bakery créer une pièce unique à votre image.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <ButtonLink href="/composer" size="lg" arrow>
              Composer mon gâteau
            </ButtonLink>
            <ButtonLink href="/creations" size="lg" variant="secondary">
              Voir nos créations
            </ButtonLink>
          </div>
          <ul className="mt-9 flex animate-fade-up flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-cocoa [animation-delay:320ms]">
            <li className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> 3 à 4 jours à l&apos;avance
            </li>
            <li className="flex items-center gap-2">
              <StoreIcon className="h-4 w-4" /> Retrait sur place
            </li>
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:200ms] lg:col-span-6">
          <div className="relative mx-auto max-w-[34rem] lg:ml-auto lg:mr-0">
            <CakeImage
              src={image}
              alt={imageAlt || "Gâteau signature Roza Bakery"}
              tone="rose"
              shape="aspect-[4/5] arch"
              priority
              sizes="(min-width: 1024px) 34rem, 92vw"
            />
            <RotatingBadge />
            <div className="absolute -bottom-6 -left-2 max-w-[15rem] rounded-2xl bg-paper/95 p-5 shadow-[0_18px_40px_-24px_rgba(58,37,32,0.55)] backdrop-blur md:-left-10">
              <p className="script text-[1.75rem] leading-none text-rose-deep">fait main</p>
              <p className="mt-2 text-sm leading-snug text-cocoa">Chaque création est imaginée et réalisée sur mesure.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
