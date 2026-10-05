/**
 * Modèle de données central de Roza Bakery.
 *
 * Ces types décrivent tout ce qu'un futur back-office devra gérer :
 * options du configurateur, créations, FAQ, informations de la boutique,
 * commandes. Les composants ne consomment que ces types — on peut donc
 * remplacer les fichiers `src/content/*` par une base de données ou un CMS
 * sans toucher à l'interface.
 */

/** Teinte utilisée pour l'aperçu visuel d'une option (pastille + coupe du gâteau). */
export type Tone =
  | "sponge"
  | "golden"
  | "almond"
  | "chocolate"
  | "cocoa"
  | "ganache"
  | "cream"
  | "mascarpone"
  | "custard"
  | "butter"
  | "vanilla"
  | "lemon"
  | "coconut"
  | "popcorn"
  | "praline"
  | "caramel"
  | "berry"
  | "raspberry"
  | "strawberry"
  | "mango"
  | "tropical"
  | "banana"
  | "nut"
  | "hazelnut"
  | "pistachio"
  | "rose"
  | "sage"
  | "white"
  | "neutral";

export interface ConfigOption {
  /** Identifiant unique dans tout le configurateur (stable : utilisé dans les commandes). */
  id: string;
  label: string;
  description?: string;
  tone: Tone;
  /** Couleur personnalisée (#rrggbb) — prioritaire sur `tone`. */
  color?: string;
  /** Photo réelle (ex. "/images/options/molly-cake.jpg"). Sans photo, une pastille de couleur est affichée. */
  image?: string;
  /** Affiche un champ libre lorsque l'option est choisie (« Autre », « sur demande »…). */
  custom?: boolean;
  /** Permet de masquer temporairement une option (ex. fruit hors saison). */
  available?: boolean;
}

export interface OptionGroup {
  id: string;
  /** Titre du groupe — facultatif quand l'étape n'a qu'un seul groupe. */
  label?: string;
  description?: string;
  options: ConfigOption[];
}

export type CompositionStepId =
  | "base"
  | "creme"
  | "inserts"
  | "croustillant"
  | "fruits"
  | "supplements"
  | "exterieur"
  | "decoration";

export interface CompositionStep {
  id: CompositionStepId;
  /** Ex. « Les génoises » */
  name: string;
  title: string;
  subtitle: string;
  mode: "single" | "multiple";
  required: boolean;
  groups: OptionGroup[];
  /** Libellé court dans le résumé (« Base », « Crème »…). */
  summaryLabel: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  /** Afficher l'envoi de photos d'inspiration dans cette étape. */
  allowInspiration?: boolean;
}

export interface PickupSlot {
  id: string;
  label: string;
  hint?: string;
}

export interface SiteInfo {
  name: string;
  shortDescription: string;
  /** `null` = information non fournie : affichée comme placeholder. */
  city: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  openingHours: string[] | null;
  /** Délai minimum (jours) entre la demande et le retrait. */
  minLeadDays: number;
  /** Délai conseillé (jours). */
  recommendedLeadDays: number;
  /** Jours sans retrait possible — 0 = dimanche … 6 = samedi. */
  closedWeekdays: number[];
  /** Dates ponctuelles indisponibles (YYYY-MM-DD) : congés, agenda complet… */
  unavailableDates: string[];
  pickupSlots: PickupSlot[];
  maxInspirationPhotos: number;
}

/** Identifiant de catégorie (gérées depuis l'admin). */
export type CreationCategory = string;

export interface CreationCategoryInfo {
  id: CreationCategory;
  label: string;
}

export interface Creation {
  id: string;
  name: string;
  description: string;
  categories: CreationCategory[];
  image?: string;
  /** Format de la vignette dans la grille éditoriale. */
  ratio: "portrait" | "square" | "tall";
  tone: Tone;
  color?: string;
  /** `true` = entrée d'exemple à remplacer par une vraie création. */
  placeholder?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Réponse à compléter par Roza Bakery. */
  placeholder?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Commande                                                                    */
/* -------------------------------------------------------------------------- */

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupDate: string; // YYYY-MM-DD
  pickupSlot: string;
  servings: string;
  message: string;
}

/** Choix bruts envoyés par le configurateur. */
export interface CompositionDraft {
  selections: Partial<Record<CompositionStepId, string[]>>;
  customValues: Record<string, string>;
  notes: Partial<Record<CompositionStepId, string>>;
}

export interface OrderRequestPayload extends CompositionDraft {
  customer: CustomerInfo;
}

/** Composition « résolue » (libellés lisibles) — utilisée pour récap, emails, admin. */
export interface ResolvedStep {
  stepId: CompositionStepId;
  label: string;
  items: string[];
  notes?: string;
}

export type OrderStatus = "nouvelle" | "en-etude" | "confirmee" | "refusee" | "prete" | "retiree";

export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  status: OrderStatus;
  composition: ResolvedStep[];
  raw: CompositionDraft;
  customer: CustomerInfo;
  inspirationFiles: { name: string; type: string; size: number; storedAs?: string }[];
  /** Renseigné par Roza Bakery après étude — jamais calculé automatiquement. */
  confirmedPrice: number | null;
  /** Notes internes (visibles uniquement dans l'admin). */
  adminNotes?: string;
  updatedAt?: string;
}

/** Tout le contenu modifiable depuis l'admin. */
export interface SiteContent {
  site: SiteInfo;
  steps: CompositionStep[];
  creations: Creation[];
  categories: CreationCategoryInfo[];
  faq: FaqItem[];
}
