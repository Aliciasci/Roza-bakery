import type { ReactNode } from "react";

/**
 * Affiche une valeur réelle, ou un texte de remplacement clairement identifié
 * si l'information manque (ex. « [Adresse à compléter] »).
 */
export function OrPlaceholder({ value, placeholder }: { value: ReactNode | null | undefined; placeholder: string }) {
  if (value !== null && value !== undefined && value !== "") return <>{value}</>;
  return <span className="placeholder-text">{placeholder}</span>;
}
