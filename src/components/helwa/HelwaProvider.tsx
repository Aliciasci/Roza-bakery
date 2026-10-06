"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyCustomer, type ConfiguratorSite } from "@/components/configurator/ConfiguratorProvider";
import { HELWA_MAX_QUANTITY, cartLines, cartPieces, cartTotal } from "@/lib/helwa";
import type { CustomerInfo, HelwaCart, HelwaCategory, HelwaLine } from "@/lib/types";

const STORAGE_KEY = "roza:helwa:v1";
export const LAST_HELWA_ORDER_KEY = "roza:helwa:last-order:v1";

export interface LastHelwaOrder {
  reference: string;
  lines: HelwaLine[];
  total: number;
  customer: CustomerInfo;
}

interface ContextValue {
  categories: HelwaCategory[];
  site: ConfiguratorSite;
  hydrated: boolean;
  cart: HelwaCart;
  customer: CustomerInfo;
  /** Lignes du panier avec leurs sous-totaux, dans l'ordre du catalogue. */
  lines: HelwaLine[];
  total: number;
  pieces: number;
  setQuantity: (itemId: string, quantity: number) => void;
  updateCustomer: (patch: Partial<CustomerInfo>) => void;
  reset: () => void;
}

const HelwaContext = createContext<ContextValue | null>(null);

/** Garde uniquement les pièces encore au catalogue, avec des quantités valides. */
function sanitizeCart(raw: unknown, categories: HelwaCategory[]): HelwaCart {
  if (!raw || typeof raw !== "object") return {};
  const known = new Set(categories.flatMap((c) => c.items.map((i) => i.id)));
  const cart: HelwaCart = {};
  for (const [id, q] of Object.entries(raw as Record<string, unknown>)) {
    if (known.has(id) && typeof q === "number" && Number.isInteger(q) && q > 0) cart[id] = Math.min(q, HELWA_MAX_QUANTITY);
  }
  return cart;
}

export function HelwaProvider({
  categories,
  site,
  children,
}: {
  categories: HelwaCategory[];
  site: ConfiguratorSite;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<HelwaCart>({});
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { cart?: unknown; customer?: Partial<CustomerInfo> } | null;
      if (saved) {
        setCart(sanitizeCart(saved.cart, categories));
        setCustomer({ ...emptyCustomer, ...saved.customer });
      }
    } catch {
      /* stockage indisponible (navigation privée…) : panier vide */
    }
    setHydrated(true);
  }, [categories]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, customer }));
    } catch {
      /* ignore */
    }
  }, [cart, customer, hydrated]);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity > 0) next[itemId] = Math.min(Math.floor(quantity), HELWA_MAX_QUANTITY);
      else delete next[itemId];
      return next;
    });
  }, []);
  const updateCustomer = useCallback((patch: Partial<CustomerInfo>) => setCustomer((prev) => ({ ...prev, ...patch })), []);
  // Après l'envoi : panier vidé, coordonnées gardées pour la prochaine fois
  const reset = useCallback(() => {
    setCart({});
    setCustomer((prev) => ({ ...prev, pickupDate: "", pickupSlot: "", message: "" }));
  }, []);

  const value = useMemo<ContextValue>(() => {
    const lines = cartLines(categories, cart);
    return {
      categories,
      site,
      hydrated,
      cart,
      customer,
      lines,
      total: cartTotal(lines),
      pieces: cartPieces(lines),
      setQuantity,
      updateCustomer,
      reset,
    };
  }, [categories, site, hydrated, cart, customer, setQuantity, updateCustomer, reset]);

  return <HelwaContext.Provider value={value}>{children}</HelwaContext.Provider>;
}

export function useHelwa() {
  const ctx = useContext(HelwaContext);
  if (!ctx) throw new Error("useHelwa doit être utilisé dans <HelwaProvider>");
  return ctx;
}
