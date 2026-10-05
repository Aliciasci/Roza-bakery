import Link from "next/link";
import { mainNav, secondaryNav } from "@/content/navigation";
import { getSiteInfo } from "@/lib/data";
import { OrPlaceholder } from "@/components/ui/Placeholder";
import { InstagramIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export async function Footer() {
  const site = await getSiteInfo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-chocolate text-cream">
      <div className="container-page pb-28 pt-16 md:pb-14 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm font-serif text-[1.65rem] leading-snug text-cream/90">
              Des gâteaux faits à la main, pensés pour vos plus beaux moments.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-cream/70">
              <li>Commandes 3 à 4 jours à l&apos;avance minimum</li>
              <li>Retrait uniquement sur place</li>
              <li>Chaque gâteau est réalisé sur mesure</li>
            </ul>
          </div>

          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <p className="eyebrow !text-cream/50">Explorer</p>
              <ul className="mt-5 space-y-3">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-cream/85 transition-colors hover:text-cream">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow !text-cream/50">Infos</p>
              <ul className="mt-5 space-y-3">
                {secondaryNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-cream/85 transition-colors hover:text-cream">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow !text-cream/50">Nous trouver</p>
            <address className="mt-5 space-y-3 text-sm not-italic text-cream/85 [&_.placeholder-text]:bg-cream/10 [&_.placeholder-text]:text-cream/80">
              <p>
                <OrPlaceholder value={site.address} label="Adresse" />
              </p>
              <p>
                <OrPlaceholder value={site.email} label="Email" />
              </p>
              {site.instagramUrl ? (
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <InstagramIcon className="h-4 w-4" />
                  {site.instagramHandle ?? "Instagram"}
                </a>
              ) : (
                <p className="inline-flex items-center gap-2">
                  <InstagramIcon className="h-4 w-4" />
                  <OrPlaceholder value={null} label="Lien Instagram" />
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} Roza Bakery. Tous droits réservés.</p>
          <p>Pâtisserie artisanale · Gâteaux personnalisés · Cake design</p>
        </div>
      </div>

      <p
        aria-hidden
        className="script pointer-events-none absolute -bottom-10 right-[-2rem] select-none text-[11rem] leading-none text-cream/[0.04] md:text-[16rem]"
      >
        Roza
      </p>
    </footer>
  );
}
