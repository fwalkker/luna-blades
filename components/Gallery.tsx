"use client";

import Image from "next/image";
import { useState } from "react";
import type { BladeColor } from "@/lib/products";

export default function Gallery({ images, blade, title }: { images: string[]; blade: BladeColor; title: string }) {
  const [active, setActive] = useState<string | null>(null);
  const shots = images.slice(0, 6);

  return (
    <section className="px-5 py-28 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-10 flex items-end justify-between border-b border-(--color-hairline) pb-5">
          <div>
            <p className="eyebrow">Plate ⁄ 002</p>
            <h2 className="h-display mt-2 text-[44px] md:text-[64px]">From every angle.</h2>
          </div>
          <p className="hidden max-w-[24ch] text-[13px] text-(--color-muted) md:block">
            Real photography. No render trickery, no lifestyle stock.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {shots.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(src)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2) transition hover:border-(--color-hairline-strong)"
            >
              <Image
                src={src}
                alt={`${title} — view ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
                loading={i < 3 ? "eager" : "lazy"}
              />
              <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-muted-2)">
                {String(i + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
              </span>
              <span className="pointer-events-none absolute right-3 top-3 size-2 rounded-full border border-(--color-hairline-strong) opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/95 p-6"
        >
          <div className="relative aspect-square w-full max-w-[840px]">
            <Image src={active} alt={title} fill sizes="840px" className="object-contain" />
          </div>
          <button
            onClick={() => setActive(null)}
            className="absolute right-6 top-6 text-(--color-bone)"
            aria-label="Close"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
