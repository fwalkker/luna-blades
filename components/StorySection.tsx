import type { Product } from "@/lib/products";

export default function StorySection({ product }: { product: Product }) {
  return (
    <section id="story" className="relative overflow-hidden bg-(--color-ink-2) px-5 py-32 md:px-9">
      <div className="mx-auto grid max-w-[1340px] gap-14 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-24">
        <div>
          <p className="eyebrow">For the kid you used to be</p>
          <h2 className="h-display mt-5 text-[44px] leading-[0.95] md:text-[68px]">
            You waved a paper-towel<br />
            tube around the living room.
          </h2>
          <h3 className="font-display mt-3 text-[36px] uppercase leading-[1] tracking-tight text-(--color-blue) md:text-[52px]">
            We remember.
          </h3>
        </div>

        <div className="relative">
          <p className="font-display text-[22px] leading-[1.55] text-(--color-bone-soft) md:text-[26px]">
            {product.story}
          </p>

          <div className="mt-10 flex items-baseline gap-5 border-t border-(--color-hairline-strong) pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--color-muted)">Origin</span>
            <span className="text-[14px] text-(--color-bone-soft)">
              Hand-assembled in California by people who own ten of these themselves.
            </span>
          </div>
        </div>
      </div>

      {/* Background ornament */}
      <div className="pointer-events-none absolute -right-20 top-1/2 hidden -translate-y-1/2 md:block">
        <span className="font-display text-[260px] leading-none text-(--color-bone) opacity-[0.025]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1', fontStyle: "italic" }}>
          luna
        </span>
      </div>
    </section>
  );
}
