"use client";

import { useState } from "react";
import { saveSteps } from "@/app/admin/actions";
import { OptionSwatch } from "@/components/configurator/OptionVisual";
import type { CompositionStep, ConfigOption, OptionGroup } from "@/lib/types";
import {
  AddButton,
  inputClass,
  Card,
  ColorPicker,
  ImageInput,
  LangTabs,
  PageTitle,
  RowActions,
  SaveBar,
  TagsInput,
  TextInput,
  Toggle,
  TrInput,
  move,
  useEditor,
  withKab,
  type EditLang,
} from "./ui";

const rand = () => Math.random().toString(36).slice(2, 8);

export function ConfiguratorEditor({ initial }: { initial: CompositionStep[] }) {
  const editor = useEditor(initial, saveSteps);
  const steps = editor.value;
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState<EditLang>("fr");
  const step = steps[current];

  const setStep = (patch: Partial<CompositionStep>) =>
    editor.setValue(steps.map((s, i) => (i === current ? { ...s, ...patch } : s)));
  const setGroups = (groups: OptionGroup[]) => setStep({ groups });
  const setGroup = (gi: number, patch: Partial<OptionGroup>) =>
    setGroups(step.groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const setOption = (gi: number, oi: number, patch: Partial<ConfigOption>) =>
    setGroup(gi, { options: step.groups[gi].options.map((o, i) => (i === oi ? { ...o, ...patch } : o)) });

  const optionCount = step.groups.reduce((n, g) => n + g.options.length, 0);

  return (
    <>
      <PageTitle
        title="Configurateur"
        intro="Modifiez les étapes de « Composer mon gâteau » : ajoutez une crème, un fruit de saison, masquez une option temporairement, changez les textes ou les photos."
      >
        <LangTabs value={lang} onChange={setLang} />
        <a
          href={`${lang === "kab" ? "/kab" : ""}/composer?etape=${current + 1}`}
          target="_blank"
          rel="noopener"
          className="self-start rounded-full border border-chocolate/20 px-4 py-2 text-sm font-semibold hover:border-chocolate"
        >
          Voir l&apos;étape sur le site ↗
        </a>
      </PageTitle>

      {/* Onglets des étapes */}
      <div role="tablist" aria-label="Étapes" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {steps.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={i === current}
            onClick={() => setCurrent(i)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-chocolate/15 px-4 text-sm transition aria-selected:border-chocolate aria-selected:bg-chocolate aria-selected:text-cream"
          >
            <span className="font-serif italic opacity-70">{String(i + 1).padStart(2, "0")}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-6" role="tabpanel">
        {/* Réglages de l'étape */}
        <Card>
          <h2 className="font-serif text-2xl">Textes et règles de l&apos;étape</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(
              [
                ["name", "Nom de l'étape", false, ""],
                ["summaryLabel", "Libellé dans le résumé", false, ""],
                ["title", "Titre", false, "md:col-span-2"],
                ["subtitle", "Sous-titre", true, "md:col-span-2"],
                ["notesLabel", "Question du champ « précision »", false, ""],
                ["notesPlaceholder", "Exemple dans le champ « précision »", false, ""],
              ] as const
            ).map(([field, label, multiline, className]) => (
              <TrInput
                key={field}
                lang={lang}
                label={label}
                multiline={multiline}
                className={className}
                placeholder={field === "notesLabel" ? "Une précision ?" : undefined}
                fr={step[field]}
                kab={step.kab?.[field]}
                onFr={(v) =>
                  setStep({ [field]: field === "notesLabel" || field === "notesPlaceholder" ? v || undefined : v })
                }
                onKab={(v) => setStep({ kab: withKab(step, field, v) })}
              />
            ))}
          </div>
          <div className="mt-5 grid gap-2 border-t border-chocolate/8 pt-5 md:grid-cols-3">
            <Toggle
              label="Plusieurs choix possibles"
              description={step.mode === "multiple" ? "La cliente peut cocher plusieurs options" : "Un seul choix"}
              checked={step.mode === "multiple"}
              onChange={(v) => setStep({ mode: v ? "multiple" : "single" })}
            />
            <Toggle
              label="Étape obligatoire"
              description={step.required ? "Un choix est nécessaire pour continuer" : "La cliente peut passer"}
              checked={step.required}
              onChange={(v) => setStep({ required: v })}
            />
            <Toggle
              label="Photos d'inspiration"
              description="Permettre l'envoi de photos ici"
              checked={Boolean(step.allowInspiration)}
              onChange={(v) => setStep({ allowInspiration: v || undefined })}
            />
          </div>
        </Card>

        {/* Groupes et options */}
        {step.groups.map((group, gi) => (
          <Card key={group.id}>
            <div className="flex flex-wrap items-end gap-3">
              <TrInput
                lang={lang}
                label={step.groups.length > 1 ? `Groupe ${gi + 1}` : "Titre du groupe (facultatif)"}
                fr={group.label}
                kab={group.kab?.label}
                placeholder="Ex. Crèmes, Fruits secs…"
                onFr={(v) => setGroup(gi, { label: v || undefined })}
                onKab={(v) => setGroup(gi, { kab: withKab(group, "label", v) })}
                className="min-w-48 flex-1"
              />
              {step.groups.length > 1 && (
                <RowActions
                  index={gi}
                  length={step.groups.length}
                  label={group.label ?? `Groupe ${gi + 1}`}
                  onMove={(d) => setGroups(move(step.groups, gi, d))}
                  onDelete={() => setGroups(step.groups.filter((_, i) => i !== gi))}
                />
              )}
            </div>

            <ul className="mt-5 divide-y divide-chocolate/8 border-y border-chocolate/8">
              {group.options.map((option, oi) => (
                <li key={option.id} className={`py-4 ${option.available === false ? "opacity-60" : ""}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="flex items-center gap-3">
                      <ColorPicker
                        tone={option.tone}
                        color={option.color}
                        onChange={({ tone, color }) => setOption(gi, oi, { tone, color })}
                      />
                      <ImageInput compact value={option.image} onChange={(image) => setOption(gi, oi, { image })} />
                    </div>
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <TrInput
                        lang={lang}
                        label="Nom"
                        fr={option.label}
                        kab={option.kab?.label}
                        onFr={(v) => setOption(gi, oi, { label: v })}
                        onKab={(v) => setOption(gi, oi, { kab: withKab(option, "label", v) })}
                      />
                      <TrInput
                        lang={lang}
                        label="Description (facultatif)"
                        fr={option.description}
                        kab={option.kab?.description}
                        onFr={(v) => setOption(gi, oi, { description: v || undefined })}
                        onKab={(v) => setOption(gi, oi, { kab: withKab(option, "description", v) })}
                      />
                      <div className="sm:col-span-2">
                        {lang === "kab" ? (
                          option.variants?.length ? (
                            <div>
                              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cocoa">Saveurs · taqbaylit</p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {option.variants.map((v, vi) => (
                                  <input
                                    key={v}
                                    aria-label={`Traduction de « ${v} »`}
                                    className={inputClass}
                                    placeholder={v}
                                    value={option.kab?.variants?.[vi] ?? ""}
                                    onChange={(e) => {
                                      const list = option.variants!.map((_, k) => option.kab?.variants?.[k] ?? "");
                                      list[vi] = e.target.value;
                                      setOption(gi, oi, { kab: withKab(option, "variants", list.some(Boolean) ? list : undefined) });
                                    }}
                                  />
                                ))}
                              </div>
                              <TrInput
                                lang={lang}
                                label="Intitulé du choix"
                                fr={option.variantsLabel ?? "Saveur"}
                                kab={option.kab?.variantsLabel}
                                onFr={() => {}}
                                onKab={(v) => setOption(gi, oi, { kab: withKab(option, "variantsLabel", v) })}
                                className="mt-3 max-w-xs"
                              />
                            </div>
                          ) : null
                        ) : (
                        <>
                        <TagsInput
                          label="Saveurs proposées (facultatif)"
                          placeholder="Ex. Framboise, Mangue… puis Entrée"
                          hint={
                            option.variants?.length
                              ? "La cliente devra choisir une saveur quand elle coche cette option."
                              : "Laissez vide si l'option n'a pas de saveur à choisir."
                          }
                          values={option.variants ?? []}
                          onChange={(variants) => setOption(gi, oi, { variants: variants.length ? variants : undefined })}
                        />
                        {option.variants?.length ? (
                          <TextInput
                            label="Intitulé du choix"
                            placeholder="Saveur"
                            value={option.variantsLabel}
                            onChange={(v) => setOption(gi, oi, { variantsLabel: v || undefined })}
                            className="mt-3 max-w-xs"
                          />
                        ) : null}
                        </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-6 sm:col-span-2">
                        <Toggle
                          label="Disponible"
                          checked={option.available !== false}
                          onChange={(v) => setOption(gi, oi, { available: v ? undefined : false })}
                        />
                        <Toggle
                          label="Champ libre"
                          description="Pour « Autre », « sur demande »…"
                          checked={Boolean(option.custom)}
                          onChange={(v) => setOption(gi, oi, { custom: v || undefined })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                      <span aria-hidden className="md:hidden">
                        <OptionSwatch option={option} selected={false} />
                      </span>
                      <RowActions
                        index={oi}
                        length={group.options.length}
                        label={option.label}
                        onMove={(d) => setGroup(gi, { options: move(group.options, oi, d) })}
                        onDelete={() => setGroup(gi, { options: group.options.filter((_, i) => i !== oi) })}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <AddButton
                onClick={() =>
                  setGroup(gi, {
                    options: [...group.options, { id: `${step.id}-${rand()}`, label: "", tone: "cream" }],
                  })
                }
              >
                Ajouter une option{group.label ? ` dans « ${group.label} »` : ""}
              </AddButton>
            </div>
          </Card>
        ))}

        <AddButton onClick={() => setGroups([...step.groups, { id: `${step.id}-groupe-${rand()}`, label: "Nouveau groupe", options: [] }])}>
          Ajouter un groupe d&apos;options
        </AddButton>

        <p className="text-xs text-cocoa-light">
          {optionCount} option{optionCount > 1 ? "s" : ""} dans cette étape. Une option « non disponible » reste enregistrée mais n&apos;apparaît
          plus sur le site. Supprimer une option ne modifie pas les commandes déjà reçues.
        </p>
      </div>

      <SaveBar dirty={editor.dirty} status={editor.status} error={editor.error} onSave={editor.save} onReset={editor.reset} />
    </>
  );
}
