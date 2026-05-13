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
  /** Pre-fetched Shopify checkout URL — invalidated whenever items change. */
  checkoutUrl: string | null;
  /** True while a background prefetch to /api/checkout is in flight. */
  prefetchingCheckout: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
  prefetchCheckout: () => Promise<void>;
  invalidateCheckout: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutUrl: null,
      prefetchingCheckout: false,
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
              checkoutUrl: null,
            };
          }
          const { qty: _ignored, ...rest } = item;
          return {
            items: [...s.items, { ...rest, qty: addQty }],
            isOpen: true,
            checkoutUrl: null,
          };
        }),
      remove: (variantId) =>
        set((s) => ({
          items: s.items.filter((i) => i.variantId !== variantId),
          checkoutUrl: null,
        })),
      setQty: (variantId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.variantId !== variantId)
              : s.items.map((i) => (i.variantId === variantId ? { ...i, qty } : i)),
          checkoutUrl: null,
        })),
      clear: () => set({ items: [], checkoutUrl: null }),
      invalidateCheckout: () => set({ checkoutUrl: null }),
      prefetchCheckout: async () => {
        const s = get();
        if (s.prefetchingCheckout) return;
        if (s.checkoutUrl) return;
        if (s.items.length === 0) return;
        set({ prefetchingCheckout: true });
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: s.items.map((i) => ({
                variantId: i.variantId,
                handle: i.handle,
                qty: i.qty,
              })),
            }),
          });
          if (!res.ok) {
            set({ prefetchingCheckout: false });
            return;
          }
          const data = await res.json();
          // Only commit the URL if the cart hasn't changed in the meantime.
          if (get().items === s.items) {
            set({ checkoutUrl: data.checkoutUrl, prefetchingCheckout: false });
          } else {
            set({ prefetchingCheckout: false });
          }
        } catch {
          set({ prefetchingCheckout: false });
        }
      },
    }),
    {
      name: "luna-cart-v2",
      version: 2,
      // Don't persist the prefetched URL — it should be regenerated per session.
      partialize: (state) => ({
        items: state.items,
        isOpen: state.isOpen,
      }),
    }
  )
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
