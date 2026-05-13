"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;        // Shopify gid://...Variant/... or synthetic for accessories
  handle: string;            // product handle (for linking back to PDP)
  title: string;
  price: number;
  image?: string;
  emoji?: string;
  blade: string;
  kind?: "saber" | "accessory";
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item) =>
        set((s) => {
          const addQty = item.qty ?? 1;
          const existing = s.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.variantId === item.variantId ? { ...i, qty: i.qty + addQty } : i
              ),
              isOpen: true,
            };
          }
          const { qty: _ignored, ...rest } = item;
          return { items: [...s.items, { ...rest, qty: addQty }], isOpen: true };
        }),
      remove: (variantId) =>
        set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      setQty: (variantId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.variantId !== variantId)
              : s.items.map((i) => (i.variantId === variantId ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "luna-cart-v2", version: 2 }
  )
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
