import type { Tone } from "./types";

/** Couleurs des teintes (pastilles d'options + coupe du gâteau). */
export const toneColors: Record<Tone, string> = {
  sponge: "#ecd3a4",
  golden: "#d8ae72",
  almond: "#e3c9a1",
  chocolate: "#5b3427",
  cocoa: "#7a4a37",
  ganache: "#b58a6b",
  cream: "#f7eedd",
  mascarpone: "#fbf3e3",
  custard: "#f2d88f",
  butter: "#f4e5c2",
  vanilla: "#f1e2bd",
  lemon: "#efdd84",
  coconut: "#f8f4ec",
  popcorn: "#efdcae",
  praline: "#b98556",
  caramel: "#c4884c",
  berry: "#a33a52",
  raspberry: "#c2475f",
  strawberry: "#da6672",
  mango: "#f1b459",
  tropical: "#f39b5c",
  banana: "#f1dc9a",
  nut: "#a77a55",
  hazelnut: "#8a5a3c",
  pistachio: "#b5c287",
  rose: "#eac3bd",
  sage: "#a7b39a",
  white: "#fffaf2",
  neutral: "#e7d8c5",
};

export function toneColor(tone: Tone | undefined, fallback = "#efe6da") {
  return tone ? (toneColors[tone] ?? fallback) : fallback;
}

/** Couleur effective d'un élément : couleur personnalisée sinon teinte. */
export function itemColor(item: { tone?: Tone; color?: string }, fallback?: string) {
  return item.color && /^#[0-9a-f]{6}$/i.test(item.color) ? item.color : toneColor(item.tone, fallback);
}

/** Mélange deux couleurs #rrggbb (t = 0 → a, t = 1 → b). */
export function mixColors(a: string, b: string, t: number) {
  const rgb = (hex: string) => {
    const n = parseInt(hex.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const x = rgb(a);
  const y = rgb(b);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

/** Couleurs devinées d'après le nom d'une saveur (du plus précis au plus général). */
const flavorPalette: [RegExp, string][] = [
  [/chocolat blanc|white choc/, "#f3e6cc"],
  [/chocolat au lait|lait chocolat/, "#8a5a3c"],
  [/chocolat noir|noir intense/, "#3f241b"],
  [/red velvet/, "#a8323e"],
  [/oreo|cookie/, "#3b302b"],
  [/chocolat|cacao|brownie|ganache|nutella|kinder|bueno|ferrero/, "#5b3427"],
  [/cafe|moka|tiramisu|cappuccino/, "#6f4a35"],
  [/caramel|toffee|dulce/, "#c4884c"],
  [/speculoos|cannelle|pain d.epice/, "#b97a48"],
  [/praline|noisette|gianduja/, "#b98556"],
  [/pistache/, "#b5c287"],
  [/matcha|the vert/, "#9bb26a"],
  [/amande|frangipane/, "#e3c9a1"],
  [/coco/, "#f8f4ec"],
  [/fruits? rouges?|fruits? des bois/, "#c94f68"],
  [/framboise/, "#d8657c"],
  [/fraise/, "#e58a96"],
  [/cerise|griotte/, "#a8283c"],
  [/myrtille|cassis|mure/, "#5d4a7a"],
  [/citron vert/, "#c9d86a"],
  [/citron|yuzu|lemon/, "#efdd84"],
  [/passion/, "#f2b33d"],
  [/mangue/, "#f1b459"],
  [/orange|agrume|clementine/, "#f0a050"],
  [/abricot|peche/, "#f2b38a"],
  [/ananas/, "#f2d25a"],
  [/banane/, "#f1dc9a"],
  [/pomme|poire/, "#ead9a0"],
  [/lavande|violette/, "#b9a6cf"],
  [/rose|litchi/, "#eac3bd"],
  [/vanille|nature|classique/, "#f1e2bd"],
  [/blanc/, "#fffaf2"],
  [/noir/, "#2f2a28"],
  [/rouge/, "#c0303c"],
  [/bleu/, "#8fb3d9"],
  [/vert/, "#9bbf7a"],
  [/jaune/, "#f2d36b"],
  [/violet|lilas|mauve/, "#9b7bb8"],
  [/gris/, "#b8b2ad"],
  [/dore|or/, "#d8ae72"],
];

export function guessFlavorColor(name: string): string | undefined {
  const n = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return flavorPalette.find(([re]) => re.test(n))?.[1];
}

/** Couleur d'une saveur choisie : couleur réglée dans l'admin, sinon devinée d'après son nom. */
export function flavorColor(option: { variants?: string[]; variantColors?: string[] }, flavor: string | undefined) {
  if (!flavor) return undefined;
  const i = option.variants?.indexOf(flavor) ?? -1;
  const set = i >= 0 ? option.variantColors?.[i] : undefined;
  if (set && /^#[0-9a-f]{6}$/i.test(set)) return { color: set, exact: true };
  const guessed = guessFlavorColor(flavor);
  return guessed ? { color: guessed, exact: false } : undefined;
}

/** Libellés des teintes (sélecteur de l'admin). */
export const toneLabels: Record<Tone, string> = {
  sponge: "Génoise",
  golden: "Doré",
  almond: "Amande",
  chocolate: "Chocolat",
  cocoa: "Cacao",
  ganache: "Ganache",
  cream: "Crème",
  mascarpone: "Mascarpone",
  custard: "Pâtissière",
  butter: "Beurre",
  vanilla: "Vanille",
  lemon: "Citron",
  coconut: "Coco",
  popcorn: "Popcorn",
  praline: "Praliné",
  caramel: "Caramel",
  berry: "Fruits rouges",
  raspberry: "Framboise",
  strawberry: "Fraise",
  mango: "Mangue",
  tropical: "Tropical",
  banana: "Banane",
  nut: "Noix",
  hazelnut: "Noisette",
  pistachio: "Pistache",
  rose: "Rose",
  sage: "Sauge",
  white: "Blanc",
  neutral: "Neutre",
};
