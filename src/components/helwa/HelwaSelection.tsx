"use client";

import { useI18n } from "@/i18n/client";
import { formatPrice } from "@/lib/helwa";
import type { HelwaLine } from "@/lib/types";

/** Liste des pièces choisies + total (panneau du catalogue, page commande, confirmation). */
export function HelwaSelection({ lines, total, className = "" }: { lines: HelwaLine[]; total: number; className?: string }) {
  const { t } = useI18n();
  const th = t.helwa;
  const pieces = lines.reduce((n, l) => n + l.quantity, 0);

  if (!lines.length) return <p className={`text-sm text-cocoa-light ${className}`}>{th.emptyCart}</p>;

  return (
    <div className={className}>
      <ul>
        {lines.map((l) => (
          <li key={l.itemId} className="flex items-baseline justify-between gap-4 border-b border-dashed border-chocolate/12 py-3">
            <span className="min-w-0">
              <span className="block font-medium text-chocolate">{l.name}</span>
              <span className="text-xs text-cocoa lining-nums">{th.lineTotal(l.quantity, formatPrice(l.unitPrice))}</span>
            </span>
            <span className="shrink-0 text-sm font-medium lining-nums tabular-nums">{formatPrice(l.total)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-cocoa">
          {th.total} · {th.pieces(pieces)}
        </span>
        <AnimatedPrice value={total} className="font-serif text-[1.9rem] leading-none" />
      </p>
    </div>
  );
}

/** Prix qui « rebondit » à chaque changement, pour que l'augmentation du total se voie. */
export function AnimatedPrice({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span aria-live="polite" aria-atomic className={`inline-block lining-nums tabular-nums ${className}`}>
      <span key={value} className="inline-block animate-bump">
        {formatPrice(value)}
      </span>
    </span>
  );
}
