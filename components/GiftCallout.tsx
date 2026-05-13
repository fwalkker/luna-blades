import Image from "next/image";

export default function GiftCallout() {
  return (
    <section id="gift" className="px-5 py-28 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <div className="relative grid gap-px overflow-hidden rounded-lg border border-(--color-hairline-strong) bg-(--color-hairline-strong) md:grid-cols-[1.05fr_1fr]">

          <div className="relative bg-(--color-ink-2) p-10 md:p-14">
            <p className="eyebrow text-(--color-amber)">For the gift-giver</p>
            <h2 className="h-display mt-5 text-[44px] leading-[0.95] md:text-[60px]">
              Arrives ready<br />
              <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>to use.</span>
            </h2>
            <ul className="mt-8 space-y-3">
              {[
                "Foam-cut presentation case, free",
                "Everything included",
                "Ready out of the box",
              ].map((line) => (
                <li key={line} className="flex items-baseline gap-3 text-[14px]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-amber)">✦</span>
                  <span className="text-(--color-bone-soft)">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[440px] overflow-hidden bg-(--color-ink)">
            <Image
              src="/brand/heirloom.webp"
              alt="Luna Blades saber arrives in a foam-cut presentation case"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Vertical rail */}
            <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 vrail mix-blend-difference">
              arrives ready · do not unwrap until
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
