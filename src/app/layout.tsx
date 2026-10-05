import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Parisienne } from "next/font/google";
import { siteUrl } from "@/content/site";
import { getSiteInfo } from "@/lib/data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
  display: "swap",
});

const description =
  "Roza Bakery, pâtisserie artisanale et cake design : composez votre gâteau personnalisé étape par étape — gâteau d'anniversaire, gâteau sur mesure, wedding cake. Retrait sur place.";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Roza Bakery — Pâtisserie & gâteaux personnalisés sur mesure",
      template: "%s — Roza Bakery",
    },
    description,
    keywords: [
      "pâtisserie",
      "cake design",
      "gâteau personnalisé",
      "gâteau anniversaire",
      "pâtisserie personnalisée",
      "cake designer",
      "gâteau sur mesure",
      ...(site.city ? [`pâtisserie ${site.city}`, `cake design ${site.city}`] : []),
    ],
    applicationName: "Roza Bakery",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Roza Bakery",
      title: "Roza Bakery — Votre gâteau, votre histoire.",
      description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: "Roza Bakery — Votre gâteau, votre histoire.",
      description,
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable} ${parisienne.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
