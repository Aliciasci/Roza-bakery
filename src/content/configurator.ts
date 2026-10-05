import type { CompositionStep } from "@/lib/types";
import { groupsKab, optionsKab, stepsKab } from "./kab";

/**
 * Les étapes du configurateur « Composer mon gâteau ».
 *
 * - Ajouter / retirer une option : modifier simplement les listes ci-dessous.
 * - Les `id` sont enregistrés dans les commandes : ne pas les renommer
 *   une fois le site en ligne (changer le `label` suffit).
 * - Ajouter une photo : `image: "/images/options/xxx.jpg"`.
 * - Aucun prix ici : le tarif est confirmé par Roza Bakery après étude.
 */
const baseSteps: CompositionStep[] = [
  {
    id: "base",
    name: "Les génoises",
    title: "Choisissez la base de votre gâteau",
    subtitle: "Le cœur de votre création : sa texture donne le ton de chaque bouchée.",
    mode: "single",
    required: true,
    summaryLabel: "Base",
    groups: [
      {
        id: "genoises",
        options: [
          {
            id: "genoise-classique",
            label: "Génoise classique",
            description: "Légère et moelleuse, la plus traditionnelle.",
            tone: "sponge",
          },
          {
            id: "molly-cake",
            label: "Molly cake",
            description: "Plus riche et plus dense, parfaite pour les gâteaux à étages.",
            tone: "golden",
          },
          {
            id: "dacquoise",
            label: "Dacquoise",
            description: "Aux amandes, croustillante à l'extérieur et fondante à l'intérieur.",
            tone: "almond",
          },
        ],
      },
    ],
  },
  {
    id: "creme",
    name: "Les crèmes",
    title: "Choisissez votre crème",
    subtitle: "Celle qui enveloppe chaque étage, entre légèreté et gourmandise.",
    mode: "single",
    required: true,
    summaryLabel: "Crème",
    notesPlaceholder: "Un parfum particulier pour votre crème ?",
    groups: [
      {
        id: "cremes",
        options: [
          { id: "ganache-montee", label: "Ganache montée", description: "Fouettée, aérienne et fondante.", tone: "ganache" },
          { id: "chantilly-mascarpone", label: "Chantilly mascarpone", description: "Onctueuse et délicate.", tone: "mascarpone" },
          { id: "chantilly-maison", label: "Chantilly maison", description: "Légère, montée minute.", tone: "cream" },
          { id: "creme-patissiere", label: "Crème pâtissière", description: "Le grand classique, doux et vanillé.", tone: "custard" },
          { id: "creme-au-beurre", label: "Crème au beurre", description: "Riche, lisse et gourmande.", tone: "butter" },
          { id: "creme-autre", label: "Autres crèmes", description: "Une envie particulière ? Dites-nous tout.", tone: "neutral", custom: true },
        ],
      },
    ],
  },
  {
    id: "inserts",
    name: "Les inserts",
    title: "Ajoutez vos inserts",
    subtitle: "Une surprise au cœur du gâteau, fruitée ou crémeuse. Plusieurs choix possibles.",
    mode: "multiple",
    required: false,
    summaryLabel: "Inserts",
    notesPlaceholder: "Précisez un parfum : coulis de framboise, gelée de mangue…",
    groups: [
      {
        id: "inserts-fruits",
        label: "Inserts aux fruits",
        options: [
          { id: "insert-coulis", label: "Coulis", tone: "raspberry" },
          { id: "insert-compotee", label: "Compotée", tone: "berry" },
          { id: "insert-gelee", label: "Gelée", tone: "strawberry" },
        ],
      },
      {
        id: "inserts-cremes",
        label: "Crèmes",
        options: [
          { id: "insert-vanille", label: "Vanille", tone: "vanilla" },
          { id: "insert-citron", label: "Citron", tone: "lemon" },
          { id: "insert-chocolat", label: "Chocolat", tone: "chocolate" },
          { id: "insert-coco", label: "Noix de coco", tone: "coconut" },
          { id: "insert-popcorn", label: "Popcorn", tone: "popcorn" },
          { id: "insert-praline", label: "Praliné", tone: "praline" },
          { id: "insert-caramel", label: "Caramel", tone: "caramel" },
          { id: "insert-autre", label: "Autre", tone: "neutral", custom: true },
        ],
      },
    ],
  },
  {
    id: "croustillant",
    name: "Le croustillant",
    title: "Ajoutez du croustillant",
    subtitle: "Pour le contraste qui fait toute la différence. Plusieurs choix possibles.",
    mode: "multiple",
    required: false,
    summaryLabel: "Croustillant",
    groups: [
      {
        id: "fruits-secs",
        label: "Fruits secs",
        options: [
          { id: "crousti-noix", label: "Noix", tone: "nut" },
          { id: "crousti-noisettes", label: "Noisettes", tone: "hazelnut" },
          { id: "crousti-amandes", label: "Amandes", tone: "almond" },
        ],
      },
      {
        id: "croustillants",
        label: "Croustillants",
        options: [
          { id: "crousti-chocolat", label: "Chocolat", tone: "chocolate" },
          { id: "crousti-pate-a-tartiner", label: "Pâte à tartiner", tone: "hazelnut" },
          { id: "crousti-bueno", label: "Bueno", tone: "praline" },
          { id: "crousti-pistache", label: "Pâte de pistache", tone: "pistachio" },
        ],
      },
    ],
  },
  {
    id: "fruits",
    name: "Les fourrages de fruits",
    title: "Choisissez vos fruits",
    subtitle: "Pour une note fraîche et vive. Plusieurs choix possibles.",
    mode: "multiple",
    required: false,
    summaryLabel: "Fruits",
    groups: [
      {
        id: "fruits",
        options: [
          { id: "fruits-rouges", label: "Fruits rouges", tone: "berry" },
          { id: "fruits-mangue", label: "Mangue", tone: "mango" },
          { id: "fruits-tropicaux", label: "Fruits tropicaux", tone: "tropical" },
          { id: "fruits-citron", label: "Citron", tone: "lemon" },
          { id: "fruits-fraise", label: "Fraise", tone: "strawberry" },
          { id: "fruits-banane", label: "Banane", tone: "banana" },
          { id: "fruits-saison", label: "Fruits frais selon saison", tone: "sage" },
          { id: "fruits-autre", label: "Autre / sur demande", tone: "neutral", custom: true },
        ],
      },
    ],
  },
  {
    id: "supplements",
    name: "Les suppléments",
    title: "Personnalisez les suppléments",
    subtitle: "La touche gourmande en plus. Plusieurs choix possibles.",
    mode: "multiple",
    required: false,
    summaryLabel: "Suppléments",
    groups: [
      {
        id: "supplements",
        options: [
          { id: "supp-nutella", label: "Nutella", tone: "hazelnut" },
          { id: "supp-caramel", label: "Caramel", tone: "caramel" },
          { id: "supp-moundjan", label: "Moundjan", tone: "golden" },
          { id: "supp-bueno", label: "Bueno", tone: "praline" },
          { id: "supp-chocolat", label: "Chocolat", tone: "chocolate" },
          { id: "supp-praline", label: "Praliné", tone: "praline" },
          { id: "supp-pistache", label: "Pâte de pistache", tone: "pistachio" },
          { id: "supp-autre", label: "Autre sur demande", tone: "neutral", custom: true },
        ],
      },
    ],
  },
  {
    id: "exterieur",
    name: "L'extérieur du gâteau",
    title: "Choisissez la finition",
    subtitle: "L'écrin de votre gâteau, lisse et soigné, prêt à recevoir sa décoration.",
    mode: "single",
    required: true,
    summaryLabel: "Finition",
    notesLabel: "Des précisions sur la finition ?",
    notesPlaceholder: "Couleur souhaitée, effet, rendu…",
    groups: [
      {
        id: "creme-au-beurre",
        label: "Crème au beurre",
        options: [
          { id: "ext-meringue-suisse", label: "Meringue suisse", description: "Crème au beurre meringue suisse, soyeuse et légère.", tone: "white" },
          { id: "ext-russe", label: "Crème au beurre russe", description: "Au lait concentré, douce et onctueuse.", tone: "butter" },
          { id: "ext-americaine", label: "Crème au beurre américaine", description: "Plus sucrée, idéale pour les couleurs vives.", tone: "vanilla" },
        ],
      },
      {
        id: "ganache",
        label: "Ganache",
        options: [
          { id: "ext-ganache-chocolat", label: "Ganache au chocolat", description: "Une finition nette et gourmande.", tone: "cocoa" },
          { id: "ext-ganache-pate-a-sucre", label: "Ganache + pâte à sucre", description: "Ganache au chocolat recouverte de pâte à sucre.", tone: "rose" },
        ],
      },
    ],
  },
  {
    id: "decoration",
    name: "La décoration",
    title: "Imaginez la décoration",
    subtitle: "C'est ici que votre gâteau prend vie. Plusieurs choix possibles.",
    mode: "multiple",
    required: false,
    summaryLabel: "Décoration",
    allowInspiration: true,
    notesLabel: "Décrivez votre idée",
    notesPlaceholder: "Thème, couleurs, texte à inscrire, ambiance de la fête…",
    groups: [
      {
        id: "decorations",
        options: [
          { id: "deco-simple", label: "Décoration simple", description: "Épurée et élégante.", tone: "cream" },
          { id: "deco-elaboree", label: "Décoration élaborée", description: "Plus de détails, plus de relief.", tone: "rose" },
          { id: "deco-fleurs", label: "Fleurs", description: "Une touche florale et poétique.", tone: "sage" },
          { id: "deco-modelage", label: "Modelage", description: "Personnages et sujets façonnés à la main.", tone: "custard" },
          { id: "deco-toppers", label: "Toppers", description: "Prénom, âge, message…", tone: "golden" },
          { id: "deco-cake-design", label: "Cake design", description: "Une pièce artistique, entièrement imaginée pour vous.", tone: "raspberry" },
          { id: "deco-personnalisee", label: "Décoration personnalisée", description: "Votre idée, réalisée sur mesure.", tone: "neutral", custom: true },
        ],
      },
    ],
  },
];

/** Étapes + traductions kabyles par défaut (voir `./kab.ts`). */
export const compositionSteps: CompositionStep[] = baseSteps.map((step) => ({
  ...step,
  ...(stepsKab[step.id] && { kab: stepsKab[step.id] }),
  groups: step.groups.map((group) => ({
    ...group,
    ...(groupsKab[group.id] && { kab: groupsKab[group.id] }),
    options: group.options.map((option) => ({ ...option, ...(optionsKab[option.id] && { kab: optionsKab[option.id] }) })),
  })),
}));
