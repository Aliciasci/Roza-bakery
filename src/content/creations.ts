import type { Creation, CreationCategoryInfo } from "@/lib/types";

export const creationCategories: CreationCategoryInfo[] = [
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
  { id: "cake-design", label: "Cake design" },
  { id: "minimal", label: "Minimal" },
  { id: "floral", label: "Floral" },
  { id: "chocolate", label: "Chocolate" },
  { id: "kids", label: "Kids" },
  { id: "custom", label: "Custom" },
];

/**
 * ⚠️ PLACEHOLDERS — Galerie d'exemple.
 *
 * Remplacer chaque entrée par une vraie création de Roza Bakery :
 *   1. déposer la photo dans `public/images/creations/`
 *   2. renseigner `image`, `name`, `description`
 *   3. supprimer `placeholder: true`
 */
export const creations: Creation[] = [
  { id: "c01", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["wedding", "floral"], ratio: "tall", tone: "white", placeholder: true },
  { id: "c02", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["birthday"], ratio: "square", tone: "rose", placeholder: true },
  { id: "c03", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["chocolate", "minimal"], ratio: "portrait", tone: "cocoa", placeholder: true },
  { id: "c04", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["cake-design", "custom"], ratio: "portrait", tone: "sage", placeholder: true },
  { id: "c05", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["kids", "birthday"], ratio: "square", tone: "custard", placeholder: true },
  { id: "c06", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["floral"], ratio: "tall", tone: "rose", placeholder: true },
  { id: "c07", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["minimal", "wedding"], ratio: "portrait", tone: "cream", placeholder: true },
  { id: "c08", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["chocolate"], ratio: "square", tone: "chocolate", placeholder: true },
  { id: "c09", name: "Création à venir", description: "Photo et description à ajouter.", categories: ["custom", "cake-design"], ratio: "tall", tone: "golden", placeholder: true },
];
