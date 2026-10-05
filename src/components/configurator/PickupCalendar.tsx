"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { addDays, checkPickupDate, formatDateLong, parseISO, todayISO, toISO } from "@/lib/dates";
import type { ConfiguratorSite } from "./ConfiguratorProvider";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEKDAYS_LONG = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

interface Props {
  value: string;
  onChange: (iso: string) => void;
  site: ConfiguratorSite;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

/**
 * Calendrier de retrait : les dates trop proches (< délai minimum),
 * les jours de fermeture et les dates indisponibles sont désactivés.
 * Navigation clavier : flèches (jour / semaine), Page préc./suiv. (mois), Entrée pour choisir.
 */
export function PickupCalendar({ value, onChange, site, labelledBy, describedBy, invalid }: Props) {
  const today = useMemo(() => todayISO(), []);
  const minDate = addDays(today, site.minLeadDays);
  const maxDate = addDays(today, 365);

  const [focused, setFocused] = useState(value || minDate);
  const [month, setMonth] = useState(monthKey(value || minDate));
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);

  const isDisabled = (iso: string) => {
    const s = checkPickupDate(iso, site);
    return s === "too-soon" || s === "unavailable" || s === "invalid";
  };

  const days = useMemo(() => {
    const first = parseISO(`${month}-01`);
    const offset = (first.getUTCDay() + 6) % 7; // lundi = 0
    const start = addDays(toISO(first), -offset);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [month]);

  // Masque la dernière ligne si elle est entièrement dans le mois suivant
  const visibleDays = days.slice(35).every((d) => monthKey(d) !== month) ? days.slice(0, 35) : days;

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [focused, month]);

  /** Déplace le focus en sautant les dates indisponibles. */
  function moveFocus(iso: string, step: number) {
    let target = iso;
    while (target >= minDate && target <= maxDate && isDisabled(target)) target = addDays(target, step > 0 ? 1 : -1);
    if (target < minDate || target > maxDate) return;
    shouldFocus.current = true;
    setFocused(target);
    setMonth(monthKey(target));
  }

  function changeMonth(delta: number) {
    const d = parseISO(`${month}-01`);
    d.setUTCMonth(d.getUTCMonth() + delta);
    const next = toISO(d).slice(0, 7);
    if (next < monthKey(today) || next > monthKey(maxDate)) return;
    setMonth(next);
    setFocused(next === monthKey(minDate) ? minDate : `${next}-01`);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in moves) {
      e.preventDefault();
      moveFocus(addDays(focused, moves[e.key]), moves[e.key]);
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const delta = e.key === "PageUp" ? -30 : 30;
      moveFocus(addDays(focused, delta), delta);
    }
  }

  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    parseISO(`${month}-01`),
  );
  const canPrev = month > monthKey(today);
  const canNext = month < monthKey(maxDate);
  const enabledInMonth = visibleDays.filter((d) => monthKey(d) === month && !isDisabled(d));
  const focusInMonth =
    monthKey(focused) === month && !isDisabled(focused) ? focused : (enabledInMonth.find((d) => d === value) ?? enabledInMonth[0]);

  return (
    <div
      className={`rounded-[1.4rem] border bg-paper p-4 sm:p-5 ${invalid ? "border-berry" : "border-chocolate/12"}`}
      aria-describedby={describedBy}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canPrev}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ivory disabled:opacity-25"
          aria-label="Mois précédent"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <p className="font-serif text-xl capitalize text-chocolate" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          disabled={!canNext}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ivory disabled:opacity-25"
          aria-label="Mois suivant"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center" aria-hidden>
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-cocoa-light">
            {d}
          </span>
        ))}
      </div>

      <div ref={gridRef} role="group" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-y-1">
        {visibleDays.map((iso) => {
          const inMonth = monthKey(iso) === month;
          const disabled = isDisabled(iso);
          const selected = iso === value;
          const isToday = iso === today;
          const weekday = WEEKDAYS_LONG[(parseISO(iso).getUTCDay() + 6) % 7];
          if (!inMonth) return <span key={iso} aria-hidden />;
          return (
            <div key={iso} className="flex justify-center">
              <button
                type="button"
                data-date={iso}
                tabIndex={iso === focusInMonth ? 0 : -1}
                disabled={disabled}
                aria-pressed={selected}
                aria-label={`${formatDateLong(iso)}${disabled ? " — indisponible" : ""}`}
                title={disabled && iso < minDate ? `Minimum ${site.minLeadDays} jours à l'avance` : undefined}
                onClick={() => {
                  setFocused(iso);
                  onChange(iso);
                }}
                onFocus={() => setFocused(iso)}
                data-weekday={weekday}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full text-[0.9375rem] transition-[background-color,color,transform] duration-200 active:scale-90 ${
                  selected
                    ? "bg-chocolate font-semibold text-cream shadow-[0_8px_18px_-10px_rgba(58,37,32,0.8)]"
                    : disabled
                      ? "cursor-not-allowed text-chocolate/25 line-through decoration-chocolate/20"
                      : "text-chocolate hover:bg-rose-soft"
                }`}
              >
                {parseISO(iso).getUTCDate()}
                {isToday && !selected && <span aria-hidden className="absolute bottom-1.5 h-1 w-1 rounded-full bg-berry" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
