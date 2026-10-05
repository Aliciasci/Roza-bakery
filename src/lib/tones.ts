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
