import { findOption } from "@/lib/composition";
import { itemColor, toneColor } from "@/lib/tones";
import type { CompositionDraft, CompositionStep, CompositionStepId, Tone } from "@/lib/types";

/** Couleurs de la coupe : nom de teinte (`Tone`) ou couleur hexadécimale. */
type Paint = Tone | string;

export interface CakeTones {
  base?: Paint;
  creme?: Paint;
  inserts: Paint[];
  croustillant: Paint[];
  fruits: Paint[];
  supplements: Paint[];
  exterieur?: Paint;
  decoration: boolean;
}

const paint = (p: Paint) => (p.startsWith("#") ? p : toneColor(p as Tone));

export function computeCakeTones(steps: CompositionStep[], draft: CompositionDraft): CakeTones {
  const tonesFor = (id: CompositionStepId): string[] => {
    const step = steps.find((s) => s.id === id);
    if (!step) return [];
    return (draft.selections[id] ?? [])
      .map((optionId) => findOption(step, optionId))
      .filter((o) => o !== undefined)
      .map((o) => itemColor(o));
  };
  return {
    base: tonesFor("base")[0],
    creme: tonesFor("creme")[0],
    inserts: tonesFor("inserts"),
    croustillant: tonesFor("croustillant"),
    fruits: tonesFor("fruits"),
    supplements: tonesFor("supplements"),
    exterieur: tonesFor("exterieur")[0],
    decoration: (draft.selections.decoration?.length ?? 0) > 0,
  };
}

const EMPTY = "#f1e9de";
const fill = "transition-[fill,opacity] duration-500 ease-[var(--ease-soft)]";

/**
 * Coupe du gâteau dessinée en SVG : chaque couche prend la couleur
 * des choix effectués. Purement décoratif (le résumé texte reste la référence).
 */
export function CakeCrossSection({ tones, className = "" }: { tones: CakeTones; className?: string }) {
  const sponge = tones.base ? paint(tones.base) : EMPTY;
  const cream = tones.creme ? paint(tones.creme) : "#f8f2ea";
  const insert = tones.inserts.length ? paint(tones.inserts[0]) : cream;
  const exterior = tones.exterieur ? paint(tones.exterieur) : "#f7f0e6";
  const outline = "rgba(58,37,32,0.22)";
  const xs = Array.from({ length: 9 }, (_, i) => 80 + i * 15.5);

  return (
    <svg viewBox="0 0 280 240" className={className} aria-hidden="true" role="presentation">
      {/* Ombre + présentoir */}
      <ellipse cx="140" cy="216" rx="112" ry="8" fill="rgba(58,37,32,0.07)" />
      <path d="M34 206h212" stroke="rgba(58,37,32,0.35)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M128 206v8h24v-8" fill="none" stroke="rgba(58,37,32,0.25)" strokeWidth="1" />

      {/* Enrobage extérieur */}
      <rect
        x="54"
        y="72"
        width="172"
        height="134"
        rx="12"
        fill={exterior}
        stroke={tones.exterieur ? "rgba(58,37,32,0.12)" : outline}
        strokeDasharray={tones.exterieur ? undefined : "4 4"}
        className={fill}
      />

      {/* Face coupée — de bas en haut */}
      <rect x="64" y="170" width="152" height="30" fill={sponge} className={fill} />
      <rect x="64" y="158" width="152" height="12" fill={cream} className={fill} />
      <rect x="64" y="150" width="152" height="8" fill={insert} className={fill} />
      <rect x="64" y="122" width="152" height="28" fill={sponge} className={fill} />
      <rect x="64" y="110" width="152" height="12" fill={cream} className={fill} />
      <rect x="64" y="82" width="152" height="28" fill={sponge} className={fill} />

      {/* Texture génoise (alvéoles) */}
      {tones.base &&
        [92, 136, 186].map((y, row) =>
          xs.slice(row % 2, 9).map((x, i) =>
            i % 2 === 0 ? (
              <circle key={`a-${row}-${x}`} cx={x + 4} cy={y + (row === 1 ? 0 : 2) + (i % 3)} r="1.1" fill="rgba(58,37,32,0.12)" />
            ) : null,
          ),
        )}

      {/* Fruits dans la première crème */}
      {xs.map((x, i) =>
        tones.fruits.length ? (
          <circle
            key={`f-${x}`}
            cx={x}
            cy="164"
            r={i % 2 ? 3.2 : 4}
            fill={paint(tones.fruits[i % tones.fruits.length])}
            className="animate-pop"
            style={{ animationDelay: `${i * 30}ms`, transformBox: "fill-box", transformOrigin: "center" }}
          />
        ) : null,
      )}

      {/* Croustillant entre insert et génoise */}
      {tones.croustillant.length > 0 &&
        Array.from({ length: 18 }, (_, i) => (
          <rect
            key={`c-${i}`}
            x={68 + i * 8.2}
            y={i % 2 ? 147.5 : 149}
            width="3.2"
            height="2.4"
            rx="0.6"
            transform={`rotate(${(i * 37) % 60 - 30} ${69.6 + i * 8.2} 149)`}
            fill={paint(tones.croustillant[i % tones.croustillant.length])}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 18}ms` }}
          />
        ))}

      {/* Suppléments : nappage ondulé dans la seconde crème */}
      {tones.supplements.length > 0 && (
        <path
          d="M66 116q9-5 18 0t18 0 18 0 18 0 18 0 18 0 18 0 18 0"
          fill="none"
          stroke={paint(tones.supplements[0])}
          strokeWidth="2.6"
          strokeLinecap="round"
          className="animate-fade-in"
        />
      )}

      {/* Contour pointillé tant que la base n'est pas choisie */}
      {!tones.base && (
        <rect x="64" y="82" width="152" height="118" fill="none" stroke={outline} strokeDasharray="3 4" />
      )}

      {/* Décoration */}
      {tones.decoration && (
        <g className="animate-fade-up">
          <path d="M96 72c2-8 9-11 14-9M184 72c-2-8-9-11-14-9" stroke="#7d8b6f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <ellipse cx="104" cy="64" rx="5" ry="2.4" transform="rotate(-25 104 64)" fill="#a7b39a" />
          <ellipse cx="176" cy="64" rx="5" ry="2.4" transform="rotate(25 176 64)" fill="#a7b39a" />
          {[
            { cx: 118, cy: 62, r: 9, c: "#eac3bd" },
            { cx: 140, cy: 56, r: 12, c: "#f5e6e1" },
            { cx: 162, cy: 62, r: 9, c: "#d9a39b" },
          ].map((f) => (
            <g key={f.cx}>
              <circle cx={f.cx} cy={f.cy} r={f.r} fill={f.c} stroke="rgba(58,37,32,0.12)" />
              <circle cx={f.cx} cy={f.cy} r={f.r * 0.45} fill="none" stroke="rgba(58,37,32,0.18)" />
              <circle cx={f.cx} cy={f.cy} r="1.4" fill="#9e2f45" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
