"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart, cartSubtotal, type CartItem } from "@/lib/cart-store";
import { getBundleDiscount } from "@/lib/bundle-tiers";
import { trackInitiateCheckout } from "@/lib/analytics";
import Price from "./Price";

function CheckoutButton({ items, subtotal }: { items: CartItem[]; subtotal: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user hits Back from Shopify checkout, the browser restores this
  // page from bfcache with React state intact — the spinner would otherwise
  // stay up forever. Clear it on bfcache restore.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(false);
        setError(null);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      trackInitiateCheckout({
        items: items.map((i) => ({ handle: i.handle, qty: i.qty })),
        value: subtotal,
      });
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, handle: i.handle, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Checkout failed";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={go}
        disabled={loading}
        className="group relative w-full overflow-hidden bg-(--color-amber) py-4 font-mono text-[11px] uppercase tracking-[0.28em] text-(--color-ink) transition hover:bg-(--color-amber-soft) disabled:opacity-60"
      >
        <span className="relative z-10">{loading ? "Connecting…" : "Take it to checkout →"}</span>
      </button>
      {error && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8080]">
          {error}
        </p>
      )}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[200] grid place-items-center bg-black/75 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="size-12 animate-spin rounded-full border-2 border-(--color-amber) border-t-transparent" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-(--color-bone)">
              Taking you to checkout…
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default function CartDrawer() {
  const { items, isOpen, close, setQty } = useCart();
  const subtotal = cartSubtotal(items);

  // Bundle math — display only. Real money applied via Shopify automatic discounts.
  const saberQty = items
    .filter((i) => i.kind === "saber")
    .reduce((s, i) => s + i.qty, 0);
  const bundleDiscount = getBundleDiscount(saberQty);
  const total = Math.max(0, subtotal - bundleDiscount);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Cart"
        className={`fixed right-0 top-0 z-[81] flex h-[100dvh] w-full max-w-[440px] flex-col border-l border-(--color-hairline) bg-(--color-ink-2) transition-transform duration-400 ease-[cubic-bezier(0.2,0.6,0.15,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-(--color-hairline) px-6 py-5">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 className="font-display mt-1 text-[22px] tracking-tight">In the case</h2>
          </div>
          <button
            onClick={close}
            className="text-(--color-muted) transition hover:text-(--color-bone)"
            aria-label="Close cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 h-[1px] w-12 bg-(--color-hairline-strong)" />
              <p className="font-display text-[20px] text-(--color-bone-soft)">An empty case.</p>
              <p className="mt-2 max-w-[28ch] text-[13px] text-(--color-muted)">
                Pick a blade. We'll keep it lit until you're ready.
              </p>
              <button
                onClick={close}
                className="mt-6 border-b border-(--color-amber) pb-[2px] font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-amber)"
              >
                Browse sabers →
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4">
                  <div
                    className="relative grid size-[88px] shrink-0 place-items-center overflow-hidden rounded-md border border-(--color-hairline) bg-(--color-ink)"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill sizes="88px" className="object-contain p-2" />
                    ) : (
                      <span className="font-display text-[34px] text-(--color-amber)">{item.emoji || "✦"}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-display text-[15px] leading-tight">{item.title}</h3>
                    <p className="mt-1 font-mono text-[11px] text-(--color-muted)">
                      <Price amount={item.price} precise />
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-full border border-(--color-hairline-strong)">
                        <button
                          onClick={() => setQty(item.variantId, item.qty - 1)}
                          className="size-7 text-(--color-bone-soft) transition hover:bg-(--color-surface)"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="grid w-7 place-items-center font-mono text-[12px] tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.variantId, item.qty + 1)}
                          className="size-7 text-(--color-bone-soft) transition hover:bg-(--color-surface)"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-[12px] tabular-nums text-(--color-bone)">
                        <Price amount={item.price * item.qty} precise />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-(--color-hairline) px-6 py-5">
            <div className="mb-2 flex items-baseline justify-between text-[13px]">
              <span className="text-(--color-bone-soft)">Subtotal</span>
              <span
                className={`font-mono tabular-nums ${
                  bundleDiscount > 0
                    ? "text-(--color-muted) line-through"
                    : "text-(--color-bone)"
                }`}
              >
                <Price amount={subtotal} precise />
              </span>
            </div>
            {bundleDiscount > 0 && (
              <div className="mb-2 flex items-baseline justify-between text-[13px]">
                <span className="font-mono uppercase tracking-[0.16em] text-(--color-blue)">
                  Bundle savings · {saberQty} sabers
                </span>
                <span className="font-mono tabular-nums text-(--color-blue)">
                  −<Price amount={bundleDiscount} precise />
                </span>
              </div>
            )}
            <div className="mb-4 flex items-baseline justify-between border-t border-(--color-hairline) pt-3">
              <span className="eyebrow">Total</span>
              <Price
                amount={total}
                precise
                className="font-display text-[28px] tabular-nums tracking-tight"
              />
            </div>
            {bundleDiscount > 0 && (
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-blue)">
                You save <Price amount={bundleDiscount} /> with this bundle
              </p>
            )}
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-muted-2)">
              Shipping &amp; tax calculated at checkout
            </p>
            <CheckoutButton items={items} subtotal={total} />
          </footer>
        )}
      </aside>
    </>
  );
}
