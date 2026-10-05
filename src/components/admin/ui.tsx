"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon, ImageIcon, PlusIcon } from "@/components/ui/Icons";
import { itemColor, toneColors, toneLabels } from "@/lib/tones";
import type { Tone } from "@/lib/types";
import type { ActionResult } from "@/app/admin/actions";

/* -------------------------------------------------------------------------- */
/* Édition avec enregistrement                                                 */
/* -------------------------------------------------------------------------- */

type EditorStatus = "idle" | "saving" | "saved" | "error" | "restored";

const draftKey = () => `roza:admin-draft:${window.location.pathname}`;

/**
 * Après un nouveau déploiement, une page restée ouverte appelle une action serveur
 * qui n'existe plus (« Server Action … was not found »). On le détecte pour recharger
 * la page sans perdre la saisie.
 */
function isStaleDeploymentError(e: unknown) {
  const text = e instanceof Error ? `${e.name} ${e.message}` : String(e);
  return /UnrecognizedActionError|Server Action .* was not found|Failed to find Server Action/i.test(text);
}

/** État local d'un éditeur + suivi des modifications + enregistrement via action serveur. */
export function useEditor<T>(initial: T, action: (value: T) => Promise<ActionResult>) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [status, setStatus] = useState<EditorStatus>("idle");
  const [error, setError] = useState("");
  const reloading = useRef(false);
  const dirty = JSON.stringify(value) !== saved;

  // Restaure une saisie conservée lors d'un rechargement automatique
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(draftKey());
      if (!draft) return;
      sessionStorage.removeItem(draftKey());
      setValue(JSON.parse(draft) as T);
      setStatus("restored");
    } catch {
      /* stockage indisponible */
    }
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (!reloading.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setStatus("saving");
    setError("");
    let result: ActionResult;
    try {
      result = await action(value);
    } catch (e) {
      if (isStaleDeploymentError(e)) {
        try {
          sessionStorage.setItem(draftKey(), JSON.stringify(value));
          reloading.current = true;
          window.location.reload();
          return;
        } catch {
          result = { ok: false, error: "Le site vient d'être mis à jour : rechargez la page puis recommencez." };
        }
      } else {
        result = { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    }
    if (result.ok) {
      setSaved(JSON.stringify(value));
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2500);
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  function reset() {
    setValue(JSON.parse(saved) as T);
    setStatus("idle");
    setError("");
  }

  return { value, setValue, dirty, status, error, save, reset };
}

export function SaveBar({
  dirty,
  status,
  error,
  onSave,
  onReset,
}: {
  dirty: boolean;
  status: EditorStatus;
  error: string;
  onSave: () => void;
  onReset: () => void;
}) {
  const visible = dirty || status === "saved" || status === "error";
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-safe transition-[opacity,transform] duration-300 lg:pl-64 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      aria-live="polite"
    >
      <div className="pointer-events-auto mb-3 flex w-full max-w-2xl flex-wrap items-center gap-3 rounded-2xl bg-chocolate px-4 py-3 text-cream shadow-2xl sm:flex-nowrap sm:px-5">
        <p className="min-w-0 flex-1 text-sm">
          {status === "error" ? (
            <span className="text-rose">{error}</span>
          ) : status === "restored" && dirty ? (
            "Le site a été mis à jour pendant votre saisie — vos modifications sont conservées, enregistrez-les."
          ) : status === "saved" && !dirty ? (
            <span className="inline-flex items-center gap-2">
              <CheckIcon className="h-4 w-4" /> Enregistré — le site est à jour
            </span>
          ) : (
            "Modifications non enregistrées"
          )}
        </p>
        {dirty && (
          <div className="flex gap-2">
            <button type="button" onClick={onReset} className="min-h-11 rounded-full px-4 text-sm text-cream/75 hover:text-cream">
              Annuler
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={status === "saving"}
              className="min-h-11 rounded-full bg-cream px-5 text-sm font-semibold text-chocolate transition active:scale-95 disabled:opacity-60"
            >
              {status === "saving" ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Champs                                                                      */
/* -------------------------------------------------------------------------- */

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: (id: string) => ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-cocoa-light">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-chocolate/15 bg-paper px-3.5 py-2.5 text-[15px] text-chocolate placeholder:text-cocoa-light focus:border-chocolate focus:outline-none focus:ring-4 focus:ring-rose/50";

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  multiline,
  className,
  type = "text",
}: {
  label: string;
  value: string | undefined | null;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  className?: string;
  type?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      {(id) =>
        multiline ? (
          <textarea id={id} rows={3} className={`${inputClass} resize-y`} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input id={id} type={type} className={inputClass} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        )
      }
    </Field>
  );
}

export function NumberInput({ label, value, onChange, min, max, hint }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          className={inputClass}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      )}
    </Field>
  );
}

export function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-chocolate/15 transition-colors peer-checked:bg-sage-deep peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-berry" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="text-sm">
        <span className="font-medium text-chocolate">{label}</span>
        {description && <span className="block text-xs text-cocoa">{description}</span>}
      </span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Langue d'édition (français / kabyle)                                        */
/* -------------------------------------------------------------------------- */

export type EditLang = "fr" | "kab";

/** Onglets « Français / Taqbaylit » : en mode kabyle, les champs texte éditent la traduction. */
export function LangTabs({ value, onChange }: { value: EditLang; onChange: (lang: EditLang) => void }) {
  const tabs: { id: EditLang; label: string; extra?: string }[] = [
    { id: "fr", label: "Français" },
    { id: "kab", label: "Taqbaylit", extra: "ⵜⴰⵇⴱⴰⵢⵍⵉⵜ" },
  ];
  return (
    <div className="flex flex-col items-start gap-1.5 md:items-end">
      <div role="tablist" aria-label="Langue des textes" className="inline-flex rounded-full bg-paper p-1 ring-1 ring-chocolate/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={value === tab.id}
            onClick={() => onChange(tab.id)}
            className="flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition aria-selected:bg-chocolate aria-selected:text-cream"
          >
            {tab.label}
            {tab.extra && <span className="font-[family-name:var(--font-tifinagh)] text-xs opacity-70">{tab.extra}</span>}
          </button>
        ))}
      </div>
      {value === "kab" && (
        <p className="max-w-xs text-xs text-cocoa md:text-right">
          Champ vide = le texte français est affiché sur la version kabyle.
        </p>
      )}
    </div>
  );
}

/**
 * Champ texte bilingue : en français, édite la valeur ; en kabyle, édite la traduction
 * (le texte français sert d'exemple en grisé).
 */
export function TrInput({
  lang,
  label,
  fr,
  kab,
  onFr,
  onKab,
  multiline,
  placeholder,
  hint,
  className,
}: {
  lang: EditLang;
  label: string;
  fr: string | undefined | null;
  kab: string | undefined;
  onFr: (value: string) => void;
  onKab: (value: string | undefined) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  if (lang === "fr") {
    return <TextInput label={label} value={fr} onChange={onFr} multiline={multiline} placeholder={placeholder} hint={hint} className={className} />;
  }
  return (
    <TextInput
      label={`${label} · taqbaylit`}
      value={kab}
      onChange={(v) => onKab(v || undefined)}
      multiline={multiline}
      placeholder={fr || placeholder}
      hint={fr ? `FR : ${fr}` : hint}
      className={className}
    />
  );
}

/** Met à jour un champ du bloc de traduction `kab` d'un élément. */
export function withKab<T extends { kab?: object }>(item: T, field: string, value: unknown): T["kab"] {
  return { ...(item.kab ?? {}), [field]: value } as T["kab"];
}

/* -------------------------------------------------------------------------- */
/* Liste de valeurs (saveurs…)                                                 */
/* -------------------------------------------------------------------------- */

export function TagsInput({
  label,
  values,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");

  function add() {
    const items = draft
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v && !values.some((x) => x.toLowerCase() === v.toLowerCase()));
    if (items.length) onChange([...values, ...items]);
    setDraft("");
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-chocolate/15 bg-paper p-1.5 focus-within:border-chocolate focus-within:ring-4 focus-within:ring-rose/50">
        {values.map((v, i) => (
          <span key={v} className="flex items-center gap-0.5 rounded-full bg-rose-soft py-1 pl-3 pr-1 text-sm">
            {v}
            <button
              type="button"
              aria-label={`Retirer « ${v} »`}
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-cocoa hover:bg-rose hover:text-berry"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={values.length ? "Ajouter…" : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={add}
          className="min-w-32 flex-1 bg-transparent px-2 py-1.5 text-[15px] placeholder:text-cocoa-light focus:outline-none"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-cocoa-light">{hint}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Couleur                                                                     */
/* -------------------------------------------------------------------------- */

export function ColorPicker({ tone, color, onChange }: { tone: Tone; color?: string; onChange: (v: { tone: Tone; color?: string }) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = itemColor({ tone, color });

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Choisir la couleur"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-chocolate/15 bg-paper"
      >
        <span className="h-7 w-7 rounded-full ring-1 ring-chocolate/10" style={{ background: current }} />
      </button>
      {open && (
        <div className="absolute left-0 top-12 z-30 w-72 rounded-2xl bg-paper p-4 shadow-2xl ring-1 ring-chocolate/10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">Teintes</p>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {(Object.keys(toneColors) as Tone[]).map((t) => (
              <button
                key={t}
                type="button"
                title={toneLabels[t]}
                aria-label={toneLabels[t]}
                onClick={() => {
                  onChange({ tone: t, color: undefined });
                  setOpen(false);
                }}
                className={`h-8 w-8 rounded-full ring-1 ring-chocolate/10 transition-transform hover:scale-110 ${!color && tone === t ? "outline-2 outline-offset-2 outline-chocolate" : ""}`}
                style={{ background: toneColors[t] }}
              />
            ))}
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input
              type="color"
              value={current}
              onChange={(e) => onChange({ tone, color: e.target.value })}
              className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent"
            />
            Couleur sur mesure
          </label>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Image                                                                       */
/* -------------------------------------------------------------------------- */

export function ImageInput({ value, onChange, label = "Photo", compact }: { value?: string; onChange: (url: string | undefined) => void; label?: string; compact?: boolean }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Envoi impossible");
      onChange(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible");
    } finally {
      setBusy(false);
    }
  }

  const size = compact ? "h-16 w-16" : "h-28 w-28";

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className={`relative ${size} shrink-0 overflow-hidden rounded-xl bg-ivory ring-1 ring-chocolate/10`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- aperçu admin
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-cocoa-light">
              <ImageIcon className="h-6 w-6" />
            </span>
          )}
          {busy && <span className="absolute inset-0 animate-pulse bg-cream/70" />}
        </div>
        <div className="flex flex-col items-start gap-1">
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="peer sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
          <label
            htmlFor={id}
            className="cursor-pointer rounded-full border border-chocolate/20 px-3.5 py-2 text-xs font-semibold text-chocolate peer-focus-visible:outline-2 peer-focus-visible:outline-berry hover:border-chocolate"
          >
            {value ? "Changer" : label === "Photo" ? "Ajouter une photo" : label}
          </label>
          {value && (
            <button type="button" onClick={() => onChange(undefined)} className="px-1 text-xs text-cocoa underline underline-offset-2 hover:text-berry">
              Retirer
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-berry">{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Listes                                                                      */
/* -------------------------------------------------------------------------- */

export function move<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function RowActions({
  index,
  length,
  onMove,
  onDelete,
  label,
}: {
  index: number;
  length: number;
  onMove: (delta: number) => void;
  onDelete: () => void;
  label: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const btn = "flex h-9 w-9 items-center justify-center rounded-full text-cocoa transition hover:bg-ivory hover:text-chocolate disabled:opacity-25";
  return (
    <div className="flex items-center gap-0.5">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Monter « ${label} »`}>
        <ArrowLeftIcon className="h-4 w-4 rotate-90" />
      </button>
      <button type="button" className={btn} disabled={index === length - 1} onClick={() => onMove(1)} aria-label={`Descendre « ${label} »`}>
        <ArrowRightIcon className="h-4 w-4 rotate-90" />
      </button>
      {confirming ? (
        <span className="ml-1 flex items-center gap-1">
          <button type="button" onClick={onDelete} className="rounded-full bg-berry px-3 py-1.5 text-xs font-semibold text-white">
            Supprimer
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="px-2 text-xs text-cocoa">
            Non
          </button>
        </span>
      ) : (
        <button type="button" className={`${btn} hover:!text-berry`} onClick={() => setConfirming(true)} aria-label={`Supprimer « ${label} »`}>
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-chocolate/25 text-sm font-semibold text-chocolate transition hover:border-chocolate hover:bg-paper"
    >
      <PlusIcon className="h-4 w-4" />
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-paper p-5 ring-1 ring-chocolate/8 md:p-6 ${className}`}>{children}</div>;
}

export function PageTitle({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

/** Identifiant stable généré à partir d'un libellé. */
export function makeId(label: string, prefix = "") {
  const slug = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${prefix}${slug || "element"}-${Math.random().toString(36).slice(2, 6)}`;
}
