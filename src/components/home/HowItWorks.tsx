import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Props {
  items: { title: string; text: string }[];
  eyebrow?: string;
  title?: React.ReactNode;
  className?: string;
}

export function HowItWorks({ items, eyebrow = "Simple et sur mesure", title, className = "" }: Props) {
  return (
    <section className={`py-24 md:py-32 ${className}`} aria-labelledby="how-title">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={<span id="how-title">{title ?? <>Comment ça <em>marche</em></>}</span>}
        />
        <ol
          className={`relative mt-16 grid gap-10 sm:grid-cols-2 lg:gap-8 ${
            items.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"
          }`}
        >
          <span aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-chocolate/12 lg:block" />
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 90} className="relative">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-chocolate/15 bg-cream font-serif text-xl italic text-chocolate">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-[1.6rem] leading-tight">{item.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-cocoa">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
