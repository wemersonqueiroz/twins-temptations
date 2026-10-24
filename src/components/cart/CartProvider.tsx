"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  imageAlt: string;
  variantId: string | null;
  max: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** False until the saved cart has been read, to avoid flashing an empty cart. */
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "tt-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readSaved(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i.slug && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load the saved cart once, then keep tabs in sync.
  useEffect(() => {
    const load = () => {
      setItems(readSaved());
      setReady(true);
    };
    load();
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode or storage full: the cart still works for this visit.
    }
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) => (i.slug === item.slug ? { ...i, ...item, qty: Math.min(i.qty + qty, item.max) } : i));
      }
      return [...prev, { ...item, qty: Math.min(qty, item.max) }];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, i.max) } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = Math.round(items.reduce((n, i) => n + i.price * i.qty, 0) * 100) / 100;
    return { items, count, subtotal, ready, isOpen, open, close, add, setQty, remove, clear };
  }, [items, ready, isOpen, open, close, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Shopify cart permalink: sends the whole cart straight to Shopify checkout. */
export function shopifyCheckoutUrl(storeUrl: string, items: CartItem[]) {
  if (!storeUrl || !items.length || items.some((i) => !i.variantId)) return null;
  return `${storeUrl}/cart/${items.map((i) => `${i.variantId}:${i.qty}`).join(",")}`;
}
