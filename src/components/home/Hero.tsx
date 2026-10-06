import { ButtonLink } from "@/components/ui/Button";
import { CakeImage } from "@/components/ui/CakeImage";
import { CalendarIcon, StoreIcon } from "@/components/ui/Icons";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

function RotatingBadge({ text }: { text: string }) {
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
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl italic text-chocolate">R</span>
    </div>
  );
}

export async function Hero({ image, imageAlt }: { image?: string; imageAlt?: string }) {
  const { locale, t } = await getI18n();
  const href = (path: string) => localizePath(path, locale);
  return (
    <section className="relative overflow-hidden">
      {/* Halo discret */}
      <div aria-hidden className="absolute -right-40 top-0 -z-10 h-[38rem] w-[38rem] rounded-full bg-rose/30 blur-3xl" />

      <div className="container-page grid gap-12 pb-16 pt-6 md:pt-12 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-16">
        <div className="lg:col-span-6 lg:pr-6">
          <p className="eyebrow flex animate-fade-up items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-chocolate/30" />
            {t.home.eyebrow}
          </p>
          <h1 className="mt-6 animate-fade-up text-display text-chocolate [animation-delay:80ms]">
            {t.home.heroTitle1}
            <br />
            <em className="text-cocoa">{t.home.heroTitle2}</em>
          </h1>
          <p className="mt-7 max-w-md animate-fade-up text-[1.0625rem] leading-relaxed text-cocoa [animation-delay:160ms] md:text-lg">
            {t.home.heroSubtitle}
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <ButtonLink href={href("/composer")} size="lg" arrow>
              {t.common.composeCta}
            </ButtonLink>
            <ButtonLink href={href("/creations")} size="lg" variant="secondary">
              {t.common.seeCreations}
            </ButtonLink>
          </div>
          <ul className="mt-9 flex animate-fade-up flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-cocoa [animation-delay:320ms]">
            <li className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> {t.common.leadTimeShort}
            </li>
            <li className="flex items-center gap-2">
              <StoreIcon className="h-4 w-4" /> {t.common.pickupShort}
            </li>
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:200ms] lg:col-span-6">
          <div className="relative mx-auto max-w-[34rem] lg:ml-auto lg:mr-0">
            <CakeImage
              src={image}
              alt={imageAlt || t.home.heroAlt}
              placeholderLabel={t.common.photoComing}
              slotLabel={t.common.photoSlot}
              tone="rose"
              shape="aspect-[4/5] arch"
              priority
              sizes="(min-width: 1024px) 34rem, 92vw"
            />
            <RotatingBadge text={t.home.badge} />
            <div className="absolute -bottom-6 -left-2 max-w-[15rem] rounded-2xl bg-paper/95 p-5 shadow-[0_18px_40px_-24px_rgba(58,37,32,0.55)] backdrop-blur md:-left-10">
              <p className="script text-[1.75rem] leading-none text-rose-deep">{t.home.handmade}</p>
              <p className="mt-2 text-sm leading-snug text-cocoa">{t.home.handmadeText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
