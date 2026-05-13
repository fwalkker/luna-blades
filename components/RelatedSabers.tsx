"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { bladeHex } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import Price from "./Price";

export default function RelatedSabers({ related }: { related: Product[] }) {
  const add = useCart((s) => s.add);

  if (related.length === 0) return null;

  return (
    <section className="px-5 py-28 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <header className="mb-10 grid items-end gap-6 border-b border-(--color-hairline) pb-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="size-[6px] rounded-full bg-(--color-amber) transmit" />
              Plate ⁄ 06 — From the same forge
            </p>
            <h2 className="h-display mt-3 text-[36px] leading-[0.95] md:text-[56px]">
              Complete
              <span className="block text-(--color-blue)">your collection.</span>
            </h2>
          </div>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.26em] text-(--color-bone-soft) transition hover:text-(--color-amber)"
          >
            See all sabers →
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => {
            const onSale = p.compareAt && p.compareAt > p.price;
            const pct = onSale ? Math.round(((p.compareAt! - p.price) / p.compareAt!) * 100) : 0;
            const hex = bladeHex(p.blade);
            const soldOut = !p.available;
            return (
              <article
                key={p.handle}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2) transition hover:border-(--color-hairline-strong)"
              >
                <Link href={`/products/${p.handle}`} className="relative block aspect-square overflow-hidden">
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className={`object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03] ${
                      soldOut ? "opacity-40 grayscale" : ""
                    }`}
                  />
                  <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-muted-2)">
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                  {soldOut ? (
                    <span className="absolute right-3 top-3 rounded-full border border-(--color-hairline-strong) bg-(--color-ink) px-[8px] py-[4px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-bone-soft)">
                      Sold out
                    </span>
                  ) : onSale && (
                    <span className="absolute right-3 top-3 rounded-full bg-(--color-amber) px-[8px] py-[4px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-ink)">
                      −{pct}%
                    </span>
                  )}
                </Link>

                <div className="flex flex-col gap-3 p-5">
                  <div>
                    <Link
                      href={`/products/${p.handle}`}
                      className="font-display text-[18px] leading-[1.15] tracking-tight transition hover:text-(--color-amber)"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-1 line-clamp-1 font-display text-[12px] italic text-(--color-muted)">{p.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <Price
                      amount={p.price}
                      className="font-display text-[20px] tabular-nums text-(--color-amber)"
                    />
                    {onSale && (
                      <span className="font-mono text-[11px] tabular-nums text-(--color-muted) line-through">
                        <Price amount={p.compareAt!} />
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (soldOut) return;
                      add({
                        variantId: p.variantId ?? `handle:${p.handle}`,
                        handle: p.handle,
                        title: p.title,
                        price: p.price,
                        image: p.images[0],
                        blade: hex,
                        kind: "saber",
                      });
                    }}
                    disabled={soldOut}
                    className="mt-1 flex items-center justify-between rounded-full border border-(--color-hairline-strong) px-3 py-2 text-(--color-bone) transition hover:border-(--color-amber) hover:text-(--color-amber) disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-(--color-hairline-strong) disabled:hover:text-(--color-bone)"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
                      {soldOut ? "Sold out" : "Quick add"}
                    </span>
                    <span className="font-display text-[16px]">{soldOut ? "·" : "+"}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
