"use client";

import { useId, useRef, useState } from "react";
import { CloseIcon, ImageIcon } from "@/components/ui/Icons";
import { useI18n } from "@/i18n/client";
import { useObjectUrls } from "./useObjectUrls";

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"];

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  max: number;
  title?: string;
  description?: string;
}

export function PhotoUploader({
  files,
  onChange,
  max,
  title,
  description,
}: Props) {
  const { t } = useI18n();
  const tp = t.photos;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urls = useObjectUrls(files);
  const previews = files.map((file, i) => ({ file, url: urls[i] })).filter((p) => p.url);

  function add(list: FileList | null) {
    if (!list) return;
    setError(null);
    const incoming = Array.from(list);
    const valid: File[] = [];
    for (const f of incoming) {
      if (f.type && !ACCEPTED.includes(f.type)) {
        setError(tp.onlyImages);
        continue;
      }
      if (f.size > MAX_PHOTO_BYTES) {
        setError(tp.tooBig);
        continue;
      }
      if (files.some((existing) => existing.name === f.name && existing.size === f.size)) continue;
      valid.push(f);
    }
    const next = [...files, ...valid];
    if (next.length > max) setError(tp.max(max));
    onChange(next.slice(0, max));
    if (inputRef.current) inputRef.current.value = "";
  }

  const remaining = max - files.length;

  return (
    <div className="rounded-[1.6rem] border border-chocolate/12 bg-paper/70 p-5 md:p-7">
      <p className="script text-3xl leading-none text-rose-deep">{tp.script}</p>
      <h3 className="mt-2 text-[1.6rem] leading-tight">{title ?? tp.title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-cocoa">{description ?? tp.description}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={`mt-5 rounded-2xl border border-dashed transition-colors duration-300 ${
          dragging ? "border-chocolate bg-rose-soft" : "border-chocolate/25"
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="peer sr-only"
          disabled={remaining <= 0}
          onChange={(e) => add(e.target.files)}
        />
        <label
          htmlFor={inputId}
          className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl p-5 text-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-berry hover:bg-ivory/60 ${
            remaining <= 0 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <ImageIcon className="h-6 w-6 text-cocoa" />
          <span className="text-sm font-semibold text-chocolate">{tp.add}</span>
          <span className="text-xs text-cocoa">
            {remaining > 0 ? tp.upTo(max) : tp.maxReached}
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-berry">
          {error}
        </p>
      )}

      {previews.length > 0 && (
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5" aria-label={tp.listLabel}>
          {previews.map(({ file, url }, i) => (
            <li key={`${file.name}-${file.size}`} className="relative animate-fade-up">
              {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob) */}
              <img src={url} alt={tp.alt(i + 1)} className="aspect-square w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => onChange(files.filter((f) => f !== file))}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-chocolate text-cream shadow-md transition-transform active:scale-90"
                aria-label={tp.remove(i + 1)}
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
