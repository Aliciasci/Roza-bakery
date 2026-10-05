import type { ReactNode } from "react";

/** Affiche une valeur réelle, ou un placeholder clairement identifié si l'information manque. */
export function OrPlaceholder({ value, label }: { value: ReactNode | null | undefined; label: string }) {
  if (value !== null && value !== undefined && value !== "") return <>{value}</>;
  return <span className="placeholder-text">[{label} à compléter]</span>;
}
