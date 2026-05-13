"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { bladeHex } from "@/lib/products";
import { money } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { useCurrency, formatPrice } from "@/lib/currency";

export default function BundleTiers({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const hex = bladeHex(product.blade);
  const p = product.price;
  const soldOut = !product.available;

  // Currency-aware formatter that falls back to USD until the client has hydrated
  // (zustand persisted state is unavailable on first server render).
  const code = useCurrency((s) => s.code);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const fmt = (n: number): string => (hydrated ? formatPrice(n, code) : money(n));

  const pair = Math.round(p * 2 * 0.85);
  const loadout = Math.round(p * 2 * 0.75) + 29 + 19;
  const loadoutCompare = Math.round(p * 2 + 29 + 19);

  const tiers = [
    {
      key: "solo",
      label: "Solo",
      bullet: "01",
      title: `One ${shortName(product.title)}`,
      lines: [`× 1 ${shortName(product.title)}`],
      price: p,
      compareAt: product.compareAt ?? null,
      saveLine: product.compareAt && product.compareAt > p ? `Save ${fmt(product.compareAt - p)}` : "",
      ctaLabel: `Add — ${fmt(p)}`,
      onClick: () => addOne(),
      emphasis: false,
    },
    {
      key: "duel",
      label: "Battle Pack",
      bullet: "02",
      title: "Two Sabers · Save 15%",
      lines: [`× 2 ${shortName(product.title)}`, "Pair them. Duel them. Gift one."],
      price: pair,
      compareAt: p * 2,
      saveLine: `Save ${fmt(p * 2 - pair)} when paired`,
      ctaLabel: `Add Pair — ${fmt(pair)}`,
      onClick: () => { addOne(); addOne(); },
      emphasis: true,
    },
    {
      key: "loadout",
      label: "Full Loadout",
      bullet: "03",
      title: "Two Sabers + Case + Plug",
      lines: [
        `× 2 ${shortName(product.title)}`,
        "+ Foam-cut presentation case",
        "+ Brass blade plug",
      ],
      price: loadout,
      compareAt: loadoutCompare,
      saveLine: `Save ${fmt(loadoutCompare - loadout)}`,
      ctaLabel: `Add Loadout — ${fmt(loadout)}`,
      onClick: () => { addOne(); addOne(); addCase(); addPlug(); },
      emphasis: false,
    },
  ];

  function addOne() {
    add({
      variantId: product.variantId ?? `handle:${product.handle}`,
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.images[0],
      blade: hex,
      kind: "saber",
    });
  }
  function addCase() {
    add({
      variantId: "accessory:gift-case",
      handle: "gift-case",
      title: "Foam-cut presentation case",
      price: 29,
      emoji: "▦",
      blade: "#D4A857",
      kind: "accessory",
    });
  }
  function addPlug() {
    add({
      variantId: "accessory:blade-plug",
      handle: "blade-plug",
      title: "Brass blade plug",
      price: 19,
      emoji: "◉",
      blade: "#D4A857",
      kind: "accessory",
    });
  }

  return (
    <section className="border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-20 md:px-9 md:py-28">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-10 grid items-end gap-6 border-b border-(--color-hairline) pb-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="size-[6px] animate-pulse rounded-full bg-(--color-amber)" />
              Loadout configurator · Plate ⁄ 02
            </p>
            <h2 className="h-display mt-3 text-[36px] leading-[0.95] md:text-[52px]">
              Buy more,
              <span className="block text-(--color-blue)">spend less per blade.</span>
            </h2>
          </div>
          <p className="max-w-[28ch] font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-muted) md:text-right">
            <span className="holo">⌬</span> Bundle pricing applied automatically at checkout
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg bg-(--color-hairline-strong) md:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.key}
              className={`relative flex flex-col p-7 md:p-9 ${t.emphasis ? "bg-(--color-ink) ring-2 ring-(--color-amber)/60" : "bg-(--color-ink)"}`}
            >
              {t.emphasis && (
                <span className="absolute -top-[12px] left-7 rounded-full bg-(--color-amber) px-3 py-[5px] font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-(--color-ink)">
                  Most popular
                </span>
              )}

              <header className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--color-muted)">
                  {t.bullet}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-amber)">
                  {t.label}
                </span>
              </header>

              <h3 className="font-display mt-6 text-[26px] leading-[1.05] tracking-tight">{t.title}</h3>

              <ul className="mt-5 space-y-2 border-t border-(--color-hairline) pt-5">
                {t.lines.map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-(--color-bone-soft)">
                    <span className="mt-[6px] block size-[5px] shrink-0 bg-(--color-amber)" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-baseline gap-3 border-t border-(--color-hairline) pt-6">
                <span className="font-display text-[36px] tabular-nums text-(--color-amber)">{fmt(t.price)}</span>
                {t.compareAt && t.compareAt > t.price && (
                  <span className="font-mono text-[14px] tabular-nums text-(--color-muted) line-through">
                    {fmt(t.compareAt)}
                  </span>
                )}
              </div>
              {t.saveLine && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-amber)">
                  {t.saveLine}
                </p>
              )}

              <button
                onClick={t.onClick}
                disabled={soldOut}
                className={`mt-7 flex items-center justify-between border px-5 py-4 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  t.emphasis
                    ? "border-(--color-amber) bg-(--color-amber) text-(--color-ink) hover:bg-(--color-amber-soft) disabled:hover:bg-(--color-amber)"
                    : "border-(--color-hairline-strong) text-(--color-bone) hover:border-(--color-amber) hover:text-(--color-amber) disabled:hover:border-(--color-hairline-strong) disabled:hover:text-(--color-bone)"
                }`}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                  {soldOut ? "Sold out" : t.ctaLabel}
                </span>
                <span className="font-display text-[20px]">{soldOut ? "·" : "→"}</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function shortName(title: string) {
  // strip leading "Luna " for cleaner inline mention
  return title.replace(/^Luna\s+/i, "");
}
