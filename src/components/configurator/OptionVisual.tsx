import Image from "next/image";
import { itemColor } from "@/lib/tones";
import type { CompositionStepId, ConfigOption } from "@/lib/types";

/**
 * Illustration d'une option : la vraie photo si elle existe,
 * sinon un petit dessin dans la teinte de l'option, adapté à l'étape.
 */
export function OptionVisual({ option, stepId, className = "" }: { option: ConfigOption; stepId: CompositionStepId; className?: string }) {
  if (option.image) {
    return (
      <div className={`relative overflow-hidden bg-ivory ${className}`}>
        <Image src={option.image} alt="" fill sizes="(min-width: 1024px) 18rem, 90vw" className="object-cover" />
      </div>
    );
  }

  const c = itemColor(option);
  const line = "rgba(58,37,32,0.22)";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`} style={{ background: `color-mix(in srgb, ${c} 22%, #fbf7f1)` }}>
      <svg viewBox="0 0 120 80" className="h-[78%] w-auto" aria-hidden="true">
        <ellipse cx="60" cy="70" rx="40" ry="3.5" fill="rgba(58,37,32,0.07)" />
        {stepId === "base" && (
          <g>
            {/* Part de génoise */}
            <path d="M24 66 L60 30 L96 66 Z" fill={c} stroke={line} />
            <path d="M33 57h54M42 48h36" stroke="rgba(58,37,32,0.12)" strokeWidth="1.2" />
            {[40, 52, 64, 76, 58, 48, 70].map((x, i) => (
              <circle key={i} cx={x} cy={i < 4 ? 62 : 53} r="1" fill="rgba(58,37,32,0.18)" />
            ))}
          </g>
        )}
        {stepId === "creme" && (
          <g fill={c} stroke={line}>
            {/* Rosace de crème pochée */}
            <path d="M34 66c0-10 8-14 26-14s26 4 26 14Z" />
            <path d="M40 54c0-9 6-13 20-13s20 4 20 13c-6 3-34 3-40 0Z" />
            <path d="M47 42c0-8 5-12 13-12s13 4 13 12c-5 2-21 2-26 0Z" />
            <path d="M55 30c0-6 2-10 5-12 3 2 5 6 5 12-3 1-7 1-10 0Z" />
          </g>
        )}
        {stepId === "exterieur" && (
          <g>
            <rect x="30" y="30" width="60" height="36" rx="5" fill={c} stroke={line} />
            <path d="M30 38q7.5 6 15 0t15 0 15 0 15 0" fill="none" stroke="rgba(58,37,32,0.15)" />
            <path d="M22 66h76" stroke={line} />
          </g>
        )}
        {stepId === "decoration" && (
          <g>
            {[
              { x: 44, y: 46, r: 13 },
              { x: 74, y: 40, r: 16 },
              { x: 64, y: 60, r: 9 },
            ].map((f) => (
              <g key={f.x}>
                {Array.from({ length: 6 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx={f.x}
                    cy={f.y - f.r * 0.5}
                    rx={f.r * 0.32}
                    ry={f.r * 0.52}
                    transform={`rotate(${i * 60} ${f.x} ${f.y})`}
                    fill={c}
                    stroke={line}
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx={f.x} cy={f.y} r={f.r * 0.18} fill="#9e2f45" opacity="0.8" />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

/** Pastille ronde pour les options compactes (inserts, fruits, suppléments…). */
export function OptionSwatch({ option, selected }: { option: ConfigOption; selected: boolean }) {
  const c = itemColor(option);
  const motion = `transition-transform duration-500 ease-[var(--ease-soft)] ${selected ? "scale-105" : "group-hover:scale-105"}`;

  // Photo réelle : vignette arrondie, un peu plus grande qu'une pastille pour rester lisible
  if (option.image) {
    return (
      <span aria-hidden className={`relative block h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-ivory ring-1 ring-chocolate/10 sm:h-14 sm:w-14 ${motion}`}>
        <Image src={option.image} alt="" fill sizes="56px" className="object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={`relative block h-9 w-9 shrink-0 rounded-full sm:h-11 sm:w-11 ${motion}`}
      style={{
        background: option.custom ? "transparent" : c,
        boxShadow: option.custom ? "inset 0 0 0 1px rgba(58,37,32,0.3)" : "inset 0 -6px 10px rgba(58,37,32,0.10), inset 0 0 0 1px rgba(58,37,32,0.08)",
      }}
    >
      {option.custom ? (
        <span className="absolute inset-0 flex items-center justify-center font-serif text-xl italic text-cocoa">+</span>
      ) : (
        <span className="absolute left-[26%] top-[20%] h-[22%] w-[30%] rounded-full bg-white/45" />
      )}
    </span>
  );
}
