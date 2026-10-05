"use client";

import { useState } from "react";
import { saveSite } from "@/app/admin/actions";
import { formatDateLong, todayISO } from "@/lib/dates";
import type { SiteInfo } from "@/lib/types";
import { AddButton, Card, Field, NumberInput, PageTitle, RowActions, SaveBar, TextInput, inputClass, makeId, move, useEditor } from "./ui";

const weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const weekOrder = [1, 2, 3, 4, 5, 6, 0];

export function SiteEditor({ initial }: { initial: SiteInfo }) {
  const editor = useEditor(initial, saveSite);
  const site = editor.value;
  const set = (patch: Partial<SiteInfo>) => editor.setValue({ ...site, ...patch });
  const [newDate, setNewDate] = useState("");
  const today = todayISO();

  return (
    <>
      <PageTitle title="Boutique" intro="Coordonnées affichées sur le site, délais de commande et disponibilités de retrait." />

      <div className="space-y-6">
        <Card>
          <h2 className="font-serif text-2xl">Coordonnées</h2>
          <p className="mt-1 text-sm text-cocoa">Un champ vide s&apos;affiche « [… à compléter] » sur le site.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextInput label="Nom" value={site.name} onChange={(v) => set({ name: v })} />
            <TextInput label="Ville" hint="Utile pour le référencement local" value={site.city} onChange={(v) => set({ city: v || null })} />
            <TextInput label="Description courte" value={site.shortDescription} multiline onChange={(v) => set({ shortDescription: v })} className="md:col-span-2" />
            <TextInput label="Adresse de retrait" value={site.address} onChange={(v) => set({ address: v || null })} className="md:col-span-2" />
            <TextInput label="Email" type="email" value={site.email} onChange={(v) => set({ email: v || null })} />
            <TextInput label="Téléphone" type="tel" value={site.phone} onChange={(v) => set({ phone: v || null })} />
            <TextInput label="Compte Instagram" placeholder="@rozabakery" value={site.instagramHandle} onChange={(v) => set({ instagramHandle: v || null })} />
            <TextInput
              label="Lien Instagram"
              placeholder="https://www.instagram.com/…"
              value={site.instagramUrl}
              onChange={(v) => set({ instagramUrl: v || null })}
            />
            <TextInput
              label="Horaires (une ligne par plage)"
              multiline
              placeholder={"Mardi – Samedi : 10h – 18h"}
              value={site.openingHours?.join("\n") ?? ""}
              onChange={(v) => set({ openingHours: v ? v.split("\n") : null })}
              className="md:col-span-2"
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-2xl">Délais et photos</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <NumberInput label="Délai minimum (jours)" min={0} max={60} value={site.minLeadDays} onChange={(v) => set({ minLeadDays: v })} />
            <NumberInput
              label="Délai conseillé (jours)"
              min={0}
              max={90}
              value={site.recommendedLeadDays}
              onChange={(v) => set({ recommendedLeadDays: v })}
            />
            <NumberInput
              label="Photos d'inspiration max."
              min={0}
              max={10}
              value={site.maxInspirationPhotos}
              onChange={(v) => set({ maxInspirationPhotos: v })}
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-serif text-2xl">Jours de retrait</h2>
          <p className="mt-1 text-sm text-cocoa">Décochez les jours où la boutique est fermée : ils ne pourront pas être choisis.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {weekOrder.map((d) => {
              const open = !site.closedWeekdays.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={open}
                  onClick={() =>
                    set({ closedWeekdays: open ? [...site.closedWeekdays, d].sort() : site.closedWeekdays.filter((x) => x !== d) })
                  }
                  className="min-h-11 rounded-full border border-chocolate/15 px-4 text-sm transition aria-pressed:border-chocolate aria-pressed:bg-chocolate aria-pressed:text-cream"
                >
                  {weekdays[d]}
                </button>
              );
            })}
          </div>

          <h3 className="mt-8 font-serif text-xl">Dates indisponibles</h3>
          <p className="mt-1 text-sm text-cocoa">Congés, agenda complet… Ces dates sont bloquées dans le calendrier.</p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <Field label="Ajouter une date">
              {(id) => <input id={id} type="date" min={today} className={inputClass} value={newDate} onChange={(e) => setNewDate(e.target.value)} />}
            </Field>
            <button
              type="button"
              disabled={!newDate || site.unavailableDates.includes(newDate)}
              onClick={() => {
                set({ unavailableDates: [...site.unavailableDates, newDate].sort() });
                setNewDate("");
              }}
              className="min-h-11 rounded-full bg-chocolate px-5 text-sm font-semibold text-cream disabled:opacity-40"
            >
              Bloquer
            </button>
          </div>
          {site.unavailableDates.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.unavailableDates.map((d) => (
                <li
                  key={d}
                  className={`flex items-center gap-1 rounded-full bg-rose-soft py-1 pl-3 pr-1 text-sm ${d < today ? "opacity-50" : ""}`}
                >
                  <span className="first-letter:uppercase">{formatDateLong(d)}</span>
                  <button
                    type="button"
                    aria-label={`Débloquer le ${formatDateLong(d)}`}
                    onClick={() => set({ unavailableDates: site.unavailableDates.filter((x) => x !== d) })}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-serif text-2xl">Créneaux de retrait</h2>
          <ul className="mt-4 space-y-3">
            {site.pickupSlots.map((slot, i) => (
              <li key={slot.id} className="flex flex-wrap items-end gap-3">
                <TextInput
                  label="Créneau"
                  value={slot.label}
                  onChange={(v) => set({ pickupSlots: site.pickupSlots.map((s, j) => (j === i ? { ...s, label: v } : s)) })}
                  className="min-w-40 flex-1"
                />
                <TextInput
                  label="Horaires (facultatif)"
                  placeholder="10h – 12h"
                  value={slot.hint}
                  onChange={(v) => set({ pickupSlots: site.pickupSlots.map((s, j) => (j === i ? { ...s, hint: v || undefined } : s)) })}
                  className="min-w-40 flex-1"
                />
                <RowActions
                  index={i}
                  length={site.pickupSlots.length}
                  label={slot.label}
                  onMove={(d) => set({ pickupSlots: move(site.pickupSlots, i, d) })}
                  onDelete={() => set({ pickupSlots: site.pickupSlots.filter((_, j) => j !== i) })}
                />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <AddButton onClick={() => set({ pickupSlots: [...site.pickupSlots, { id: makeId("creneau"), label: "" }] })}>Ajouter un créneau</AddButton>
          </div>
        </Card>
      </div>

      <SaveBar dirty={editor.dirty} status={editor.status} error={editor.error} onSave={editor.save} onReset={editor.reset} />
    </>
  );
}
