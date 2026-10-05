import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd, faqJsonLd } from "@/components/seo/JsonLd";
import { PlusIcon } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { localizePath } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { getI18n } from "@/i18n/server";
import { getFaq } from "@/lib/data";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/faq", (t) => t.meta.faq);
}

/** Met en évidence les passages « [À compléter…] » des réponses. */
function Answer({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="placeholder-text">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default async function FaqPage() {
  const { locale, t } = await getI18n();
  const faq = await getFaq(locale);
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <PageHero
        eyebrow={t.faq.eyebrow}
        title={
          <>
            {t.faq.title1} <em className="text-cocoa">{t.faq.title2}</em>
          </>
        }
        intro={t.faq.intro}
      />

      <section className="container-page pb-16">
        <div className="mx-auto max-w-3xl border-t border-chocolate/12">
          {faq.map((item) => (
            <details key={item.id} className="group border-b border-chocolate/12" name="faq">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h2 className="font-serif text-[1.45rem] leading-snug md:text-[1.7rem]">{item.question}</h2>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-chocolate/15 transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-chocolate group-open:text-cream">
                  <PlusIcon className="h-4 w-4" />
                </span>
              </summary>
              <p className="max-w-2xl animate-fade-up pb-8 pr-12 text-[1.0625rem] leading-relaxed text-cocoa">
                <Answer text={item.answer} />
              </p>
            </details>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-3xl text-center text-cocoa">
          {t.faq.more}{" "}
          <Link href={localizePath("/contact", locale)} className="font-semibold text-chocolate underline decoration-chocolate/30 underline-offset-4">
            {t.faq.writeUs}
          </Link>
        </p>
      </section>

      <FinalCTA />
    </>
  );
}
