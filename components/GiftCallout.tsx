import Link from "next/link";

export default function GiftCallout() {
  return (
    <section id="gift" className="px-5 py-28 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <div className="relative grid gap-px overflow-hidden rounded-lg border border-(--color-hairline-strong) bg-(--color-hairline-strong) md:grid-cols-[1.05fr_1fr]">

          <div className="relative bg-(--color-ink-2) p-10 md:p-14">
            <p className="eyebrow text-(--color-amber)">For the gift-giver</p>
            <h2 className="h-display mt-5 text-[44px] leading-[0.95] md:text-[60px]">
              Arrives like<br />
              <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>an heirloom.</span>
            </h2>
            <p className="mt-7 max-w-[42ch] text-[15px] leading-relaxed text-(--color-bone-soft)">
              Every saber ships in a foam-cut hardcase with a hand-stamped card and a folded note that explains what they're holding. It is the gift you give someone whose Star Wars phase never ended.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Foam-cut presentation case, free",
                "Optional handwritten note (add at checkout)",
                "Sealed gift wrap available — no peeking",
              ].map((line) => (
                <li key={line} className="flex items-baseline gap-3 text-[14px]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-amber)">✦</span>
                  <span className="text-(--color-bone-soft)">{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 border-b border-(--color-amber) pb-1 font-mono text-[11px] uppercase tracking-[0.26em] text-(--color-amber) transition hover:gap-3"
              >
                See gift-ready sabers
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden bg-(--color-ink) p-10 md:p-14">
            {/* Decorative case mockup — pure CSS */}
            <div className="absolute inset-x-10 top-1/2 -translate-y-1/2">
              <div className="aspect-[4/3] w-full rounded-[2px] bg-gradient-to-br from-[#1a2230] via-[#11161D] to-[#0A0E14] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
                <div className="relative h-full w-full overflow-hidden rounded-md border border-(--color-hairline-strong)">
                  {/* Foam cutout with saber silhouette */}
                  <div className="absolute inset-6 border-2 border-dashed border-(--color-hairline)" />
                  <div className="absolute left-1/2 top-1/2 h-[12px] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-gradient-to-r from-[#222] via-[#444] to-[#222] shadow-inner" />
                  <div className="absolute left-1/2 top-[calc(50%-2px)] h-[2px] w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#5BB8FF] to-transparent opacity-70 blur-[2px]" />

                  <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.3em] text-(--color-muted-2)">
                    Luna Blades · Case 01
                  </span>
                  <span className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.3em] text-(--color-muted-2)">
                    Hand-packed
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical rail */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 vrail">arrives ready · do not unwrap until</div>
          </div>
        </div>
      </div>
    </section>
  );
}
