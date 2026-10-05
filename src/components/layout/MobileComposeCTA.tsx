"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Bouton flottant discret « Composer mon gâteau » (mobile & tablette). */
export function MobileComposeCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const hidden = pathname.startsWith("/composer");

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 320;
      setVisible(window.scrollY > 420 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, pathname]);

  if (hidden) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-safe transition-[opacity,transform] duration-500 ease-[var(--ease-soft)] lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href="/composer"
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className={`${visible ? "pointer-events-auto" : ""} inline-flex min-h-12 items-center gap-3 rounded-full bg-chocolate py-2.5 pl-2.5 pr-6 text-sm font-semibold text-cream shadow-[0_14px_30px_-10px_rgba(58,37,32,0.55)] transition-transform active:scale-[0.97]`}
      >
        <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-rose font-serif text-base italic text-chocolate">
          R
        </span>
        Composer mon gâteau
      </Link>
    </div>
  );
}
