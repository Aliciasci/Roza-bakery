import { useId } from "react";
import { findOption } from "@/lib/composition";
import { flavorColor, itemColor, mixColors } from "@/lib/tones";
import type { CompositionDraft, CompositionStep, CompositionStepId, Tone } from "@/lib/types";

/** Un élément choisi : identifiant de l'option, couleur effective et teinte (qui détermine le rendu). */
export interface CakeItem {
  id: string;
  color: string;
  tone?: Tone;
}

export interface CakeTones {
  base?: CakeItem;
  creme?: CakeItem;
  inserts: CakeItem[];
  croustillant: CakeItem[];
  fruits: CakeItem[];
  supplements: CakeItem[];
  exterieur?: CakeItem;
  decoration: CakeItem[];
}

export function computeCakeTones(steps: CompositionStep[], draft: CompositionDraft): CakeTones {
  const items = (id: CompositionStepId): CakeItem[] => {
    const step = steps.find((s) => s.id === id);
    if (!step) return [];
    return (draft.selections[id] ?? [])
      .map((optionId) => findOption(step, optionId))
      .filter((o) => o !== undefined)
      .map((o) => {
        // La saveur choisie colore l'élément : couleur exacte si réglée dans l'admin,
        // sinon couleur devinée, fondue dans la teinte de l'option (une génoise chocolat reste une génoise)
        const base = itemColor(o);
        const flavor = flavorColor(o, draft.variants?.[o.id]);
        const color = !flavor ? base : flavor.exact ? flavor.color : mixColors(base, flavor.color, id === "base" ? 0.75 : 0.85);
        return { id: o.id, color, tone: o.tone };
      });
  };
  return {
    base: items("base")[0],
    creme: items("creme")[0],
    inserts: items("inserts"),
    croustillant: items("croustillant"),
    fruits: items("fruits"),
    supplements: items("supplements"),
    exterieur: items("exterieur")[0],
    decoration: items("decoration"),
  };
}

/* -------------------------------------------------------------------------- */
/* Couleurs                                                                    */
/* -------------------------------------------------------------------------- */

const mix = mixColors;
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1, 7), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
const darken = (c: string, t: number) => mix(c, "#2a1712", t);
const lighten = (c: string, t: number) => mix(c, "#ffffff", t);

/** Générateur pseudo-aléatoire déterministe (même dessin à chaque rendu, côté serveur comme client). */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const f = (n: number) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------------------- */
/* Interprétation des choix (par identifiant, sinon par teinte)                */
/* -------------------------------------------------------------------------- */

type Sponge = "genoise" | "molly" | "dacquoise";
const spongeKind = (it?: CakeItem): Sponge =>
  !it ? "genoise" : /dacq/.test(it.id) || it.tone === "almond" ? "dacquoise" : /molly/.test(it.id) || it.tone === "golden" ? "molly" : "genoise";

type Finish = "buttercream" | "ganache" | "fondant";
const finishKind = (it?: CakeItem): Finish =>
  !it
    ? "buttercream"
    : /sucre|fondant/.test(it.id) || it.tone === "rose"
      ? "fondant"
      : /ganache/.test(it.id) || it.tone === "cocoa" || it.tone === "chocolate"
        ? "ganache"
        : "buttercream";

const GEL_TONES: Tone[] = ["raspberry", "berry", "strawberry", "mango", "tropical"];

type Fruit = "raspberry" | "blueberry" | "redcurrant" | "strawberry" | "mango" | "pineapple" | "passion" | "lemon" | "banana" | "kiwi" | "peach" | "dice";
function fruitCycle(it: CakeItem): Fruit[] {
  if (/rouge/.test(it.id) || it.tone === "berry") return ["raspberry", "blueberry", "redcurrant", "raspberry", "blueberry"];
  if (/fraise/.test(it.id) || it.tone === "strawberry") return ["strawberry"];
  if (/tropic/.test(it.id) || it.tone === "tropical") return ["mango", "pineapple", "passion"];
  if (/mangue/.test(it.id) || it.tone === "mango") return ["mango"];
  if (/citron/.test(it.id) || it.tone === "lemon") return ["lemon"];
  if (/banane/.test(it.id) || it.tone === "banana") return ["banana"];
  if (/saison/.test(it.id) || it.tone === "sage") return ["kiwi", "strawberry", "peach", "blueberry"];
  if (it.tone === "raspberry") return ["raspberry"];
  return ["dice"];
}

type Crunch = "nut" | "chocolate" | "wafer" | "pistachio" | "spread";
function crunchKind(it: CakeItem): Crunch {
  if (/tartiner/.test(it.id)) return "spread";
  if (/pistach/.test(it.id) || it.tone === "pistachio") return "pistachio";
  if (/chocolat/.test(it.id) || it.tone === "chocolate" || it.tone === "cocoa") return "chocolate";
  if (/bueno/.test(it.id) || it.tone === "praline") return "wafer";
  return "nut";
}

type Deco = "writing" | "border" | "pearls" | "flowers" | "topper" | "bow" | "gold" | "sprinkles";
function decoKinds(items: CakeItem[]): Set<Deco> {
  const s = new Set<Deco>();
  for (const { id, tone } of items) {
    if (/fleur/.test(id) || tone === "sage") s.add("flowers");
    else if (/topper/.test(id) || tone === "golden") s.add("topper");
    else if (/modelage/.test(id) || tone === "custard") s.add("bow");
    else if (/cake-design/.test(id) || tone === "raspberry") s.add("gold").add("flowers");
    else if (/elabor/.test(id) || tone === "rose") s.add("border").add("pearls");
    else if (/perso/.test(id) || tone === "neutral") s.add("writing").add("sprinkles");
    else s.add("writing");
  }
  return s;
}

/* -------------------------------------------------------------------------- */
/* Géométrie : gâteau rond vu de trois-quarts, une part retirée à l'avant     */
/* -------------------------------------------------------------------------- */

const CX = 160;
const R = 96; // rayon
const RY = 34; // rayon apparent en profondeur
const TOP = 150;
const H = 84; // bento : plus large que haut
const BOT = TOP + H;
const CUT_R = 55; // angles de la part retirée (0° = droite, 90° = avant)
const CUT_L = 125;

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (deg: number, y: number, r = R, ry = RY): [number, number] => [CX + r * Math.cos(rad(deg)), y + ry * Math.sin(rad(deg))];
const P = (deg: number, y: number) => pt(deg, y).map(f).join(" ");

const topPath = `M${CX} ${TOP} L${P(CUT_R, TOP)} A${R} ${RY} 0 1 0 ${P(CUT_L, TOP)} Z`;
const sidePath = (a: number, b: number) =>
  `M${P(a, TOP)} A${R} ${RY} 0 0 1 ${P(b, TOP)} L${P(b, BOT)} A${R} ${RY} 0 0 0 ${P(a, BOT)} Z`;
const SIDES = [sidePath(0, CUT_R), sidePath(CUT_L, 180)];
const rimArc = (a: number, b: number, y: number) => `M${P(a, y)} A${R} ${RY} 0 0 1 ${P(b, y)}`;

/** Face coupée en coordonnées locales : u de 0 (centre) à 100 (bord), v de 0 (dessus) à H (dessous). */
const faceMatrix = (deg: number) => `matrix(${f((R * Math.cos(rad(deg))) / 100)} ${f((RY * Math.sin(rad(deg))) / 100)} 0 1 ${CX} ${TOP})`;

/* Couches de la face coupée (v) */
const V = { s3: 4, c2: [22, 34], s2: 34, c1: [50, 64], crunch: [64, 68] } as const;

/* Boîte bento en kraft : fond, parois basses, couvercle ouvert derrière */
const BOX_S = R + 28; // demi-côté
const BOX_K = RY / R; // aplatissement de la perspective
const BOX = {
  l: CX - BOX_S,
  r: CX + BOX_S,
  back: BOT - BOX_S * BOX_K,
  front: BOT + BOX_S * BOX_K,
  wall: 9,
  lid: 120,
};
const KRAFT = "#c9a27a";
const KRAFT_IN = "#dcc09a";
const KRAFT_DARK = "#a97f55";

/** Bande irrégulière (crème, insert) — bord légèrement ondulé comme une vraie coupe. */
function band(v0: number, v1: number, u1: number, amp: number, rnd: () => number, roundEnd = false) {
  const top: [number, number][] = [];
  for (let u = -0.5; u < u1; u += 6) top.push([u, v0 + (rnd() - 0.5) * 2 * amp]);
  top.push([u1, v0 + (rnd() - 0.5) * amp]);
  const bottom = top.map(([u]) => [u, v1 + (rnd() - 0.5) * 2 * amp] as [number, number]).reverse();
  bottom[0][1] = v1;
  const r = (v1 - v0) / 2;
  const join = roundEnd ? ` C${f(u1 + r * 1.2)} ${f(v0)} ${f(u1 + r * 1.2)} ${f(v1)} ${f(u1)} ${f(v1)}` : "";
  return `M${top.map(([u, v]) => `${f(u)} ${f(v)}`).join(" L")}${join} L${bottom.map(([u, v]) => `${f(u)} ${f(v)}`).join(" L")} Z`;
}

/* -------------------------------------------------------------------------- */
/* Petits éléments dessinés                                                    */
/* -------------------------------------------------------------------------- */

function FruitPiece({ kind, color }: { kind: Fruit; color: string }) {
  switch (kind) {
    case "raspberry":
      return (
        <g>
          {[[0, -2.8], [-2.3, -1.1], [2.3, -1.1], [-2.6, 1.5], [0, 0.4], [2.6, 1.5], [-1.2, 3.4], [1.2, 3.4]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.75" fill="#c43a55" stroke="#8e1f37" strokeWidth="0.35" />
          ))}
          <ellipse cx="0" cy="0.6" rx="0.9" ry="1.6" fill="#f2a7b4" />
          <circle cx="-1.6" cy="-2" r="0.5" fill="#fff" opacity="0.55" />
        </g>
      );
    case "blueberry":
      return (
        <g>
          <circle r="3.1" fill="#3f3e66" />
          <circle cx="-1" cy="-1" r="1.6" fill="#7a7aa6" opacity="0.45" />
          <path d="M-0.9 -2.6 L0 -1.8 L0.9 -2.6" stroke="#262540" strokeWidth="0.5" fill="none" />
        </g>
      );
    case "redcurrant":
      return (
        <g>
          <circle r="2.3" fill="#d2283c" opacity="0.92" />
          <circle cx="-0.7" cy="-0.8" r="0.7" fill="#fff" opacity="0.6" />
        </g>
      );
    case "strawberry":
      return (
        <g>
          <path d="M0 -4.6C3.8 -4.8 4.6 -1 3.6 1.6C2.6 4 1 5.2 0 5.6C-1 5.2 -2.6 4 -3.6 1.6C-4.6 -1 -3.8 -4.8 0 -4.6Z" fill="#d23a48" />
          <path d="M0 -3.2C2.6 -3.3 3.1 -0.7 2.4 1.1C1.7 2.8 0.7 3.6 0 3.9C-0.7 3.6 -1.7 2.8 -2.4 1.1C-3.1 -0.7 -2.6 -3.3 0 -3.2Z" fill="#f09aa0" />
          <ellipse cy="0" rx="0.8" ry="2.6" fill="#fde6e2" />
          {[[-3.3, 0], [3.3, 0], [-2, 3.4], [2, 3.4], [0, -4.1]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="0.35" fill="#f4d36b" />
          ))}
        </g>
      );
    case "mango":
    case "peach":
    case "dice": {
      const c = kind === "mango" ? "#f3a93c" : kind === "peach" ? "#f2a66a" : color;
      return (
        <g>
          <rect x="-3.7" y="-3.7" width="7.4" height="7.4" rx="1.5" fill={c} />
          <rect x="-3.7" y="-3.7" width="7.4" height="3" rx="1.5" fill={lighten(c, 0.3)} opacity="0.55" />
          <path d="M-2.5 1.5h5M-2.5 2.8h4" stroke={darken(c, 0.15)} strokeWidth="0.3" opacity="0.6" />
        </g>
      );
    }
    case "pineapple":
      return (
        <g>
          <path d="M0 -4L4 3.5H-4Z" fill="#f2d25a" stroke="#e0b93a" strokeWidth="0.4" strokeLinejoin="round" />
          <path d="M0 -3V3M-2 0.5L2 0.5" stroke="#fbeaa0" strokeWidth="0.45" />
        </g>
      );
    case "passion":
      return (
        <g>
          <circle r="3.2" fill="#f2b33d" opacity="0.9" />
          {[[-1.1, -0.8], [1.2, -0.3], [-0.2, 1.3]].map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx="0.6" ry="0.8" fill="#2b1b12" />
          ))}
        </g>
      );
    case "lemon":
      return (
        <g>
          <path d="M-4.2 2.6A4.6 4.6 0 0 1 4.2 2.6Q0 0.8 -4.2 2.6Z" fill="#f4dc63" stroke="#e7c43a" strokeWidth="0.4" />
          <path d="M-2.6 1.6L-1.4 -0.8M0 1.2V-1.8M2.6 1.6L1.4 -0.8" stroke="#fbeeac" strokeWidth="0.45" />
        </g>
      );
    case "banana":
      return (
        <g>
          <circle r="4" fill="#f6e7b0" stroke="#e8d18a" strokeWidth="0.5" />
          <circle r="2" fill="#fbf1cc" />
          {[0, 120, 240].map((a) => (
            <circle key={a} cx={f(Math.cos(rad(a)) * 0.9)} cy={f(Math.sin(rad(a)) * 0.9)} r="0.35" fill="#8a6a3a" />
          ))}
        </g>
      );
    case "kiwi":
      return (
        <g>
          <circle r="4" fill="#8fb04a" stroke="#6f6a3b" strokeWidth="0.5" />
          <ellipse rx="1.3" ry="1" fill="#e4edba" />
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={f(Math.cos(rad(i * 36)) * 2)} cy={f(Math.sin(rad(i * 36)) * 2)} r="0.32" fill="#1f1a12" />
          ))}
        </g>
      );
  }
}

function Rose({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  const k = s / 10;
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${f(k)} ${f(k * 0.8)})`}>
      <circle r="10" fill={darken(color, 0.18)} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0 0C-7 -2 -8 -9 0 -10.4C8 -9 7 -2 0 0Z" fill={color} stroke={darken(color, 0.22)} strokeWidth="0.4" />
      ))}
      {[30, 102, 174, 246, 318].map((a) => (
        <path key={a} transform={`rotate(${a}) scale(0.62)`} d="M0 0C-7 -2 -8 -9 0 -10.4C8 -9 7 -2 0 0Z" fill={lighten(color, 0.12)} stroke={darken(color, 0.25)} strokeWidth="0.6" />
      ))}
      <path d="M-3.6 -0.6C-3.6 -4.4 3.6 -4.4 3.6 -0.6C2.8 2.2 -2.8 2.2 -3.6 -0.6Z" fill={lighten(color, 0.2)} />
      <path d="M0 -1.6C2 -1.6 2 1 0 1C-1.6 1 -1.6 -0.8 0 -0.8" stroke={darken(color, 0.4)} strokeWidth="0.6" fill="none" />
      <ellipse cx="-4" cy="-5" rx="2.4" ry="1.2" fill="#fff" opacity="0.25" />
    </g>
  );
}

function Leaf({ x, y, angle, len = 12 }: { x: number; y: number; angle: number; len?: number }) {
  const k = len / 12;
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${angle}) scale(${f(k)})`}>
      <path d="M0 0C3 -3.4 9 -3.4 12 0C9 3.4 3 3.4 0 0Z" fill="#7f9568" />
      <path d="M0.5 0H10.5" stroke="#b2c39c" strokeWidth="0.5" />
      <path d="M0 0C3 -3.4 9 -3.4 12 0" stroke="#5f6e55" strokeWidth="0.4" fill="none" opacity="0.6" />
    </g>
  );
}

function Rosette({ x, y, color }: { x: number; y: number; color: string }) {
  const edge = darken(color, 0.16);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(1.3)`}>
      <ellipse cy="1.6" rx="5.4" ry="2.6" fill="rgba(58,37,32,0.14)" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = rad(i * 40 + 10);
        return <ellipse key={i} cx={f(Math.cos(a) * 3.3)} cy={f(Math.sin(a) * 2.2)} rx="2.1" ry="1.7" fill={i % 2 ? color : lighten(color, 0.08)} stroke={edge} strokeWidth="0.3" />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = rad(i * 60 + 30);
        return <ellipse key={i} cx={f(Math.cos(a) * 1.5)} cy={f(Math.sin(a) * 1 - 1.1)} rx="1.5" ry="1.25" fill={lighten(color, 0.14)} stroke={edge} strokeWidth="0.25" />;
      })}
      <path d="M-1.2 -1.6Q0 -4.6 1.2 -1.6Z" fill={lighten(color, 0.2)} stroke={edge} strokeWidth="0.25" />
      <ellipse cx="-1.6" cy="-1.8" rx="1.3" ry="0.6" fill="#fff" opacity="0.5" />
    </g>
  );
}

function Shell({ x, y, angle, color }: { x: number; y: number; angle: number; color: string }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(angle)})`}>
      <path d="M-3.6 0.3C-3.4 -2.8 1.8 -3 3.8 0.2C1.8 2.6 -3.4 2.8 -3.6 0.3Z" fill={color} stroke={darken(color, 0.16)} strokeWidth="0.35" />
      <path d="M-2.4 -0.4C-0.6 -1.6 1.4 -1.2 2.6 0" stroke={darken(color, 0.2)} strokeWidth="0.35" fill="none" />
      <path d="M-2.2 -1.2C-0.8 -2 0.8 -1.8 1.8 -0.9" stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.5" />
    </g>
  );
}

const EMPTY_SPONGE = "#efe4d3";
const EMPTY_CREAM = "#f8f2ea";
const EMPTY_FINISH = "#f6efe5";
const GANACHE = "#6b3f2c";

/**
 * Le gâteau dessiné en SVG, vu de trois-quarts sur un présentoir, une part
 * retirée pour montrer l'intérieur : chaque élément choisi (génoise, crème,
 * inserts, croustillant, fruits, suppléments, finition, décoration) a son
 * propre rendu. Purement décoratif (le résumé texte reste la référence).
 */
export function CakeCrossSection({ tones, className = "" }: { tones: CakeTones; className?: string }) {
  const uid = `cake${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const id = (n: string) => `${uid}-${n}`;
  const url = (n: string) => `url(#${id(n)})`;

  const ghost = !tones.base;
  const sponge = tones.base?.color ?? EMPTY_SPONGE;
  const sponged = spongeKind(tones.base);
  const cream = tones.creme?.color ?? EMPTY_CREAM;
  const finish = finishKind(tones.exterieur);
  const exterior = tones.exterieur?.color ?? EMPTY_FINISH;
  const sauce = tones.supplements[0]?.color;
  const deco = decoKinds(tones.decoration);
  const outline = "rgba(58,37,32,0.25)";
  const rosetteColor = finish === "ganache" ? lighten(exterior, 0.08) : finish === "fondant" ? "#fbf4ea" : lighten(exterior, 0.1);

  // Bord extérieur visible sur la coupe (épaisseur de la finition)
  const rimLayers: [number, number, string][] =
    finish === "fondant"
      ? [[95, 98, GANACHE], [98, 100.5, exterior]]
      : [[95, 100.5, exterior]];
  const topLayers: [number, number, string][] =
    finish === "fondant"
      ? [[-0.5, 1.6, exterior], [1.6, 4, GANACHE]]
      : [[-0.5, 4, exterior]];

  const poreTile: [number, number] = sponged === "molly" ? [13, 9] : sponged === "dacquoise" ? [19, 13] : [29, 19];
  const pores = (() => {
    const r = rng(sponged === "molly" ? 5 : sponged === "dacquoise" ? 7 : 3);
    const [w, h] = poreTile;
    const [min, max] = sponged === "molly" ? [0.2, 0.55] : sponged === "dacquoise" ? [0.3, 0.8] : [0.3, 1.3];
    return Array.from({ length: sponged === "genoise" ? 34 : 18 }, () => {
      // Petites alvéoles nombreuses, quelques plus grandes
      const rx = min + Math.pow(r(), 2.2) * (max - min);
      return { x: f(rx + r() * (w - 2 * rx)), y: f(rx + r() * (h - 2 * rx)), rx: f(rx), ry: f(rx * (0.45 + r() * 0.4)), o: f(0.1 + r() * 0.22) };
    });
  })();

  const crunchColor = tones.croustillant.length ? darken(tones.croustillant[0].color, 0.12) : undefined;
  const spongeBottom = tones.croustillant.length ? V.crunch[1] : V.crunch[0];

  /* ---------------------------- Face coupée ---------------------------- */
  const face = (side: "l" | "r") => {
    const rnd = rng(side === "r" ? 11 : 29);
    const fruitsU0 = tones.inserts.length > 1 ? 52 : 8;
    const fruitPieces: { kind: Fruit; color: string; u: number; v: number }[] = [];
    if (tones.fruits.length) {
      const cycles = tones.fruits.map(fruitCycle);
      for (let i = 0, u = fruitsU0; u <= 88; i++, u += 10.5) {
        const n = i % cycles.length;
        const cycle = cycles[n];
        fruitPieces.push({ kind: cycle[Math.floor(i / cycles.length) % cycle.length], color: tones.fruits[n].color, u, v: (V.c1[0] + V.c1[1]) / 2 + (rnd() - 0.5) * 1.6 });
      }
    }
    const crunchBits = tones.croustillant.flatMap((it, n) =>
      crunchKind(it) === "spread"
        ? []
        : Array.from({ length: Math.round(28 / tones.croustillant.length) }, (_, i) => ({
            kind: crunchKind(it),
            color: it.color,
            u: ((i * tones.croustillant.length + n) * 3.4 + rnd() * 2) % 94,
            v: V.crunch[0] + 0.4 + rnd() * 3.4,
            r: rnd() * 360,
            s: 0.8 + rnd() * 0.6,
          })),
    );
    const spread = tones.croustillant.find((it) => crunchKind(it) === "spread");

    return (
      <g transform={faceMatrix(side === "r" ? CUT_R : CUT_L)}>
        {/* Génoise : fond + mie alvéolée */}
        <rect x="-0.5" y="0" width="101" height={H} fill={sponge} className="transition-[fill] duration-500" />
        {!ghost && (
          <>
            <rect x="-0.5" y="0" width="101" height={H} fill={url("pores")} />
            <rect x="-0.5" y="0" width="101" height={H} fill={url("pores")} transform="translate(7 5) scale(0.7)" opacity="0.6" />
            <rect x="-0.5" y="0" width="101" height={H} fill={url("specks")} opacity="0.5" />
            {/* Croûte dorée en haut de chaque couche (dacquoise, molly) */}
            {sponged !== "genoise" &&
              [V.s3, V.s2, spongeBottom].map((v) => (
                <rect key={v} x="-0.5" y={v} width="101" height={sponged === "dacquoise" ? 2.6 : 1.6} fill={darken(sponge, 0.28)} opacity="0.75" />
              ))}
            {sponged === "dacquoise" &&
              Array.from({ length: 22 }, (_, i) => {
                const v = [V.s3, V.s2, spongeBottom][i % 3] + 3 + rnd() * 11;
                return <ellipse key={i} cx={f(rnd() * 94)} cy={f(v)} rx="1.6" ry="0.55" transform={`rotate(${f(rnd() * 50 - 25)} ${f(rnd() * 94)} ${f(v)})`} fill="#f4e6c8" stroke={darken(sponge, 0.2)} strokeWidth="0.25" />;
              })}
          </>
        )}

        {/* Crèmes */}
        {[V.c2, V.c1].map(([v0, v1]) => (
          <path key={v0} d={band(v0, v1, 100.5, 0.7, rnd)} fill={ghost ? EMPTY_CREAM : url("cream")} />
        ))}
        {!ghost && [V.c2, V.c1].map(([v0, v1]) => <rect key={v0} x="0" y={v0 + 1} width="100" height={v1 - v0 - 2} fill={url("satin")} opacity="0.6" />)}

        {/* Suppléments : ruban de sauce dans la crème */}
        {tones.supplements.slice(0, 2).map((it, i) => {
          const v = i === 0 ? V.c2[1] - 2.2 : V.c1[1] - 2;
          return (
            <path
              key={it.id}
              d={`M0 ${v}${Array.from({ length: 8 }, (_, k) => ` q6 ${k % 2 ? 1.4 : -1.4} 12 0`).join("")}`}
              stroke={it.color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="animate-fade-in"
            />
          );
        })}

        {/* Inserts (plus petits que le gâteau, centrés) */}
        {tones.inserts.slice(0, 2).map((it, i) => {
          const [v0, v1, u1] = i === 0 ? [V.c2[0] + 3, V.c2[1] - 3, 70] : [V.c1[0] + 3, V.c1[1] - 4, 44];
          const gel = GEL_TONES.includes(it.tone as Tone);
          return (
            <g key={it.id} className="animate-fade-in">
              <path d={band(v0, v1, u1, 0.25, rnd, true)} fill={url(`insert${i}`)} />
              {gel && <path d={`M1 ${v0 + 1.1}H${u1 - 4}`} stroke="#fff" strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />}
              {/compot/.test(it.id) &&
                Array.from({ length: 7 }, (_, k) => (
                  <ellipse key={k} cx={f(4 + k * (u1 - 8) / 6)} cy={f((v0 + v1) / 2 + (rnd() - 0.5) * 2)} rx="2.2" ry="1.5" fill={darken(it.color, 0.25)} opacity="0.85" />
                ))}
            </g>
          );
        })}

        {/* Fruits frais coupés dans la crème */}
        {fruitPieces.map((p, i) => (
          <g key={i} transform={`translate(${f(p.u)} ${f(p.v)}) scale(1.15 0.85)`} className="animate-pop" style={{ animationDelay: `${i * 35}ms`, transformBox: "fill-box", transformOrigin: "center" }}>
            <FruitPiece kind={p.kind} color={p.color} />
          </g>
        ))}

        {/* Croustillant */}
        {crunchColor && (
          <g className="animate-fade-in">
            <path d={band(V.crunch[0], V.crunch[1], 100.5, 0.5, rnd)} fill={spread ? url("spread") : crunchColor} />
            {crunchBits.map((b, i) => {
              const c = b.kind === "chocolate" ? "#4a2a20" : b.kind === "wafer" ? "#e3c08a" : b.kind === "pistachio" ? "#9db35e" : b.color;
              return (
                <g key={i} transform={`translate(${f(b.u + 2)} ${f(b.v)}) rotate(${f(b.r)}) scale(${f(b.s * 1.3)} ${f(b.s)})`}>
                  {b.kind === "chocolate" ? (
                    <>
                      <path d="M-2 -0.6L1.8 -1L2.2 0.5L-1.6 0.9Z" fill={c} />
                      <path d="M-2 -0.6L1.8 -1" stroke="#8a5a48" strokeWidth="0.3" />
                    </>
                  ) : b.kind === "wafer" ? (
                    <path d="M-1.8 -0.7H1.8V0.7H-1.8Z M-0.6 -0.7V0.7M0.6 -0.7V0.7" fill={c} stroke={darken(c, 0.25)} strokeWidth="0.25" />
                  ) : (
                    <>
                      <path d="M-1.6 -0.9L0.6 -1.3L1.8 0L0.8 1.2L-1.4 1Z" fill={darken(c, 0.1)} />
                      <path d="M-0.9 -0.4L0.5 -0.6L1 0.2L0.3 0.6L-0.8 0.5Z" fill={b.kind === "pistachio" ? "#c9d98c" : "#f1e3c6"} />
                    </>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Finition visible sur la tranche : dessus + bord */}
        {topLayers.map(([v0, v1, c]) => (
          <rect key={`t${v0}`} x="-0.5" y={v0} width="101" height={v1 - v0} fill={c} />
        ))}
        {sauce && <path d={band(-0.5, 2.4, 100.5, 0.4, rnd)} fill={sauce} />}
        {rimLayers.map(([u0, u1, c]) => (
          <rect key={`r${u0}`} x={u0} y="-0.5" width={u1 - u0} height={H + 1} fill={c} />
        ))}

        {/* Lumière : face de droite éclairée, face de gauche dans l'ombre */}
        <rect x="-0.5" y="-0.5" width="101.5" height={H + 1} fill={url("faceShade")} />
        <rect x="-0.5" y="-0.5" width="101.5" height={H + 1} fill={side === "r" ? "#fff" : "#2a1712"} opacity={side === "r" ? 0.04 : 0.1} />
        {ghost && <path d={`M0 0H100V${H}H0Z`} fill="none" stroke={outline} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />}
      </g>
    );
  };

  /* Feuille d'or : éclats irréguliers regroupés sur le flanc gauche */
  const goldFlakes = (() => {
    const r = rng(17);
    return Array.from({ length: 26 }, () => {
      const cxg = CX - 90 + r() * 32;
      const cyg = TOP + 14 + r() * 40 + (r() - 0.5) * 8;
      const n = 6 + Math.floor(r() * 3);
      const size = 1.5 + r() * 4;
      const pts = Array.from({ length: n }, (_, k) => {
        const a = (k / n) * Math.PI * 2;
        const d = size * (0.5 + r() * 0.7);
        return `${f(cxg + Math.cos(a) * d * 0.8)} ${f(cyg + Math.sin(a) * d)}`;
      });
      return { d: `M${pts.join(" L")}Z`, o: f(0.75 + r() * 0.25) };
    });
  })();

  /* ------------------------------ Bordures ------------------------------ */
  const rosettes = deco.has("border")
    ? [...Array.from({ length: 20 }, (_, i) => i * 18 + 4)]
        .filter((a) => a % 360 < CUT_R - 8 || a % 360 > CUT_L + 8)
        .map((a) => {
          const [x, y] = pt(a, TOP, R - 9, RY - 3.5);
          return { a, x, y: y - 3 };
        })
        .sort((p, q) => p.y - q.y)
    : [];
  const backRosettes = rosettes.filter((r) => Math.sin(rad(r.a)) < 0);
  const frontRosettes = rosettes.filter((r) => Math.sin(rad(r.a)) >= 0);

  // Bordures pochées (coquilles) en haut et en pied de gâteau, comme sur un bento cake
  const shellColor = finish === "ganache" ? lighten(exterior, 0.12) : finish === "fondant" ? "#fbf4ea" : lighten(exterior, 0.2);
  const shell = (a: number, y: number, r: number, ry: number) => {
    const [x, yy] = pt(a, y, r, ry);
    const angle = (Math.atan2(ry * Math.cos(rad(a)), -r * Math.sin(rad(a))) * 180) / Math.PI;
    return { a, x, y: yy, angle };
  };
  const topShells = tones.exterieur
    ? Array.from({ length: 45 }, (_, i) => i * 8 + 2)
        .filter((a) => a < CUT_R - 4 || a > CUT_L + 4)
        .map((a) => shell(a, TOP + 0.5, R - 1.5, RY - 0.6))
        .sort((p, q) => p.y - q.y)
    : [];
  const bottomShells = tones.exterieur
    ? [...Array.from({ length: 7 }, (_, i) => 2 + i * 8), ...Array.from({ length: 7 }, (_, i) => 130 + i * 8)].map((a) =>
        shell(a, BOT - 1.8, R + 0.6, RY + 0.2),
      )
    : [];
  // Inscription pochée : couleur contrastée selon la finition
  const writingColor = luminance(exterior) > 0.6 ? "#b9776d" : "#fbf4ea";
  // Le cœur se décale pour ne pas passer sous les fleurs ou le topper
  const writingX = deco.has("flowers") ? CX - 48 : deco.has("topper") ? CX + 26 : CX - 6;

  const drips = sauce
    ? [6, 13, 20, 27, 34, 41, 47, 133, 139, 146, 153, 160, 167, 174].map((a, i) => {
        const [x, y] = pt(a, TOP);
        const w = 5 * Math.max(0.4, Math.sin(rad(a)));
        const len = 6 + ((i * 37) % 19);
        return `M${f(x - w / 2)} ${f(y)}V${f(y + len)}C${f(x - w / 2)} ${f(y + len + w)} ${f(x + w / 2)} ${f(y + len + w)} ${f(x + w / 2)} ${f(y + len)}V${f(y)}Z`;
      })
    : [];

  const sideStops: [number, string][] =
    finish === "ganache"
      ? [[0, darken(exterior, 0.35)], [0.12, lighten(exterior, 0.08)], [0.17, lighten(exterior, 0.55)], [0.22, lighten(exterior, 0.08)], [0.5, exterior], [0.82, darken(exterior, 0.18)], [1, darken(exterior, 0.4)]]
      : [[0, darken(exterior, 0.2)], [0.2, lighten(exterior, finish === "fondant" ? 0.18 : 0.12)], [0.5, exterior], [0.84, darken(exterior, 0.08)], [1, darken(exterior, 0.25)]];

  return (
    <svg viewBox="22 40 276 252" className={className} aria-hidden="true" role="presentation">
      <defs>
        {/* Alvéoles de la mie, paillettes de lumière, satin de la crème (motifs légers, répétés) */}
        <pattern id={id("pores")} patternUnits="userSpaceOnUse" width={poreTile[0]} height={poreTile[1]}>
          {pores.map((p, i) => (
            <g key={i}>
              <ellipse cx={p.x} cy={p.y + p.ry * 0.5} rx={p.rx} ry={p.ry * 0.7} fill="#fff8e8" opacity="0.4" />
              <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="#5a3820" opacity={p.o} />
            </g>
          ))}
        </pattern>
        <pattern id={id("specks")} patternUnits="userSpaceOnUse" width="17" height="11">
          {[[2, 3], [8, 1.5], [13, 6], [5, 8.5], [11, 9.5], [15.5, 2]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="0.45" fill="#fffaf0" />
          ))}
        </pattern>
        <pattern id={id("satin")} patternUnits="userSpaceOnUse" width="41" height="7">
          <path d="M2 2h14M22 5h16M30 1.5h8" stroke="#fff" strokeWidth="0.5" strokeLinecap="round" />
        </pattern>
        <filter id={id("soft")} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <linearGradient id={id("cream")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(cream, 0.3)} />
          <stop offset="0.45" stopColor={cream} />
          <stop offset="1" stopColor={darken(cream, 0.08)} />
        </linearGradient>
        {tones.inserts.slice(0, 2).map((it, i) => {
          const gel = GEL_TONES.includes(it.tone as Tone);
          return (
            <linearGradient key={it.id} id={id(`insert${i}`)} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={lighten(it.color, gel ? 0.25 : 0.2)} />
              <stop offset="0.5" stopColor={it.color} />
              <stop offset="1" stopColor={darken(it.color, gel ? 0.3 : 0.1)} />
            </linearGradient>
          );
        })}
        {crunchColor && (
          <linearGradient id={id("spread")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={lighten(crunchColor, 0.2)} />
            <stop offset="1" stopColor={darken(crunchColor, 0.15)} />
          </linearGradient>
        )}
        <linearGradient id={id("faceShade")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a1712" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#2a1712" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("side")} gradientUnits="userSpaceOnUse" x1={CX - R} y1="0" x2={CX + R} y2="0">
          {sideStops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <radialGradient id={id("top")} gradientUnits="userSpaceOnUse" cx={CX - 30} cy={TOP - 14} r={R} gradientTransform={`translate(0 ${TOP}) scale(1 0.3) translate(0 ${-TOP})`}>
          <stop offset="0" stopColor={lighten(exterior, finish === "ganache" ? 0.22 : 0.14)} />
          <stop offset="0.7" stopColor={exterior} />
          <stop offset="1" stopColor={darken(exterior, 0.08)} />
        </radialGradient>
        {sauce && (
          <linearGradient id={id("sauce")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={lighten(sauce, 0.15)} />
            <stop offset="1" stopColor={darken(sauce, 0.2)} />
          </linearGradient>
        )}
        <linearGradient id={id("lid")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={KRAFT_IN} />
          <stop offset="1" stopColor={KRAFT} />
        </linearGradient>
        <radialGradient id={id("floor")} cx="0.5" cy="0.55" r="0.65">
          <stop offset="0.55" stopColor={KRAFT_IN} />
          <stop offset="1" stopColor={KRAFT} />
        </radialGradient>
        <pattern id={id("kraftFibers")} patternUnits="userSpaceOnUse" width="23" height="13">
          <path d="M2 3l5 1M12 9l6-1M16 2l3 2M5 10l3 0.5" stroke={KRAFT_DARK} strokeWidth="0.4" strokeLinecap="round" opacity="0.6" />
          <circle cx="20" cy="11" r="0.4" fill={KRAFT_DARK} />
        </pattern>
        <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e2a8" />
          <stop offset="0.45" stopColor="#d4a548" />
          <stop offset="0.7" stopColor="#f3d58a" />
          <stop offset="1" stopColor="#a8792a" />
        </linearGradient>
        <radialGradient id={id("sheen")}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("pearl")} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f1e8dc" />
          <stop offset="1" stopColor="#cdbfae" />
        </radialGradient>
        <clipPath id={id("sides")}>
          {SIDES.map((d) => (
            <path key={d} d={d} />
          ))}
        </clipPath>
        <clipPath id={id("topClip")}>
          <path d={topPath} />
        </clipPath>
      </defs>

      {/* Boîte bento en kraft : ombre, couvercle ouvert, fond, parois */}
      <rect x={BOX.l + 6} y={BOX.front - 4} width={BOX.r - BOX.l - 12} height="10" rx="5" fill="rgba(58,37,32,0.18)" filter={url("soft")} />
      <path
        d={`M${BOX.l} ${BOX.back - BOX.wall}L${BOX.l + 10} ${BOX.back - BOX.wall - BOX.lid}H${BOX.r - 10}L${BOX.r} ${BOX.back - BOX.wall}Z`}
        fill={url("lid")}
      />
      <rect x={BOX.l + 10} y={BOX.back - BOX.wall - BOX.lid} width={BOX.r - BOX.l - 20} height={BOX.lid} fill={url("kraftFibers")} opacity="0.3" />
      <path
        d={`M${BOX.l} ${BOX.back - BOX.wall}L${BOX.l + 10} ${BOX.back - BOX.wall - BOX.lid}H${BOX.r - 10}L${BOX.r} ${BOX.back - BOX.wall}`}
        fill="none"
        stroke={KRAFT_DARK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Languette de fermeture */}
      <path
        d={`M${CX - 16} ${BOX.back - BOX.wall - BOX.lid}Q${CX} ${BOX.back - BOX.wall - BOX.lid - 16} ${CX + 16} ${BOX.back - BOX.wall - BOX.lid}Z`}
        fill={KRAFT}
        stroke={KRAFT_DARK}
        strokeWidth="1"
      />
      {/* Charnière + paroi arrière (face intérieure) */}
      <rect x={BOX.l} y={BOX.back - BOX.wall} width={BOX.r - BOX.l} height={BOX.wall} fill={KRAFT_DARK} />
      <rect x={BOX.l} y={BOX.back - BOX.wall - 1.5} width={BOX.r - BOX.l} height="2.5" fill={KRAFT} />
      {/* Fond */}
      <rect x={BOX.l} y={BOX.back} width={BOX.r - BOX.l} height={BOX.front - BOX.back} fill={url("floor")} />
      <rect x={BOX.l} y={BOX.back} width={BOX.r - BOX.l} height={BOX.front - BOX.back} fill={url("kraftFibers")} opacity="0.3" />
      {/* Parois latérales (vues par la tranche) */}
      <rect x={BOX.l - 1} y={BOX.back - BOX.wall - 1.5} width="4" height={BOX.front - BOX.back + 1.5} fill={KRAFT} />
      <rect x={BOX.r - 3} y={BOX.back - BOX.wall - 1.5} width="4" height={BOX.front - BOX.back + 1.5} fill={KRAFT} />

      {/* Petit carton rond sous le gâteau */}
      <ellipse cx={CX} cy={BOT + 2} rx={R + 7} ry={RY + 3} fill="#d9cbb6" />
      <ellipse cx={CX} cy={BOT} rx={R + 7} ry={RY + 3} fill="#f6f1e8" />
      <ellipse cx={CX} cy={BOT + 2} rx={R + 2} ry={RY + 1} fill="rgba(58,37,32,0.16)" filter={url("soft")} />
      {/* Ombre au fond de la part retirée */}
      <path d={`M${CX} ${BOT}L${P(CUT_R, BOT)}A${R} ${RY} 0 0 1 ${P(CUT_L, BOT)}Z`} fill="rgba(58,37,32,0.08)" />

      {/* Flancs */}
      {SIDES.map((d) => (
        <path key={d} d={d} fill={url("side")} stroke={tones.exterieur ? "none" : outline} strokeDasharray={tones.exterieur ? undefined : "4 4"} />
      ))}
      {tones.exterieur && finish === "buttercream" && (
        <g clipPath={url("sides")} className="animate-fade-in">
          {[12, 26, 40, 54, 68, 80].map((dy) => (
            <g key={dy}>
              <path d={rimArc(-5, 185, TOP + dy)} stroke="#fff" strokeWidth="0.9" opacity="0.4" fill="none" />
              <path d={rimArc(-5, 185, TOP + dy + 1)} stroke="#2a1712" strokeWidth="0.5" opacity="0.06" fill="none" />
            </g>
          ))}
        </g>
      )}
      {deco.has("gold") && (
        <g clipPath={url("sides")} className="animate-fade-in">
          {goldFlakes.map((g, i) => (
            <path key={i} d={g.d} fill={url("gold")} opacity={g.o} stroke="#b8862d" strokeWidth="0.2" />
          ))}
        </g>
      )}

      {/* Dessus */}
      <path d={topPath} fill={url("top")} stroke={tones.exterieur ? "none" : outline} strokeDasharray={tones.exterieur ? undefined : "4 4"} />
      {tones.exterieur && finish === "buttercream" && (
        <g clipPath={url("topClip")} opacity="0.35">
          {[0.78, 0.52, 0.28].map((k) => (
            <ellipse key={k} cx={CX} cy={TOP} rx={R * k} ry={RY * k} fill="none" stroke="#fff" strokeWidth="0.8" />
          ))}
        </g>
      )}
      {tones.exterieur && finish !== "buttercream" && (
        <ellipse cx={CX - 36} cy={TOP - 12} rx="44" ry="8" fill={url("sheen")} opacity={finish === "ganache" ? 0.55 : 0.3} clipPath={url("topClip")} />
      )}

      {/* Faces coupées */}
      {face("l")}
      {face("r")}

      {/* Arête arrondie (pâte à sucre) */}
      {tones.exterieur && finish === "fondant" && (
        <g stroke="#fff" strokeWidth="2.2" opacity="0.4" fill="none" strokeLinecap="round">
          <path d={rimArc(2, CUT_R - 2, TOP + 1.6)} />
          <path d={rimArc(CUT_L + 2, 178, TOP + 1.6)} />
        </g>
      )}

      {/* Nappage coulant (suppléments) */}
      {sauce && (
        <g className="animate-fade-in">
          <path d={topPath} fill={url("sauce")} transform="translate(0 0.4)" />
          <ellipse cx={CX - 34} cy={TOP - 12} rx="40" ry="7" fill={url("sheen")} opacity="0.5" clipPath={url("topClip")} />
          <path d={rimArc(0, CUT_R - 1, TOP + 1.5)} stroke={sauce} strokeWidth="4" fill="none" />
          <path d={rimArc(CUT_L + 1, 180, TOP + 1.5)} stroke={sauce} strokeWidth="4" fill="none" />
          {drips.map((d) => (
            <path key={d} d={d} fill={url("sauce")} />
          ))}
          {drips.map((d, i) => (
            <path key={`h${i}`} d={d} fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.3" transform="translate(0.8 0)" strokeDasharray="0 2 6 100" />
          ))}
        </g>
      )}

      {/* Perles en pied de gâteau */}
      {deco.has("pearls") &&
        [...Array.from({ length: 10 }, (_, i) => 3 + i * 5), ...Array.from({ length: 10 }, (_, i) => 130 + i * 5)].map((a) => {
          const [x, y] = pt(a, BOT - 2.4);
          return <circle key={a} cx={f(x)} cy={f(y)} r="2.5" fill={url("pearl")} className="animate-fade-in" />;
        })}

      {bottomShells.map((sh) => (
        <Shell key={`b${sh.a}`} x={sh.x} y={sh.y} angle={sh.angle} color={shellColor} />
      ))}
      {topShells
        .filter((sh) => Math.sin(rad(sh.a)) < 0)
        .map((sh) => (
          <Shell key={`t${sh.a}`} x={sh.x} y={sh.y} angle={sh.angle} color={shellColor} />
        ))}

      {/* Inscription pochée (cœur) au centre du dessus */}
      {deco.has("writing") && (
        <g className="animate-fade-up" fill="none" stroke={writingColor} strokeLinecap="round" strokeLinejoin="round">
          <path
            transform={`translate(${writingX} ${TOP - 14}) scale(1.5 0.62)`}
            d="M0 10C-9 3 -13 -2 -11 -7C-9 -12 -2 -12 0 -6C2 -12 9 -12 11 -7C13 -2 9 3 0 10Z"
            strokeWidth="2.6"
          />
          {[-34, -26, 14, 22].map((dx, i) => (
            <circle key={dx} cx={writingX + 6 + dx} cy={TOP - 13 + (i % 2) * 3} r="1.3" fill={writingColor} stroke="none" />
          ))}
        </g>
      )}

      {backRosettes.map((r) => (
        <Rosette key={r.a} x={r.x} y={r.y} color={rosetteColor} />
      ))}

      {/* Décorations sur le dessus */}
      {deco.has("sprinkles") && (
        <g clipPath={url("topClip")} className="animate-fade-in">
          {Array.from({ length: 34 }, (_, i) => {
            const r2 = rng(i + 3);
            const a = r2() * 360;
            const k = 0.25 + r2() * 0.6;
            const [x, y] = pt(a, TOP, R * k, RY * k);
            return (
              <rect
                key={i}
                x={f(x)}
                y={f(y)}
                width="3.2"
                height="1.1"
                rx="0.55"
                transform={`rotate(${f(r2() * 180)} ${f(x)} ${f(y)})`}
                fill={["#e9a9b2", "#a7c4d9", "#f3d58a", "#b5c287", "#fffaf2"][i % 5]}
              />
            );
          })}
        </g>
      )}
      {deco.has("bow") && (
        <g transform={`translate(${CX - 56} ${TOP - 14}) scale(1.5)`} className="animate-fade-up">
          <path d="M0 0C-10 -10 -18 -4 -14 2C-11 6 -4 3 0 0Z" fill="#e9a9b2" stroke="#c97b84" strokeWidth="0.6" />
          <path d="M0 0C10 -10 18 -4 14 2C11 6 4 3 0 0Z" fill="#efb8bf" stroke="#c97b84" strokeWidth="0.6" />
          <path d="M-1 1L-6 10L-3 9L-1 12L0 2ZM1 1L6 10L3 9L1 12L0 2Z" fill="#df98a2" />
          <ellipse rx="3.4" ry="3" fill="#e39aa5" stroke="#c97b84" strokeWidth="0.6" />
          <path d="M-11 -2C-9 -5 -6 -4 -4 -2M11 -2C9 -5 6 -4 4 -2" stroke="#fff" strokeWidth="0.8" opacity="0.5" fill="none" />
          {[[24, 4, "#f3d58a"], [36, -2, "#a7c4d9"], [16, -10, "#fffaf2"]].map(([x, y, c]) => (
            <path
              key={String(c)}
              transform={`translate(${x} ${y}) scale(0.9 0.7)`}
              d="M0 -5L1.5 -1.5L5 -1.2L2.3 1.2L3.1 4.8L0 2.9L-3.1 4.8L-2.3 1.2L-5 -1.2L-1.5 -1.5Z"
              fill={String(c)}
              stroke={darken(String(c), 0.2)}
              strokeWidth="0.4"
            />
          ))}
        </g>
      )}
      {deco.has("topper") && (
        <g className="animate-fade-up">
          <path d={`M${CX - 30} ${TOP - 8}V${TOP - 36}M${CX - 18} ${TOP - 8}V${TOP - 36}`} stroke={url("gold")} strokeWidth="1.4" strokeLinecap="round" />
          <path
            transform={`translate(${CX - 24} ${TOP - 46}) scale(1.25)`}
            d="M0 10C-9 3 -13 -2 -11 -7C-9 -12 -2 -12 0 -6C2 -12 9 -12 11 -7C13 -2 9 3 0 10Z"
            fill="none"
            stroke={url("gold")}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {[[CX - 44, TOP - 58], [CX - 2, TOP - 60], [CX - 6, TOP - 36]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y - 3}L${x + 0.8} ${y - 0.8}L${x + 3} ${y}L${x + 0.8} ${y + 0.8}L${x} ${y + 3}L${x - 0.8} ${y + 0.8}L${x - 3} ${y}L${x - 0.8} ${y - 0.8}Z`} fill="#f3d58a" />
          ))}
        </g>
      )}
      {deco.has("flowers") && (
        <g className="animate-fade-up" transform={`translate(${CX + 24} ${TOP - 10}) scale(1.55) translate(${-CX - 24} ${-TOP + 10})`}>
          <Leaf x={CX + 4} y={TOP - 12} angle={200} len={14} />
          <Leaf x={CX + 44} y={TOP - 8} angle={-20} len={13} />
          <Leaf x={CX + 26} y={TOP - 4} angle={60} len={10} />
          <Leaf x={CX + 18} y={TOP - 22} angle={-110} len={10} />
          {[[CX + 2, TOP - 20], [CX + 50, TOP - 18], [CX + 40, TOP - 4], [CX - 4, TOP - 6]].map(([x, y]) => (
            <g key={x}>
              {[[0, 0], [2.4, -1.6], [-2, -2], [1, 2], [3.6, 1.2]].map(([dx, dy]) => (
                <g key={`${dx}${dy}`}>
                  <circle cx={x + dx} cy={y + dy} r="0.95" fill="#fffdf8" />
                  <circle cx={x + dx} cy={y + dy} r="0.3" fill="#e4d6b8" />
                </g>
              ))}
            </g>
          ))}
          <Rose x={CX + 14} y={TOP - 13} s={12} color="#ecb8b0" />
          <Rose x={CX + 36} y={TOP - 14} s={9.5} color="#f5ebe0" />
          <Rose x={CX + 26} y={TOP - 1} s={8.5} color="#d48c8a" />
        </g>
      )}
      {/* Cake design : seconde composition (rose, baies) en plus de la feuille d'or */}
      {deco.has("gold") && (
        <g className="animate-fade-up">
          <Leaf x={CX - 46} y={TOP - 14} angle={195} len={16} />
          <Leaf x={CX - 42} y={TOP - 12} angle={140} len={13} />
          {[[CX - 26, TOP - 8, "#c43a55"], [CX - 20, TOP - 12, "#3f3e66"], [CX - 30, TOP - 14, "#c43a55"], [CX - 22, TOP - 4, "#3f3e66"]].map(([x, y, c]) => (
            <g key={`${x}${y}`}>
              <circle cx={x} cy={y} r="3.4" fill={String(c)} stroke={darken(String(c), 0.3)} strokeWidth="0.4" />
              <circle cx={Number(x) - 1} cy={Number(y) - 1.2} r="1" fill="#fff" opacity="0.5" />
            </g>
          ))}
          <Rose x={CX - 44} y={TOP - 18} s={15} color="#f5ebe0" />
        </g>
      )}

      {frontRosettes.map((r) => (
        <Rosette key={r.a} x={r.x} y={r.y} color={rosetteColor} />
      ))}
      {topShells
        .filter((sh) => Math.sin(rad(sh.a)) >= 0)
        .map((sh) => (
          <Shell key={`t${sh.a}`} x={sh.x} y={sh.y} angle={sh.angle} color={shellColor} />
        ))}

      {/* Paroi avant de la boîte */}
      <rect x={BOX.l - 1} y={BOX.front - BOX.wall} width={BOX.r - BOX.l + 2} height={BOX.wall} fill={KRAFT} />
      <rect x={BOX.l - 1} y={BOX.front - BOX.wall} width={BOX.r - BOX.l + 2} height={BOX.wall} fill={url("kraftFibers")} opacity="0.6" />
      <rect x={BOX.l - 1} y={BOX.front - BOX.wall - 1.2} width={BOX.r - BOX.l + 2} height="1.6" fill={KRAFT_IN} />
    </svg>
  );
}
