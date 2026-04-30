import Image from "next/image";
import type { Product } from "@/lib/products";

/**
 * Long alternating image-+-text rows, the classic deep-dive feature page.
 * Mirrors the structural pattern of a multi-section "Apps" block on a Shopify PDP.
 */
export default function FeatureBreakdown({ product }: { product: Product }) {
  const rows = [
    {
      tag: "01 · Hilt",
      title: "Forged from a single billet",
      body: "Each hilt is machined from one solid bar of T6 aircraft aluminum — no glued sections, no slip joints. The result is a tool that has weight where it needs it and silence where it doesn't.",
      bullets: ["T6 aluminum", "Brass choke point", "Recessed switch", "Threaded emitter"],
      img: product.images[0],
    },
    {
      tag: "02 · Blade",
      title: "Built to take a hit",
      body: "Our blades are 3mm dueling polycarbonate — the same grade police use for riot shields. Reinforced wall, deeper threading, a stronger emitter mount. We've drop-tested every length from 32 to 36 inches.",
      bullets: ["3mm polycarbonate wall", "Drop-tested to 8 ft", "Lifetime replacement", "Free spare blade with pixel models"],
      img: product.images[1] || product.images[0],
    },
    {
      tag: "03 · Sound",
      title: "Audio that earns the lights",
      body: "A 3W hi-fi speaker mounted close to the emitter, paired with a six-axis motion sensor. The result is clash, swing, and ignition response that doesn't feel canned. Ten sound fonts ship with each saber and you can sideload your own.",
      bullets: ["3W speaker", "6-axis IMU", "10 sound fonts", "Sideload via app"],
      img: product.images[2] || product.images[0],
    },
    {
      tag: "04 · Light",
      title: "Pixel-strip color, controlled from your phone",
      body: "An addressable LED strip runs the full length of the blade. Twelve preset colors, plus full RGB tuning from the Luna app. Animated effects — ignition crawl, unstable flicker, blaster blocks, force push.",
      bullets: ["Addressable LED", "12 presets + full RGB", "Animated effects", "App-tunable brightness"],
      img: product.images[3] || product.images[0],
    },
    {
      tag: "05 · Power",
      title: "USB-C, replaceable cell",
      body: "A high-density 18650 cell hidden under the threaded pommel. Charges from empty in 90 minutes via USB-C. Rated for 1,000+ cycles, and replaceable when the day comes.",
      bullets: ["USB-C charging", "18650 cell", "1,000+ cycles", "User-replaceable"],
      img: product.images[4] || product.images[0],
    },
    {
      tag: "06 · Box",
      title: "Arrives like an heirloom",
      body: "Foam-cut presentation case, hand-stamped quick-start, and a folded note that explains what they're holding. The gift that doesn't need to be unwrapped twice.",
      bullets: ["Foam-cut case", "Hand-stamped card", "Optional gift wrap", "Free over $99"],
      img: product.images[5] || product.images[0],
    },
  ];

  return (
    <section className="border-y border-(--color-hairline) px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1230px]">
        <header className="mb-12 max-w-[44ch] md:mb-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">A long look</p>
          <h2 className="font-display mt-4 text-[36px] uppercase leading-[0.95] tracking-tight md:text-[56px]">
            Every part, in detail.
          </h2>
        </header>

        <div className="space-y-20 md:space-y-28">
          {rows.map((r, i) => (
            <article
              key={r.tag}
              className={`grid items-center gap-8 md:gap-16 ${
                i % 2 === 0 ? "md:grid-cols-[1fr_1.05fr]" : "md:grid-cols-[1.05fr_1fr]"
              }`}
            >
              <div className={i % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2)">
                  <Image
                    src={r.img}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-6"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
                <p className="text-[11px] uppercase tracking-[0.24em] text-(--color-blue)">{r.tag}</p>
                <h3 className="font-display mt-4 text-[28px] uppercase leading-[1.05] tracking-tight md:text-[40px]">
                  {r.title}
                </h3>
                <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[16px]">
                  {r.body}
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-2 text-[13px] text-(--color-bone-soft)">
                      <span className="text-(--color-blue)">+</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
