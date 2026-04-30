"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { ACCESSORIES, bladeHex } from "@/lib/products";
import { money } from "@/lib/format";
import { useCart } from "@/lib/cart-store";

const ADDON_IDS = ["gift-case", "extra-blade", "blade-plug"];

export default function FrequentlyBoughtTogether({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const hex = bladeHex(product.blade);

  const addons = useMemo(
    () => ACCESSORIES.filter((a) => ADDON_IDS.includes(a.id)),
    []
  );

  // Default: main + first two accessories selected
  const [selected, setSelected] = useState<Record<string, boolean>>({
    main: true,
    [addons[0].id]: true,
    [addons[1].id]: true,
    [addons[2].id]: false,
  });

  const items = [
    {
      key: "main",
      title: product.title,
      blurb: product.tagline,
      price: product.price,
      compareAt: product.compareAt,
      kind: "saber" as const,
      image: product.images[0],
      hex,
    },
    ...addons.map((a) => ({
      key: a.id,
      title: a.title,
      blurb: a.blurb,
      price: a.price,
      compareAt: a.compareAt,
      kind: "accessory" as const,
      emoji: a.emoji,
      hex: "#D4A857",
    })),
  ];

  const subtotal = items.filter((it) => selected[it.key]).reduce((s, it) => s + it.price, 0);
  const compareSum = items
    .filter((it) => selected[it.key])
    .reduce((s, it) => s + (it.compareAt ?? it.price), 0);
  const savings = compareSum - subtotal;
  const selectedCount = Object.values(selected).filter(Boolean).length;

  function addBundle() {
    if (selected.main) {
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
    for (const a of addons) {
      if (selected[a.id]) {
        add({
          variantId: `accessory:${a.id}`,
          handle: a.id,
          title: a.title,
          price: a.price,
          emoji: a.emoji,
          blade: "#D4A857",
          kind: "accessory",
        });
      }
    }
  }

  return (
    <section className="border-t border-(--color-hairline) bg-(--color-ink-2) px-5 py-24 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-10 flex items-end justify-between border-b border-(--color-hairline) pb-5">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="size-[6px] animate-pulse rounded-full bg-(--color-amber)" />
              Frequently bought together · Plate ⁄ 04
            </p>
            <h2 className="h-display mt-3 text-[36px] leading-[0.95] md:text-[52px]">
              Forge a complete
              <span className="block text-(--color-blue)">kit.</span>
            </h2>
          </div>
          <p className="hidden max-w-[28ch] text-[13px] text-(--color-muted) md:block">
            Toggle what you want. The bundle math runs live; we ship it all together in one box.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_320px] md:items-stretch">
          {/* Items grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => {
              const on = selected[it.key];
              return (
                <button
                  key={it.key}
                  onClick={() => setSelected((s) => ({ ...s, [it.key]: !s[it.key] }))}
                  className={`group relative flex flex-col rounded-lg border bg-(--color-ink) p-5 text-left transition ${
                    on ? "border-(--color-amber)" : "border-(--color-hairline) opacity-65 hover:opacity-90"
                  }`}
                >
                  {/* Toggle indicator */}
                  <span
                    className={`absolute right-3 top-3 grid size-5 place-items-center rounded-md border ${
                      on ? "border-(--color-amber) bg-(--color-amber)" : "border-(--color-hairline-strong)"
                    }`}
                  >
                    {on && (
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5l3 3 7-7" stroke="#0A0E14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>

                  <div className="relative mt-2 grid h-[110px] place-items-center">
                    {it.kind === "saber" ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={it.image!}
                          alt={it.title}
                          fill
                          sizes="240px"
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <span className="font-display text-[64px] leading-none text-(--color-amber)">
                        {it.emoji}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display mt-5 text-[16px] leading-[1.15] tracking-tight">
                    {it.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12px] text-(--color-muted)">{it.blurb}</p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-[18px] tabular-nums text-(--color-amber)">
                      {money(it.price)}
                    </span>
                    {it.compareAt && it.compareAt > it.price && (
                      <span className="font-mono text-[11px] tabular-nums text-(--color-muted) line-through">
                        {money(it.compareAt)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Summary panel */}
          <aside className="relative flex flex-col justify-between rounded-lg border border-(--color-amber)/40 bg-(--color-ink) p-7">

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--color-amber)">
                Bundle math
              </p>
              <h3 className="font-display mt-3 text-[28px] leading-[1.1] tracking-tight">
                {selectedCount} item{selectedCount === 1 ? "" : "s"} in the kit
              </h3>

              <ul className="mt-5 space-y-2 text-[13px] text-(--color-bone-soft)">
                {items.filter((it) => selected[it.key]).map((it) => (
                  <li key={it.key} className="flex items-baseline justify-between gap-3">
                    <span className="truncate">{it.title}</span>
                    <span className="shrink-0 font-mono text-[12px] tabular-nums text-(--color-muted)">
                      {money(it.price)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-(--color-hairline) pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">
                    Bundle total
                  </span>
                  <span className="font-display text-[34px] tabular-nums text-(--color-amber)">
                    {money(subtotal)}
                  </span>
                </div>
                {savings > 0 && (
                  <p className="mt-1 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-amber)">
                    You save {money(savings)} vs. buying separately
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={addBundle}
              disabled={selectedCount === 0}
              className="mt-6 flex items-center justify-between rounded-full border border-(--color-amber) bg-(--color-amber) px-5 py-4 text-(--color-ink) transition hover:bg-(--color-amber-soft) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.24em]">
                Add bundle — {money(subtotal)}
              </span>
              <span className="font-display text-[20px]">→</span>
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
