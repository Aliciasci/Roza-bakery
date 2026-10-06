import Image from "next/image";
import Link from "next/link";

/** Logo officiel (badge rond détouré — voir scripts/brand-assets.mjs). */
export const LOGO_SRC = "/brand/logo-roza.png";

export function LogoMark({ size = 48, className = "", priority }: { size?: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={size}
      height={size}
      priority={priority}
      sizes={`${size}px`}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}

export function Logo({
  className = "",
  href = "/",
  label = "Roza Bakery",
  size = "header",
}: {
  className?: string;
  href?: string;
  label?: string;
  /** header : 48 px (mobile) → 68 px ; footer : 96 px */
  size?: "header" | "footer";
}) {
  const dims = size === "footer" ? "h-24 w-24" : "h-12 w-12 md:h-[68px] md:w-[68px]";
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex shrink-0 rounded-full transition-transform duration-500 ease-[var(--ease-soft)] hover:rotate-[-4deg] ${className}`}
    >
      <span className={`relative block ${dims}`}>
        <Image
          src={LOGO_SRC}
          alt="Roza Bakery"
          fill
          priority={size === "header"}
          sizes={size === "footer" ? "96px" : "(min-width: 768px) 68px, 48px"}
          className="object-contain"
          draggable={false}
        />
      </span>
    </Link>
  );
}
