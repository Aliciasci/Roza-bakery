"use client";

import { useState } from "react";
import { CakeImage } from "@/components/ui/CakeImage";
import { useI18n } from "@/i18n/client";
import type { Creation, CreationCategory, CreationCategoryInfo } from "@/lib/types";

const ratioClass: Record<Creation["ratio"], string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  tall: "aspect-[2/3]",
};

interface Props {
  creations: Creation[];
  categories: CreationCategoryInfo[];
}

export function CreationsGallery({ creations, categories }: Props) {
  const { t } = useI18n();
  const [active, setActive] = useState<CreationCategory | "all">("all");
  const usedCategories = categories.filter((c) => creations.some((cr) => cr.categories.includes(c.id)));
  const visible = active === "all" ? creations : creations.filter((c) => c.categories.includes(active));
  const labelOf = (id: CreationCategory) => categories.find((c) => c.id === id)?.label ?? id;

  const filters = [{ id: "all" as const, label: t.creations.all }, ...usedCategories];

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-5 bg-cream/92 py-3 backdrop-blur-md md:top-20 md:-mx-10">
        <div role="group" aria-label={t.creations.filterLabel} className="no-scrollbar flex gap-2 overflow-x-auto px-5 md:flex-wrap md:px-10">
          {filters.map((f) => {
            const pressed = active === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(f.id)}
                className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-95 ${
                  pressed ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/15 text-chocolate hover:border-chocolate/40"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {t.creations.count(visible.length)}
      </p>

      <ul key={active} className="mt-8 columns-2 gap-3 sm:gap-5 lg:columns-3 lg:gap-7">
        {visible.map((c, i) => (
          <li
            key={c.id}
            className="mb-7 animate-fade-up break-inside-avoid lg:mb-10"
            style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
          >
            <figure className="group">
              <div className="overflow-hidden rounded-2xl">
                <div className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]">
                  <CakeImage
                    src={c.image}
                    alt={c.name}
                    tone={c.tone}
                    color={c.color}
                    placeholderLabel={t.common.photoComing}
                    slotLabel={t.common.photoSlot}
                    shape={`${ratioClass[c.ratio]} rounded-2xl`}
                    sizes="(min-width: 1024px) 30vw, 46vw"
                  />
                </div>
              </div>
              <figcaption className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="eyebrow !text-[0.625rem] sm:!text-[0.6875rem]">{c.categories.map(labelOf).join(" · ")}</p>
                  {c.placeholder && (
                    <span className="rounded-full bg-rose/60 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-chocolate">
                      {t.common.example}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-serif text-[1.25rem] leading-tight sm:text-[1.6rem]">{c.name}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-cocoa">{c.description}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {visible.length === 0 && <p className="py-20 text-center text-cocoa">{t.creations.empty}</p>}
    </div>
  );
}
