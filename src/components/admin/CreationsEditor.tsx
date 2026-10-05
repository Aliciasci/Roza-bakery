"use client";

import { useState } from "react";
import { saveCreations } from "@/app/admin/actions";
import { CakeImage } from "@/components/ui/CakeImage";
import type { Creation, CreationCategoryInfo } from "@/lib/types";
import {
  AddButton,
  Card,
  ColorPicker,
  Field,
  ImageInput,
  LangTabs,
  PageTitle,
  RowActions,
  SaveBar,
  Toggle,
  TrInput,
  inputClass,
  makeId,
  move,
  useEditor,
  withKab,
  type EditLang,
} from "./ui";

interface Value {
  creations: Creation[];
  categories: CreationCategoryInfo[];
}

const ratios: { id: Creation["ratio"]; label: string }[] = [
  { id: "portrait", label: "Portrait (4:5)" },
  { id: "square", label: "Carré" },
  { id: "tall", label: "Haut (2:3)" },
];

export function CreationsEditor({ initial }: { initial: Value }) {
  const editor = useEditor(initial, saveCreations);
  const [lang, setLang] = useState<EditLang>("fr");
  const { creations, categories } = editor.value;
  const set = (patch: Partial<Value>) => editor.setValue({ ...editor.value, ...patch });
  const setCreation = (i: number, patch: Partial<Creation>) =>
    set({ creations: creations.map((c, j) => (j === i ? { ...c, ...patch } : c)) });

  return (
    <>
      <PageTitle title="Créations" intro="La galerie « Nos créations ». Les 6 premières apparaissent aussi sur la page d'accueil.">
        <LangTabs value={lang} onChange={setLang} />
      </PageTitle>

      <Card className="mb-6">
        <h2 className="font-serif text-2xl">Catégories (filtres)</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <li key={cat.id} className="flex items-center gap-1 rounded-full border border-chocolate/15 bg-cream py-1 pl-3 pr-1">
              <input
                aria-label={lang === "kab" ? `Traduction de « ${cat.label} »` : "Nom de la catégorie"}
                value={lang === "kab" ? (cat.kab?.label ?? "") : cat.label}
                placeholder={lang === "kab" ? cat.label : undefined}
                onChange={(e) =>
                  set({
                    categories: categories.map((c, j) =>
                      j !== i ? c : lang === "kab" ? { ...c, kab: withKab(c, "label", e.target.value || undefined) } : { ...c, label: e.target.value },
                    ),
                  })
                }
                className="w-28 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => set({ categories: categories.filter((_, j) => j !== i) })}
                aria-label={`Supprimer la catégorie ${cat.label}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cocoa hover:bg-ivory hover:text-berry"
              >
                ×
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => set({ categories: [...categories, { id: makeId("categorie"), label: "Nouvelle" }] })}
              className="min-h-10 rounded-full border border-dashed border-chocolate/30 px-4 text-sm font-semibold hover:border-chocolate"
            >
              + Catégorie
            </button>
          </li>
        </ul>
      </Card>

      <div className="space-y-4">
        {creations.map((c, i) => (
          <Card key={c.id}>
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="w-full shrink-0 md:w-44">
                <CakeImage src={c.image} alt={c.name} tone={c.tone} color={c.color} shape="aspect-[4/5] rounded-xl" sizes="176px" placeholderLabel="Sans photo" />
                <div className="mt-3 flex items-center gap-3">
                  <ImageInput compact value={c.image} onChange={(image) => setCreation(i, { image, placeholder: image ? undefined : c.placeholder })} />
                </div>
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <TrInput
                  lang={lang}
                  label="Nom"
                  fr={c.name}
                  kab={c.kab?.name}
                  onFr={(v) => setCreation(i, { name: v })}
                  onKab={(v) => setCreation(i, { kab: withKab(c, "name", v) })}
                />
                <Field label="Format">
                  {(id) => (
                    <select id={id} className={inputClass} value={c.ratio} onChange={(e) => setCreation(i, { ratio: e.target.value as Creation["ratio"] })}>
                      {ratios.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <TrInput
                  lang={lang}
                  label="Description"
                  multiline
                  fr={c.description}
                  kab={c.kab?.description}
                  onFr={(v) => setCreation(i, { description: v })}
                  onKab={(v) => setCreation(i, { kab: withKab(c, "description", v) })}
                  className="sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">Catégories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const on = c.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            setCreation(i, { categories: on ? c.categories.filter((x) => x !== cat.id) : [...c.categories, cat.id] })
                          }
                          className="min-h-9 rounded-full border border-chocolate/15 px-3.5 text-sm transition aria-pressed:border-chocolate aria-pressed:bg-chocolate aria-pressed:text-cream"
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-cocoa">
                    <ColorPicker tone={c.tone} color={c.color} onChange={({ tone, color }) => setCreation(i, { tone, color })} />
                    Couleur de fond (sans photo)
                  </div>
                  <Toggle label="Badge « Exemple »" checked={Boolean(c.placeholder)} onChange={(v) => setCreation(i, { placeholder: v || undefined })} />
                </div>
              </div>
              <div className="flex justify-end md:items-start">
                <RowActions
                  index={i}
                  length={creations.length}
                  label={c.name}
                  onMove={(d) => set({ creations: move(creations, i, d) })}
                  onDelete={() => set({ creations: creations.filter((_, j) => j !== i) })}
                />
              </div>
            </div>
          </Card>
        ))}
        <AddButton
          onClick={() =>
            set({
              creations: [
                { id: makeId("creation"), name: "Nouvelle création", description: "", categories: [], ratio: "portrait", tone: "rose" },
                ...creations,
              ],
            })
          }
        >
          Ajouter une création (en tête de galerie)
        </AddButton>
      </div>

      <SaveBar dirty={editor.dirty} status={editor.status} error={editor.error} onSave={editor.save} onReset={editor.reset} />
    </>
  );
}
