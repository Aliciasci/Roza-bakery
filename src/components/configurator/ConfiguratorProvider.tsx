"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { CompositionDraft, CompositionStep, CompositionStepId, CustomerInfo, SiteInfo } from "@/lib/types";

const STORAGE_KEY = "roza:draft:v1";
export const LAST_ORDER_KEY = "roza:last-order:v1";

export const emptyCustomer: CustomerInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  pickupDate: "",
  pickupSlot: "",
  servings: "",
  message: "",
};

const emptyDraft: CompositionDraft = { selections: {}, customValues: {}, variants: {}, notes: {} };

interface State {
  draft: CompositionDraft;
  customer: CustomerInfo;
  stepIndex: number;
  maxReached: number;
}

const initialState: State = { draft: emptyDraft, customer: emptyCustomer, stepIndex: 0, maxReached: 0 };

type Action =
  | { type: "hydrate"; state: State }
  | { type: "toggle"; step: CompositionStep; optionId: string }
  | { type: "custom"; optionId: string; value: string }
  | { type: "variant"; optionId: string; value: string }
  | { type: "notes"; stepId: CompositionStepId; value: string }
  | { type: "customer"; patch: Partial<CustomerInfo> }
  | { type: "goto"; index: number }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "toggle": {
      const { step, optionId } = action;
      const current = state.draft.selections[step.id] ?? [];
      let next: string[];
      if (step.mode === "single") next = current.includes(optionId) && !step.required ? [] : [optionId];
      else next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...state, draft: { ...state.draft, selections: { ...state.draft.selections, [step.id]: next } } };
    }
    case "custom":
      return {
        ...state,
        draft: { ...state.draft, customValues: { ...state.draft.customValues, [action.optionId]: action.value } },
      };
    case "variant":
      return {
        ...state,
        draft: { ...state.draft, variants: { ...state.draft.variants, [action.optionId]: action.value } },
      };
    case "notes":
      return { ...state, draft: { ...state.draft, notes: { ...state.draft.notes, [action.stepId]: action.value } } };
    case "customer":
      return { ...state, customer: { ...state.customer, ...action.patch } };
    case "goto":
      return { ...state, stepIndex: action.index, maxReached: Math.max(state.maxReached, action.index) };
    case "reset":
      return initialState;
  }
}

/** Nettoie un brouillon relu depuis le stockage local (options supprimées entre-temps, etc.). */
function sanitize(raw: unknown, steps: CompositionStep[]): State | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<State>;
  const selections: CompositionDraft["selections"] = {};
  for (const step of steps) {
    const known = new Set(step.groups.flatMap((g) => g.options.map((o) => o.id)));
    const ids = (r.draft?.selections?.[step.id] ?? []).filter((id) => typeof id === "string" && known.has(id));
    selections[step.id] = step.mode === "single" ? ids.slice(0, 1) : ids;
  }
  const total = steps.length + 1;
  const clamp = (n: unknown) => (typeof n === "number" && n >= 0 && n < total ? Math.floor(n) : 0);
  return {
    draft: {
      selections,
      customValues: { ...(r.draft?.customValues ?? {}) },
      variants: { ...(r.draft?.variants ?? {}) },
      notes: { ...(r.draft?.notes ?? {}) },
    },
    customer: { ...emptyCustomer, ...(r.customer ?? {}) },
    stepIndex: clamp(r.stepIndex),
    maxReached: clamp(r.maxReached),
  };
}

export type ConfiguratorSite = Pick<
  SiteInfo,
  "minLeadDays" | "recommendedLeadDays" | "closedWeekdays" | "unavailableDates" | "pickupSlots" | "maxInspirationPhotos"
>;

interface ContextValue extends State {
  steps: CompositionStep[];
  site: ConfiguratorSite;
  /** Nombre total d'étapes (composition + informations). */
  totalSteps: number;
  hydrated: boolean;
  photos: File[];
  setPhotos: (files: File[]) => void;
  toggleOption: (step: CompositionStep, optionId: string) => void;
  setCustomValue: (optionId: string, value: string) => void;
  setVariant: (optionId: string, value: string) => void;
  setNotes: (stepId: CompositionStepId, value: string) => void;
  updateCustomer: (patch: Partial<CustomerInfo>) => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

const ConfiguratorContext = createContext<ContextValue | null>(null);

export function ConfiguratorProvider({
  steps,
  site,
  children,
}: {
  steps: CompositionStep[];
  site: ConfiguratorSite;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  // Les photos ne sont pas persistées (fichiers binaires) : elles vivent en mémoire.
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    try {
      const saved = sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"), steps);
      if (saved) dispatch({ type: "hydrate", state: saved });
    } catch {
      /* stockage indisponible (navigation privée…) : on démarre à vide */
    }
    setHydrated(true);
  }, [steps]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const toggleOption = useCallback((step: CompositionStep, optionId: string) => dispatch({ type: "toggle", step, optionId }), []);
  const setCustomValue = useCallback((optionId: string, value: string) => dispatch({ type: "custom", optionId, value }), []);
  const setVariant = useCallback((optionId: string, value: string) => dispatch({ type: "variant", optionId, value }), []);
  const setNotes = useCallback((stepId: CompositionStepId, value: string) => dispatch({ type: "notes", stepId, value }), []);
  const updateCustomer = useCallback((patch: Partial<CustomerInfo>) => dispatch({ type: "customer", patch }), []);
  const goToStep = useCallback((index: number) => dispatch({ type: "goto", index }), []);
  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    setPhotos([]);
  }, []);

  const value = useMemo<ContextValue>(
    () => ({
      ...state,
      steps,
      site,
      totalSteps: steps.length + 1,
      hydrated,
      photos,
      setPhotos,
      toggleOption,
      setCustomValue,
      setVariant,
      setNotes,
      updateCustomer,
      goToStep,
      reset,
    }),
    [state, steps, site, hydrated, photos, toggleOption, setCustomValue, setVariant, setNotes, updateCustomer, goToStep, reset],
  );

  return <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>;
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error("useConfigurator doit être utilisé dans <ConfiguratorProvider>");
  return ctx;
}
