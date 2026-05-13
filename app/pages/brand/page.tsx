import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Our story — Luna Blades",
  description:
    "Why we started Luna Blades, what we make, and what we won't compromise on.",
};

const COMMUNITY_PHOTOS = Array.from({ length: 8 }, (_, i) =>
  `/brand/community/${String(i + 1).padStart(2, "0")}.webp`
);

export default async function BrandPage() {
  const products = await getAllProducts();
  const FEATURED = products.slice(0, 3);

  return (
    <article>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1230px] items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Brand · est. 2024</p>
            <h1 className="h-display mt-5 text-[44px] leading-[0.95] md:text-[80px]">
              Sabers
              <span className="block text-(--color-blue)">with purpose.</span>
            </h1>
            <p className="mt-7 max-w-[44ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">
              Luna Blades was started by three friends in a garage in California — one machinist, one electronics nerd, one kid who never stopped believing the toy aisle had been hiding the real thing. We built the saber we wanted to own, then we built it again with everything we'd learned, and then we did it eleven more times.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="/brand/hero.png"
              alt="Luna Blades"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-b border-(--color-hairline) bg-(--color-ink-2) px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1230px] gap-14 md:grid-cols-[280px_1fr]">
          <div>
            <p className="eyebrow">What we make</p>
            <h2 className="h-display mt-3 text-[36px] leading-[0.95] md:text-[48px]">
              Two things.
              <span className="block text-(--color-blue)">No compromise.</span>
            </h2>
          </div>
          <div className="space-y-7 text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">
            <p>
              <strong className="font-display text-(--color-bone) uppercase tracking-tight">Combat-ready hilts.</strong>{" "}
              T6 aircraft aluminum, machined and anodized in our shop. Reinforced threading, recessed switch geometry, brass pommel. They have weight in the hand.
            </p>
            <p>
              <strong className="font-display text-(--color-bone) uppercase tracking-tight">Pixel-strip blades.</strong>{" "}
              3mm dueling polycarbonate around an addressable LED strip. Twelve colors, ten sound fonts, motion-reactive audio over a 3W hi-fi speaker. All cycled from the hilt button.
            </p>
            <p>
              That's it. We don't sell costume props, we don't sell display-only pieces, we don't sell &quot;starter&quot; kits with toy electronics. Every saber on the rack is the same quality, top to bottom.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1230px] grid-cols-1 gap-px overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-hairline-strong) md:grid-cols-3">
          {[
            { v: "12,400+", l: "duelists worldwide" },
            { v: "4.9★", l: "across 400+ reviews" },
            { v: "0", l: "outsourced parts" },
          ].map((s) => (
            <div key={s.l} className="bg-(--color-ink-2) p-8 text-center md:p-10">
              <p className="font-display text-[40px] leading-none text-(--color-bone) md:text-[56px]">{s.v}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHILANTHROPY */}
      <section className="border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1230px] items-center gap-14 md:grid-cols-2">
          <div>
            <p className="eyebrow text-(--color-blue)">In the wild</p>
            <h2 className="h-display mt-4 text-[40px] leading-[0.95] md:text-[64px]">
              See us in
              <span className="block text-(--color-blue)">the community.</span>
            </h2>
            <p className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-(--color-bone-soft)">
              Meetups, conventions, garage duels, weddings, photo nights. The best part of this job is watching the sabers show up in real life. These are some of our favorite shots from the people who own them.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {COMMUNITY_PHOTOS.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink)"
              >
                <Image
                  src={src}
                  alt={`Community photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 120px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1230px]">
          <header className="mb-10 grid items-end gap-6 border-b border-(--color-hairline) pb-5 md:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow">From the rack</p>
              <h2 className="h-display mt-3 text-[36px] md:text-[56px]">Best sellers</h2>
            </div>
            <Link href="/" className="text-[12px] uppercase tracking-[0.22em] text-(--color-bone-soft) hover:text-(--color-bone)">
              View all 13 →
            </Link>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURED.map((p) => (
              <Link key={p.handle} href={`/products/${p.handle}`} className="group rounded-lg border border-(--color-hairline) bg-(--color-ink-2) p-6 transition hover:border-(--color-hairline-strong)">
                <div className="relative aspect-[4/5]">
                  <Image src={p.images[0]} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-contain p-3 transition group-hover:scale-[1.04]" />
                </div>
                <h3 className="mt-5 font-display text-[20px] uppercase tracking-tight">{p.title}</h3>
                <p className="mt-2 line-clamp-1 text-[13px] text-(--color-muted)">{p.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
