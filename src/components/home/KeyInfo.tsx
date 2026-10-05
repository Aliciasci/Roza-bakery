import { CalendarIcon, HandIcon, StoreIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { getI18n } from "@/i18n/server";

const icons = [CalendarIcon, StoreIcon, HandIcon];

export async function KeyInfo() {
  const { t } = await getI18n();
  return (
    <section className="bg-chocolate py-20 text-cream md:py-28" aria-labelledby="infos-title">
      <div className="container-page">
        <p className="eyebrow !text-cream/60">{t.home.keyEyebrow}</p>
        <h2 id="infos-title" className="mt-4 max-w-xl text-headline text-cream">
          {t.home.keyTitle1} <em>{t.home.keyTitle2}</em>
        </h2>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-cream/10 md:grid-cols-3">
          {t.home.keyInfos.map(({ title, text }, i) => {
            const Icon = icons[i % icons.length];
            return (
            <Reveal as="li" key={title} delay={i * 90} className="bg-chocolate p-8 md:p-10">
              <Icon className="h-7 w-7 text-rose" />
              <h3 className="mt-8 text-[1.65rem] leading-tight text-cream">{title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-cream/70">{text}</p>
            </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
