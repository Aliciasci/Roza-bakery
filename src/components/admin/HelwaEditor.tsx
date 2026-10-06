"use client";

import { useState } from "react";
import { saveHelwa } from "@/app/admin/actions";
import { formatPrice } from "@/lib/helwa";
import type { HelwaCategory, HelwaItem } from "@/lib/types";
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

/** Prix en euros : accepte « 2,50 » comme « 2.50 ». Une saisie invalide est refusée à l'enregistrement. */
function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [text, setText] = useState(Number.isFinite(value) ? String(value).replace(".", ",") : "");
  const invalid = !Number.isFinite(value);
  const parse = (raw: string) => Number(raw.trim().replace(",", "."));
  // Après « Annuler » (valeur remise à zéro de l'extérieur), on réaffiche la valeur enregistrée
  const shown = invalid || parse(text) === value ? text : String(value).replace(".", ",");
  return (
    <Field label="Prix à la pièce (€)" hint={invalid ? "Prix invalide" : undefined}>
      {(id) => (
        <input
          id={id}
          inputMode="decimal"
          placeholder="Ex. 1,50"
          aria-invalid={invalid || undefined}
          className={`${inputClass} ${invalid ? "!border-berry" : ""}`}
          value={shown}
          onChange={(e) => {
            setText(e.target.value);
            const n = parse(e.target.value);
            onChange(e.target.value.trim() && Number.isFinite(n) && n >= 0 ? n : NaN);
          }}
        />
      )}
    </Field>
  );
}

export function HelwaEditor({ initial }: { initial: HelwaCategory[] }) {
  const editor = useEditor(initial, saveHelwa);
  const [lang, setLang] = useState<EditLang>("fr");
  const categories = editor.value;

  const setCategory = (ci: number, patch: Partial<HelwaCategory>) =>
    editor.setValue(categories.map((c, j) => (j === ci ? { ...c, ...patch } : c)));
  const setItem = (ci: number, ii: number, patch: Partial<HelwaItem>) =>
    setCategory(ci, { items: categories[ci].items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) });

  return (
    <>
      <PageTitle
        title="Helwa"
        intro="Les gâteaux vendus à la pièce (cookies, gâteaux orientaux…). La cliente choisit le nombre de pièces et voit le total se calculer en direct."
      >
        <LangTabs value={lang} onChange={setLang} />
      </PageTitle>

      <div className="space-y-8">
        {categories.map((category, ci) => (
          <section key={category.id} className="rounded-3xl bg-ivory/60 p-3 ring-1 ring-chocolate/8 md:p-4">
            <Card>
              <div className="flex items-start gap-3">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <TrInput
                    lang={lang}
                    label="Catégorie"
                    fr={category.label}
                    kab={category.kab?.label}
                    onFr={(v) => setCategory(ci, { label: v })}
                    onKab={(v) => setCategory(ci, { kab: withKab(category, "label", v) })}
                  />
                  <TrInput
                    lang={lang}
                    label="Description (facultatif)"
                    fr={category.description}
                    kab={category.kab?.description}
                    onFr={(v) => setCategory(ci, { description: v || undefined })}
                    onKab={(v) => setCategory(ci, { kab: withKab(category, "description", v) })}
                  />
                </div>
                <RowActions
                  index={ci}
                  length={categories.length}
                  label={category.label}
                  onMove={(d) => editor.setValue(move(categories, ci, d))}
                  onDelete={() => editor.setValue(categories.filter((_, j) => j !== ci))}
                />
              </div>
            </Card>

            <div className="mt-3 space-y-3">
              {category.items.map((item, ii) => (
                <Card key={item.id} className={item.available === false ? "opacity-60" : ""}>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="shrink-0">
                      <ImageInput compact value={item.image} onChange={(image) => setItem(ci, ii, { image })} />
                      {!item.image && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-cocoa">
                          <ColorPicker tone={item.tone} color={item.color} onChange={({ tone, color }) => setItem(ci, ii, { tone, color })} />
                          Couleur sans photo
                        </div>
                      )}
                    </div>
                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                      <TrInput
                        lang={lang}
                        label="Nom"
                        fr={item.name}
                        kab={item.kab?.name}
                        onFr={(v) => setItem(ci, ii, { name: v })}
                        onKab={(v) => setItem(ci, ii, { kab: withKab(item, "name", v) })}
                      />
                      <TrInput
                        lang={lang}
                        label="Description (facultatif)"
                        fr={item.description}
                        kab={item.kab?.description}
                        onFr={(v) => setItem(ci, ii, { description: v || undefined })}
                        onKab={(v) => setItem(ci, ii, { kab: withKab(item, "description", v) })}
                      />
                      <PriceInput value={item.price} onChange={(price) => setItem(ci, ii, { price })} />
                      <Field label="Minimum de pièces" hint="1 = pas de minimum">
                        {(id) => (
                          <input
                            id={id}
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={500}
                            className={inputClass}
                            value={item.minQuantity ?? 1}
                            onChange={(e) => setItem(ci, ii, { minQuantity: e.target.value === "" ? undefined : Number(e.target.value) })}
                          />
                        )}
                      </Field>
                      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                        <Toggle
                          label="Proposée sur le site"
                          description="Décochez pour la masquer (hors saison, rupture…)"
                          checked={item.available !== false}
                          onChange={(v) => setItem(ci, ii, { available: v ? undefined : false })}
                        />
                        {Number.isFinite(item.price) && (
                          <p className="text-xs text-cocoa">
                            Ex. 10 pièces = <strong className="text-chocolate">{formatPrice(Math.round(item.price * 1000) / 100)}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end md:items-start">
                      <RowActions
                        index={ii}
                        length={category.items.length}
                        label={item.name}
                        onMove={(d) => setCategory(ci, { items: move(category.items, ii, d) })}
                        onDelete={() => setCategory(ci, { items: category.items.filter((_, j) => j !== ii) })}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <AddButton
                onClick={() =>
                  setCategory(ci, {
                    items: [...category.items, { id: makeId("piece"), name: "", price: 1, tone: "golden" }],
                  })
                }
              >
                Ajouter une pièce dans « {category.label || "cette catégorie"} »
              </AddButton>
            </div>
          </section>
        ))}

        <AddButton onClick={() => editor.setValue([...categories, { id: makeId("categorie"), label: "Nouvelle catégorie", items: [] }])}>
          Ajouter une catégorie
        </AddButton>
      </div>

      <SaveBar dirty={editor.dirty} status={editor.status} error={editor.error} onSave={editor.save} onReset={editor.reset} />
    </>
  );
}
