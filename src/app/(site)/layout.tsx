import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileComposeCTA } from "@/components/layout/MobileComposeCTA";

// Le contenu est lu à chaque requête (il est modifiable depuis l'admin et stocké sur le volume de données)
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only rounded-full bg-chocolate px-5 py-3 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60]"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileComposeCTA />
    </>
  );
}
