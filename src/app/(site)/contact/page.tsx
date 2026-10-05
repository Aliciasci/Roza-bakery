import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { CalendarIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { OrPlaceholder } from "@/components/ui/Placeholder";
import { PageHero } from "@/components/ui/PageHero";
import { getSiteInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Roza Bakery pour toute question sur votre gâteau personnalisé. Retrait uniquement sur place.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const site = await getSiteInfo();

  const items = [
    {
      Icon: InstagramIcon,
      label: "Instagram",
      value: site.instagramUrl ? (
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-chocolate/30 underline-offset-4">
          {site.instagramHandle ?? "Instagram"}
        </a>
      ) : null,
    },
    { Icon: MailIcon, label: "Email", value: site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : null },
    { Icon: PhoneIcon, label: "Téléphone", value: site.phone ? <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a> : null },
    { Icon: PinIcon, label: "Adresse de retrait", value: site.address },
    {
      Icon: CalendarIcon,
      label: "Horaires",
      value: site.openingHours?.length ? site.openingHours.map((h) => <span key={h} className="block">{h}</span>) : null,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons de <em className="text-cocoa">votre gâteau</em>
          </>
        }
        intro={
          <>
            Une question avant de commander ? Écrivez-nous. Pour une demande de gâteau, le plus simple reste de{" "}
            <Link href="/composer" className="font-semibold text-chocolate underline decoration-chocolate/30 underline-offset-4">
              composer votre création
            </Link>
            .
          </>
        }
      />

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ul className="space-y-1 lg:col-span-5">
            {items.map(({ Icon, label, value }) => (
              <li key={label} className="flex gap-5 border-b border-chocolate/10 py-6 first:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-soft">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="eyebrow">{label}</p>
                  <p className="mt-1.5 font-serif text-xl leading-snug">
                    <OrPlaceholder value={value} label={label} />
                  </p>
                </div>
              </li>
            ))}
            <li className="pt-6 text-sm leading-relaxed text-cocoa">
              Retrait uniquement sur place — Roza Bakery ne propose pas de livraison.
            </li>
          </ul>
          <div className="relative lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
