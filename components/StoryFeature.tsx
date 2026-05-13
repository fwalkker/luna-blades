import Image from "next/image";
import { STORY_TILES } from "@/lib/placeholder-media";

const TILE_META = [
  { label: "Forged hilt", caption: "Single-billet T6 aluminum" },
  { label: "In motion",   caption: "Real footage, no edits" },
  { label: "Lit blade",   caption: "Pixel strip, full length" },
];

export default function StoryFeature() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1230px] text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">
          Made in Long Beach
        </p>
        <h2 className="font-display mx-auto mt-5 max-w-[20ch] text-[44px] uppercase leading-[0.95] tracking-tight md:text-[64px]">
          The saber you've always wanted
          <span className="block text-(--color-blue)"></span>
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">
          Hand-finished hilts. Combat-rated blades. Real metal in the hand and
          a sound that earns the lights. Built by people who own ten of these
          themselves.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STORY_TILES.map((src, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2)"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={src}
                  alt={TILE_META[i].label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-6"
                  loading="lazy"
                />
              </div>
              <figcaption className="border-t border-(--color-hairline) px-5 py-4 text-left">
                <p className="font-display text-[14px] uppercase tracking-tight">
                  {TILE_META[i].label}
                </p>
                <p className="mt-1 text-[12px] text-(--color-muted)">{TILE_META[i].caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
