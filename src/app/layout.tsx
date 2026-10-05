import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Manrope, Noto_Sans, Noto_Sans_Tifinagh, Parisienne } from "next/font/google";
import { siteUrl } from "@/content/site";
import { I18nProvider } from "@/i18n/client";
import { localeNames } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { getSiteInfo } from "@/lib/data";
import "./globals.css";

// latin-ext : lettres kabyles (ɛ, ɣ, ḥ, ṭ, ẓ, ḍ, č, ǧ…)
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

/*
 * Polices de secours pour les lettres kabyles absentes des polices principales
 * (ɛ, ɣ, ḥ, ṭ, ẓ, ḍ, ǧ, ṛ, ṣ…). Utilisées lettre par lettre, téléchargées seulement si nécessaire.
 * L'ordre des polices est défini dans globals.css (@theme).
 */
const garamondFallback = EB_Garamond({
  subsets: ["latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif-ext",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const sansFallback = Noto_Sans({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-ext",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const parisienne = Parisienne({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-parisienne",
  display: "swap",
});

// Tifinagh : uniquement pour le nom de la langue (sélecteur) — non préchargée
const tifinagh = Noto_Sans_Tifinagh({
  subsets: ["tifinagh"],
  weight: "400",
  variable: "--font-tifinagh",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const [{ t }, site] = await Promise.all([getI18n(), getSiteInfo()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.defaultTitle, template: t.meta.titleTemplate },
    description: t.meta.description,
    keywords: [...t.meta.keywords, ...(site.city ? t.meta.cityKeywords(site.city) : [])],
    applicationName: "Roza Bakery",
    openGraph: {
      type: "website",
      locale: t.meta.ogLocale,
      siteName: "Roza Bakery",
      title: t.meta.ogTitle,
      description: t.meta.description,
    },
    twitter: { card: "summary_large_image", title: t.meta.ogTitle, description: t.meta.description },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getI18n();
  return (
    <html
      lang={localeNames[locale].htmlLang}
      className={`${cormorant.variable} ${manrope.variable} ${parisienne.variable} ${tifinagh.variable} ${garamondFallback.variable} ${sansFallback.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
