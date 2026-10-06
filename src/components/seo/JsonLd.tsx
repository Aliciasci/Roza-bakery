import { siteUrl } from "@/content/site";
import type { FaqItem, SiteInfo } from "@/lib/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Le contenu est sérialisé par nos soins : on échappe « < » par sécurité.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Données structurées « Bakery » — seules les informations réellement connues sont incluses. */
export function bakeryJsonLd(site: SiteInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: site.name,
    description: site.shortDescription,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/brand/logo-roza.png`,
    servesCuisine: ["Pâtisserie", "Cake design"],
    ...(site.email && { email: site.email }),
    ...(site.phone && { telephone: site.phone }),
    ...(site.address && { address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "FR" } }),
    ...(site.instagramUrl && { sameAs: [site.instagramUrl] }),
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((i) => !i.placeholder)
      .map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      })),
  };
}
