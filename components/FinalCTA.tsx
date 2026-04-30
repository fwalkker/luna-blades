"use client";

import Image from "next/image";
import type { Product } from "@/lib/products";
import { bladeHex } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import Price from "./Price";

export default function FinalCTA({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const hex = bladeHex(product.blade);
  const onSale = product.compareAt && product.compareAt > product.price;

  return (
    <section className="relative overflow-hidden border-y border-(--color-hairline) px-5 py-32 md:px-9 md:py-40">

      <div className="relative mx-auto max-w-[1340px] text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <span className="size-[6px] rounded-full bg-(--color-amber) transmit" />
          Decision time · transmission · 007
        </p>
        <p className="font-jedi mt-4 text-[11px] tracking-[0.4em] text-(--color-amber)">
          A LONG TIME AGO IN A FORGE FAR AWAY
        </p>

        <h2 className="h-display mx-auto mt-6 max-w-[18ch] text-[56px] leading-[0.95] md:text-[100px]">
          Pick it up.
          <span className="block text-(--color-blue)">Don't overthink it.</span>
        </h2>

        <div className="mx-auto mt-12 grid w-full max-w-[440px] gap-3">
          <div className="relative mx-auto h-[140px] w-[260px]">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="260px"
              className="object-contain"
            />
          </div>

          <div className="mt-4 flex flex-col items-center gap-2 font-display">
            <span className="text-[20px]">{product.title}</span>
            <div className="flex items-baseline gap-3">
              <Price
                amount={product.price}
                className="text-[28px] tabular-nums text-(--color-amber)"
              />
              {onSale && (
                <span className="font-mono text-[14px] tabular-nums text-(--color-muted) line-through">
                  <Price amount={product.compareAt!} />
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() =>
              add({
                variantId: product.variantId ?? `handle:${product.handle}`,
                handle: product.handle,
                title: product.title,
                price: product.price,
                image: product.images[0],
                blade: hex,
              })
            }
            className="group mt-4 flex items-center justify-center gap-3 rounded-full border border-(--color-amber) bg-(--color-amber) py-5 text-(--color-ink) transition hover:bg-(--color-amber-soft)"
          >
            <span className="font-mono text-[12px] uppercase tracking-[0.3em]">Take it home</span>
            <span className="font-display text-[22px] transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        <p className="mx-auto mt-10 max-w-[40ch] font-mono text-[10px] uppercase tracking-[0.24em] text-(--color-muted)">
          Free shipping over $99 · 30-day returns · 1-year warranty
        </p>
      </div>
    </section>
  );
}
