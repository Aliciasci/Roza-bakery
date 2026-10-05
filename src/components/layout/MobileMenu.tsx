"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { mainNav, secondaryNav } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { LanguageSwitcher } from "./LanguageSwitcher";

const links = [...mainNav, ...secondaryNav];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null);
  const { t, href } = useI18n();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-cream transition-[opacity,visibility] duration-300 md:top-20 lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      inert={!open}
    >
      <nav aria-label={t.nav.mobileNav} className="container-page flex flex-1 flex-col overflow-y-auto pt-6">
        <ul className="flex flex-col">
          {links.map((item, i) => (
            <li key={item.href} className={open ? "animate-fade-up" : ""} style={{ animationDelay: `${60 + i * 45}ms` }}>
              <Link
                ref={i === 0 ? firstLink : undefined}
                href={href(item.href)}
                onClick={onClose}
                className="flex items-baseline gap-4 border-b border-chocolate/10 py-4"
              >
                <span className="w-6 font-serif text-sm italic text-cocoa-light">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[2rem] leading-none text-chocolate">{t.nav[item.key]}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pb-safe pt-8">
          <LanguageSwitcher className="mb-4 justify-center" />
          <ButtonLink href={href("/composer")} size="lg" arrow className="w-full" onClick={onClose}>
            {t.common.composeCta}
          </ButtonLink>
          <p className="mt-4 text-center text-xs tracking-wide text-cocoa">
            {t.common.leadTimeShort} · {t.common.pickupShort}
          </p>
        </div>
      </nav>
    </div>
  );
}
