"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { localeNames, localizePath, locales } from "@/i18n/config";

/**
 * Sélecteur FR / Taqbaylit — garde la page courante.
 * Lien classique (rechargement complet) : la langue de la page entière, dont <html lang>, change.
 */
export function LanguageSwitcher({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { locale, t, stripLocale } = useI18n();
  const path = stripLocale(usePathname());

  return (
    <nav aria-label={t.nav.language} className={`flex items-center gap-1 text-[0.75rem] font-semibold tracking-[0.08em] ${className}`}>
      {locales.map((l, i) => {
        const info = localeNames[l];
        const active = l === locale;
        return (
          <span key={l} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className={tone === "dark" ? "text-chocolate/25" : "text-cream/30"}>
                /
              </span>
            )}
            <a
              href={localizePath(path, l)}
              hrefLang={info.htmlLang}
              lang={info.htmlLang}
              aria-current={active ? "true" : undefined}
              title={t.nav.switchTo(info.name)}
              className={`flex min-h-11 items-center gap-1.5 rounded-full px-2 transition-colors ${
                tone === "dark"
                  ? active
                    ? "text-chocolate"
                    : "text-chocolate/50 hover:text-chocolate"
                  : active
                    ? "text-cream"
                    : "text-cream/55 hover:text-cream"
              }`}
            >
              {l === "fr" ? info.short : info.name}
              {info.tifinagh && (
                <span aria-hidden className="font-[family-name:var(--font-tifinagh)] text-[0.8125rem] font-normal tracking-normal opacity-70">
                  {info.tifinagh}
                </span>
              )}
            </a>
          </span>
        );
      })}
    </nav>
  );
}
