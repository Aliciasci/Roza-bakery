import { CalendarIcon, HandIcon, StoreIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

const infos = [
  {
    Icon: CalendarIcon,
    title: "Commandes 3 à 4 jours à l'avance minimum",
    text: "Le temps nécessaire pour préparer votre gâteau avec soin.",
  },
  {
    Icon: StoreIcon,
    title: "Retrait uniquement sur place",
    text: "Pas de livraison : votre création vous attend à la date convenue.",
  },
  {
    Icon: HandIcon,
    title: "Chaque gâteau est réalisé sur mesure",
    text: "Le prix est confirmé par Roza Bakery après étude de votre demande.",
  },
];

export function KeyInfo() {
  return (
    <section className="bg-chocolate py-20 text-cream md:py-28" aria-labelledby="infos-title">
      <div className="container-page">
        <p className="eyebrow !text-cream/60">Bon à savoir</p>
        <h2 id="infos-title" className="mt-4 max-w-xl text-headline text-cream">
          Avant de <em>commander</em>
        </h2>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-cream/10 md:grid-cols-3">
          {infos.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 90} className="bg-chocolate p-8 md:p-10">
              <Icon className="h-7 w-7 text-rose" />
              <h3 className="mt-8 text-[1.65rem] leading-tight text-cream">{title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-cream/70">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
