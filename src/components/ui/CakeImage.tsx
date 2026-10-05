import Image from "next/image";
import { itemColor } from "@/lib/tones";
import type { Tone } from "@/lib/types";

interface Props {
  src?: string;
  alt: string;
  tone?: Tone;
  /** Couleur personnalisée (#rrggbb), prioritaire sur `tone`. */
  color?: string;
  className?: string;
  /** Classes de forme (ratio, arche, arrondis). */
  shape?: string;
  sizes?: string;
  priority?: boolean;
  /** Texte affiché sur l'emplacement vide. */
  placeholderLabel?: string;
}

/** Luminance approximative d'une couleur #rrggbb. */
function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l < 0.5;
}

/**
 * Photo de gâteau. Tant qu'aucune vraie photo n'est fournie, affiche un
 * emplacement élégant et clairement identifié (« Photo à venir »).
 */
export function CakeImage({
  src,
  alt,
  tone = "rose",
  color: customColor,
  className = "",
  shape = "aspect-[4/5] rounded-2xl",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority,
  placeholderLabel = "Photo Roza Bakery à venir",
}: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-ivory ${shape} ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const color = itemColor({ tone, color: customColor });
  const dark = isDark(color);

  return (
    <div
      role="img"
      aria-label={`${alt} — emplacement photo (à remplacer)`}
      className={`relative isolate flex items-center justify-center overflow-hidden ${shape} ${className}`}
      style={{ background: `color-mix(in srgb, ${color} ${dark ? 78 : 42}%, #f4ede3)` }}
    >
      {/* Arche intérieure — rappel vitrine */}
      <div
        aria-hidden
        className={`absolute inset-[9%] bottom-[14%] arch border ${dark ? "border-cream/25" : "border-chocolate/10"}`}
      />
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className={`relative w-[38%] max-w-40 ${dark ? "text-cream/70" : "text-chocolate/45"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 30c-3-5-9-4-9 1 0 4 5 6 9 9 4-3 9-5 9-9 0-5-6-6-9-1Z" />
        <path d="M60 40v4" />
        <rect x="42" y="44" width="36" height="22" rx="2.5" />
        <path d="M42 50q4.5 4 9 0t9 0 9 0 9 0" />
        <rect x="31" y="66" width="58" height="28" rx="2.5" />
        <path d="M31 73q4.8 4.5 9.7 0t9.6 0 9.7 0 9.7 0 9.6 0 9.7 0" />
        <path d="M24 94h72" />
        <path d="M60 94v10M46 104h28" />
      </svg>
      <span
        className={`absolute bottom-[5%] left-0 right-0 text-center text-[0.625rem] font-semibold uppercase tracking-[0.22em] ${
          dark ? "text-cream/75" : "text-chocolate/55"
        }`}
      >
        {placeholderLabel}
      </span>
    </div>
  );
}
