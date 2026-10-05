"use client";

import { updateOrder } from "@/app/admin/actions";
import { orderStatuses } from "@/lib/order-status";
import type { Order, OrderStatus } from "@/lib/types";
import { Card, Field, SaveBar, inputClass, useEditor } from "./ui";

interface Value {
  status: OrderStatus;
  confirmedPrice: string;
  adminNotes: string;
}

export function OrderEditor({ order }: { order: Order }) {
  const editor = useEditor<Value>(
    {
      status: order.status,
      confirmedPrice: order.confirmedPrice === null ? "" : String(order.confirmedPrice),
      adminNotes: order.adminNotes ?? "",
    },
    (v) =>
      updateOrder(order.id, {
        status: v.status,
        confirmedPrice: v.confirmedPrice.trim() === "" ? null : Number(v.confirmedPrice.replace(",", ".")),
        adminNotes: v.adminNotes,
      }),
  );
  const v = editor.value;
  const set = (patch: Partial<Value>) => editor.setValue({ ...v, ...patch });
  const priceInvalid = v.confirmedPrice.trim() !== "" && !Number.isFinite(Number(v.confirmedPrice.replace(",", ".")));

  return (
    <Card>
      <h2 className="font-serif text-2xl">Suivi</h2>
      <div role="radiogroup" aria-label="Statut" className="mt-4 flex flex-wrap gap-2">
        {orderStatuses.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={v.status === s.id}
            onClick={() => set({ status: s.id })}
            className="min-h-10 rounded-full border border-chocolate/15 px-4 text-sm transition aria-checked:border-chocolate aria-checked:bg-chocolate aria-checked:text-cream"
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4">
        <Field label="Prix confirmé (€)" hint="Visible uniquement ici — à communiquer à la cliente.">
          {(id) => (
            <input
              id={id}
              inputMode="decimal"
              placeholder="Ex. 85"
              className={inputClass}
              aria-invalid={priceInvalid || undefined}
              value={v.confirmedPrice}
              onChange={(e) => set({ confirmedPrice: e.target.value })}
            />
          )}
        </Field>
        <Field label="Notes internes">
          {(id) => (
            <textarea
              id={id}
              rows={4}
              className={`${inputClass} resize-y`}
              placeholder="Acompte reçu, échange avec la cliente…"
              value={v.adminNotes}
              onChange={(e) => set({ adminNotes: e.target.value })}
            />
          )}
        </Field>
      </div>
      <SaveBar
        dirty={editor.dirty}
        status={priceInvalid ? "error" : editor.status}
        error={priceInvalid ? "Prix invalide." : editor.error}
        onSave={() => !priceInvalid && editor.save()}
        onReset={editor.reset}
      />
    </Card>
  );
}
