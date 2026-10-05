"use client";

interface Props {
  names: string[];
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}

/** Progression segmentée : chaque segment déjà atteint est cliquable. */
export function StepProgress({ names, current, maxReached, onSelect }: Props) {
  const total = names.length;
  return (
    <nav aria-label="Progression de la création">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow" aria-live="polite">
          Étape <span className="text-chocolate">{String(current + 1).padStart(2, "0")}</span>
          <span className="text-cocoa-light"> / {String(total).padStart(2, "0")}</span>
        </p>
        <p className="truncate text-xs text-cocoa">{names[current]}</p>
      </div>
      <ol className="mt-3 flex gap-1.5">
        {names.map((name, i) => {
          const reachable = i <= maxReached;
          const done = i < current;
          const active = i === current;
          return (
            <li key={name} className="flex-1">
              <button
                type="button"
                disabled={!reachable || active}
                onClick={() => onSelect(i)}
                aria-current={active ? "step" : undefined}
                aria-label={`Étape ${i + 1} : ${name}${done ? " (complétée)" : ""}`}
                className="group block w-full py-2 disabled:cursor-default"
              >
                <span className="block h-[3px] overflow-hidden rounded-full bg-chocolate/10">
                  <span
                    className={`block h-full origin-left rounded-full transition-transform duration-700 ease-[var(--ease-soft)] ${
                      active ? "bg-berry" : "bg-chocolate"
                    } ${done || active ? "scale-x-100" : reachable ? "scale-x-100 opacity-30" : "scale-x-0"}`}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
