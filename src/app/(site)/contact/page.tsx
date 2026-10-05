import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { CalendarIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { OrPlaceholder } from "@/components/ui/Placeholder";
import { PageHero } from "@/components/ui/PageHero";
import { localizePath } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { getI18n } from "@/i18n/server";
import { getSiteInfo } from "@/lib/data";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/contact", (t) => t.meta.contact);
}

export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const site = await getSiteInfo(locale);

  const items = [
    {
      Icon: InstagramIcon,
      label: t.contact.instagram,
      value: site.instagramUrl ? (
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-chocolate/30 underline-offset-4">
          {site.instagramHandle ?? "Instagram"}
        </a>
      ) : null,
    },
    { Icon: MailIcon, label: t.contact.email, value: site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : null },
    {
      Icon: PhoneIcon,
      label: t.contact.phone,
      value: site.phone ? <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a> : null,
    },
    { Icon: PinIcon, label: t.contact.address, value: site.address },
    {
      Icon: CalendarIcon,
      label: t.contact.hours,
      value: site.openingHours?.length
        ? site.openingHours.map((h) => (
            <span key={h} className="block">
              {h}
            </span>
          ))
        : null,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={
          <>
            {t.contact.title1} <em className="text-cocoa">{t.contact.title2}</em>
          </>
        }
        intro={
          <>
            {t.contact.introStart}{" "}
            <Link
              href={localizePath("/composer", locale)}
              className="font-semibold text-chocolate underline decoration-chocolate/30 underline-offset-4"
            >
              {t.contact.introLink}
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
                    <OrPlaceholder value={value} placeholder={t.common.toComplete(label)} />
                  </p>
                </div>
              </li>
            ))}
            <li className="pt-6 text-sm leading-relaxed text-cocoa">{t.contact.pickupOnly}</li>
          </ul>
          <div className="relative lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
