"use client";

import type { ReactNode } from "react";
import { CalendarIcon, MinusIcon, PlusIcon, StoreIcon } from "@/components/ui/Icons";
import { useI18n } from "@/i18n/client";
import { checkPickupDate, formatDateLong } from "@/lib/dates";
import { LIMITS, type FieldErrors } from "@/lib/validation";
import type { CustomerInfo } from "@/lib/types";
import { useConfigurator } from "./ConfiguratorProvider";
import { PhotoUploader } from "./PhotoUploader";
import { PickupCalendar } from "./PickupCalendar";

type Errors = FieldErrors<keyof CustomerInfo>;

function Field({
  id,
  label,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} id={`${id}-label`} className="mb-2 block text-sm font-semibold text-chocolate">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-cocoa">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 animate-fade-in text-sm text-berry">
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, error?: string) => (error ? `${id}-error` : undefined);

export function CustomerStep({ errors }: { errors: Errors }) {
  const { customer, updateCustomer, site, photos, setPhotos } = useConfigurator();
  const { locale, t } = useI18n();
  const tc = t.customer;
  const dateStatus = customer.pickupDate ? checkPickupDate(customer.pickupDate, site) : null;
  const servings = Number(customer.servings) || 0;

  const input = (key: keyof CustomerInfo, props: React.InputHTMLAttributes<HTMLInputElement>) => ({
    id: `f-${key}`,
    name: key,
    value: customer[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateCustomer({ [key]: e.target.value }),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": describe(`f-${key}`, errors[key]),
    className: "field",
    ...props,
  });

  return (
    <div className="space-y-12">
      {/* Rappel des conditions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <p className="flex items-start gap-3 rounded-2xl bg-rose-soft/80 p-4 text-sm leading-snug text-chocolate">
          <CalendarIcon className="mt-0.5 h-5 w-5 shrink-0" />
          {tc.leadNotice(site.minLeadDays, site.recommendedLeadDays)}
        </p>
        <p className="flex items-start gap-3 rounded-2xl bg-sage-soft p-4 text-sm leading-snug text-chocolate">
          <StoreIcon className="mt-0.5 h-5 w-5 shrink-0" />
          {tc.pickupNotice}
        </p>
      </div>

      {/* Coordonnées */}
      <fieldset>
        <legend className="mb-5 font-serif text-[1.75rem] leading-tight">{tc.contactLegend}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="f-firstName" label={tc.firstName} error={errors.firstName}>
            <input {...input("firstName", { autoComplete: "given-name", maxLength: LIMITS.name })} />
          </Field>
          <Field id="f-lastName" label={tc.lastName} error={errors.lastName}>
            <input {...input("lastName", { autoComplete: "family-name", maxLength: LIMITS.name })} />
          </Field>
          <Field id="f-email" label={tc.email} error={errors.email}>
            <input {...input("email", { type: "email", autoComplete: "email", inputMode: "email", maxLength: LIMITS.email })} />
          </Field>
          <Field id="f-phone" label={tc.phone} error={errors.phone}>
            <input {...input("phone", { type: "tel", autoComplete: "tel", inputMode: "tel", maxLength: LIMITS.phone })} />
          </Field>
        </div>
      </fieldset>

      {/* Retrait */}
      <fieldset>
        <legend className="mb-5 font-serif text-[1.75rem] leading-tight">{tc.pickupLegend}</legend>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <p id="f-pickupDate-label" className="mb-2 text-sm font-semibold text-chocolate">
              {tc.date}
            </p>
            <PickupCalendar
              value={customer.pickupDate}
              onChange={(iso) => updateCustomer({ pickupDate: iso })}
              site={site}
              labelledBy="f-pickupDate-label"
              describedBy={errors.pickupDate ? "f-pickupDate-error" : "f-pickupDate-hint"}
              invalid={Boolean(errors.pickupDate)}
            />
            <div aria-live="polite">
              {errors.pickupDate ? (
                <p id="f-pickupDate-error" className="mt-2 text-sm text-berry">
                  {errors.pickupDate}
                </p>
              ) : customer.pickupDate ? (
                <p id="f-pickupDate-hint" className="mt-3 text-sm text-chocolate">
                  {tc.pickupOn} <strong className="font-semibold">{formatDateLong(customer.pickupDate, locale)}</strong>
                  {dateStatus === "short-notice" && (
                    <span className="mt-1 block text-xs text-cocoa">
                      {tc.shortNotice(site.recommendedLeadDays)}
                    </span>
                  )}
                </p>
              ) : (
                <p id="f-pickupDate-hint" className="mt-2 text-xs text-cocoa">
                  {tc.dateHint(site.minLeadDays)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div role="radiogroup" aria-labelledby="f-pickupSlot-label" aria-describedby={describe("f-pickupSlot", errors.pickupSlot)}>
              <p id="f-pickupSlot-label" className="mb-2 text-sm font-semibold text-chocolate">
                {tc.slot}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {site.pickupSlots.map((slot) => {
                  const selected = customer.pickupSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => updateCustomer({ pickupSlot: slot.id })}
                      className={`min-h-14 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-300 active:scale-[0.97] ${
                        selected ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/15 bg-paper hover:border-chocolate/40"
                      }`}
                    >
                      <span className="block font-serif text-lg leading-tight">{slot.label}</span>
                      {slot.hint && <span className={`text-xs ${selected ? "text-cream/75" : "text-cocoa"}`}>{slot.hint}</span>}
                    </button>
                  );
                })}
              </div>
              {errors.pickupSlot && (
                <p id="f-pickupSlot-error" className="mt-2 text-sm text-berry">
                  {errors.pickupSlot}
                </p>
              )}
            </div>

            <Field id="f-servings" label={tc.servings} error={errors.servings}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={tc.minus}
                  onClick={() => updateCustomer({ servings: String(Math.max(1, servings - 1)) })}
                  className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-chocolate/15 bg-paper transition active:scale-90 hover:border-chocolate/40"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <input
                  {...input("servings", {
                    type: "number",
                    inputMode: "numeric",
                    min: 1,
                    max: LIMITS.servingsMax,
                    placeholder: tc.servingsPlaceholder,
                  })}
                  className="field text-center font-serif !text-2xl"
                />
                <button
                  type="button"
                  aria-label={tc.plus}
                  onClick={() => updateCustomer({ servings: String(Math.min(LIMITS.servingsMax, servings + 1)) })}
                  className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-chocolate/15 bg-paper transition active:scale-90 hover:border-chocolate/40"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </Field>
          </div>
        </div>
      </fieldset>

      {/* Message + photos */}
      <fieldset className="space-y-6">
        <legend className="mb-5 font-serif text-[1.75rem] leading-tight">{tc.detailsLegend}</legend>
        <Field id="f-message" label={tc.message} error={errors.message}>
          <textarea
            id="f-message"
            rows={4}
            className="field resize-y"
            placeholder={tc.messagePlaceholder}
            value={customer.message}
            maxLength={LIMITS.message}
            onChange={(e) => updateCustomer({ message: e.target.value })}
          />
        </Field>
        <PhotoUploader
          files={photos}
          onChange={setPhotos}
          max={site.maxInspirationPhotos}
          title={t.photos.titleInfo}
          description={t.photos.descriptionInfo}
        />
      </fieldset>
    </div>
  );
}
