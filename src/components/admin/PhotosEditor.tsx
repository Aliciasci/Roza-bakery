"use client";

import { useState } from "react";
import { savePhotos } from "@/app/admin/actions";
import { CakeImage } from "@/components/ui/CakeImage";
import type { SitePhotos, Tone } from "@/lib/types";
import { Card, ImageInput, LangTabs, PageTitle, SaveBar, TrInput, useEditor, withKab, type EditLang } from "./ui";

const slots: {
  key: "heroImage" | "aboutImage";
  altKey: "heroImageAlt" | "aboutImageAlt";
  shape: string;
  placeholder: string;
  title: string;
  where: string;
  href: string;
  tone: Tone;
  defaultAlt: string;
  advice: string;
}[] = [
  {
    key: "heroImage",
    altKey: "heroImageAlt",
    title: "Photo principale de l'accueil",
    where: "Grande photo en arche, en haut de la page d'accueil.",
    href: "/",
    tone: "rose",
    shape: "aspect-[4/5] arch",
    placeholder: "Aucune photo",
    defaultAlt: "Gâteau signature Roza Bakery",
    advice: "Format vertical conseillé (4:5), au moins 1200 px de haut. Le gâteau bien centré : le haut de l'arche est arrondi.",
  },
  {
    key: "aboutImage",
    altKey: "aboutImageAlt",
    title: "Portrait — page À propos",
    where: "Photo en arche à côté de « Notre histoire ».",
    href: "/a-propos",
    tone: "sage",
    shape: "aspect-[4/5] arch",
    placeholder: "Aucune photo",
    defaultAlt: "Portrait de la pâtissière de Roza Bakery",
    advice: "Format vertical conseillé (4:5).",
  },
];

export function PhotosEditor({ initial }: { initial: SitePhotos }) {
  const editor = useEditor(initial, savePhotos);
  const [lang, setLang] = useState<EditLang>("fr");
  const photos = editor.value;
  const set = (patch: Partial<SitePhotos>) => editor.setValue({ ...photos, ...patch });

  return (
    <>
      <PageTitle title="Photos du site" intro="Les grandes photos des pages. Les photos des créations et des options se gèrent dans leurs sections.">
        <LangTabs value={lang} onChange={setLang} />
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-2">
        {slots.map((slot) => (
          <Card key={slot.key}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">{slot.title}</h2>
                <p className="mt-1 text-sm text-cocoa">{slot.where}</p>
              </div>
              <a href={slot.href} target="_blank" rel="noopener" className="shrink-0 text-sm font-semibold underline underline-offset-4">
                Voir ↗
              </a>
            </div>

            <div className="mx-auto mt-6 max-w-[16rem]">
              <CakeImage
                src={photos[slot.key]}
                alt={photos[slot.altKey] || slot.defaultAlt}
                tone={slot.tone}
                shape={slot.shape}
                sizes="256px"
                placeholderLabel={slot.placeholder}
              />
            </div>

            <div className="mt-6 space-y-4">
              <ImageInput value={photos[slot.key]} onChange={(url) => set({ [slot.key]: url })} />
              <p className="text-xs text-cocoa-light">{slot.advice}</p>
              <TrInput
                lang={lang}
                label="Description de la photo"
                hint="Lue par les lecteurs d'écran et utile au référencement."
                placeholder={slot.defaultAlt}
                fr={photos[slot.altKey]}
                kab={photos.kab?.[slot.altKey]}
                onFr={(v) => set({ [slot.altKey]: v || undefined })}
                onKab={(v) => set({ kab: withKab(photos, slot.altKey, v) })}
              />
            </div>
          </Card>
        ))}
      </div>

      <SaveBar dirty={editor.dirty} status={editor.status} error={editor.error} onSave={editor.save} onReset={editor.reset} />
    </>
  );
}
